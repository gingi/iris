if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require) {
    function Node(graph, meta) {
    	var _meta = {};
    	this.neighbors = function () {
			return graph.neighbors(this);
		};
        this.link = function (neighbor) {
			graph.link(this, neighbor);
            return this;
		};
        this.attribute = function (key, val) {
			_meta[key] = val;
            return this;
		};
        this.meta = function (input) {
            if (input) {
                for (var prop in input) {
                    _meta[prop] = input[prop];
                }
                return this;
            }
            return _meta;
        };
        this.get = function (key) { return _meta[key] },
        this.set = this.attribute;
        if (meta) this.meta(meta);
        return this;
    }
    function isNode(obj) {
        return obj instanceof Node;
    }
    
    function Edge(params) {
        params = params || {};
        this.source = params.source;
        this.target = params.target;
        this.meta   = params.meta;
        this.json   = function () {
            return {
                source: this.source,
                target: this.target,
                meta:   this.meta
            }
        }
    }

    function isInt(val) {
        return !isNaN(parseInt(val)) && (parseFloat(val) == parseInt(val)); 
    }

    var _INDEXED = new Object(1);
    var Graph = function (data, type) {
        var self = this;
        var idSequence = 0;
        var nodes = {};
        var edges = {};
        var lookup = {}; // Used for client node lookup by external ID
        
        self.link = function (n1, n2, meta) {
            function findId(obj) {
                if (isNode(obj)) { return obj._id }
                var n = lookup[obj];
                return n ? n._id : null;
            }
            n1 = findId(n1);
            n2 = findId(n2);
            var key = [n1, n2].sort().join(" ");
            return edges[key] = new Edge({
                source: nodes[n1],
                target: nodes[n2],
                meta: meta
            });
        }
        self.addNode = function (obj) {
            var node;
            if (isNode(obj)) {
                node = new Node(this, obj.meta());
                if (obj.get('id')) {
                    lookup[obj.get('id')] = node;
                }
            } else {
                node = new Node(this);
                if (typeof obj === "object") { // We're passed an assoc. list
                    node.meta(obj);
                } else if (obj != null) { // obj is an id (some scalar)
                    lookup[obj] = node;
                    node.set("id", obj);
                }
            }
            node._id = idSequence;
            nodes[idSequence++] = node;
            return node;
        }
        self.addEdge = function (edge) {
            if (edge instanceof Edge) { // Reassign source/target
                var source = this.findNode(edge.source.meta());
                var target = this.findNode(edge.target.meta());
                if (source != null && target != null) {
                    return self.link(source, target, edge.meta);
                }
                return null;
            }
            var meta = edge;
            return type == _INDEXED
                ? self.link(nodes[edge.source], nodes[edge.target], meta)
                : self.link(edge.source, edge.target, meta);
        }
        self.neighbors = function (node) {
            var arr = [];
            for (var key in edges) {
                var nodeId = node._id;
                var edge = edges[key];
                if (edge.source._id == nodeId)
                    arr.push(edge.target);
                else if (edge.target._id == nodeId)
                    arr.push(edge.source);
            }
            return arr;
        }
        self.nodes = function () {
            var arr = [];
            for (var k in nodes) { arr.push(nodes[k]); }
            return arr;
        }
        self.edges = function () {
            var arr = [];
            for (var k in edges) { arr.push(edges[k]); }
            return arr;
        }
        self.json = function () {
            var jsonNodes = [];
            var jsonEdges = [];
            var nodeIndex = {};
            for (var k in nodes) {
                var node = nodes[k];
                var meta = node.meta();
                var nodeId = node._id;
                nodeIndex[nodeId] = jsonNodes.length;
                jsonNodes.push(meta);
            }
            for (var key in edges) {
                var edge = edges[key];
                var attributes = {};
                for (var a in edge.meta) {
                    if (edge.meta.hasOwnProperty(a)) {
                        attributes[a] = edge.meta[a];
                    }
                }
                attributes.source = nodeIndex[edge.source._id],
                attributes.target = nodeIndex[edge.target._id]
                jsonEdges.push(attributes);
            }
            return { nodes: jsonNodes, edges: jsonEdges };
        }
        self.eachNode = function (callback) {
            for (var i in nodes) {
                callback(nodes[i]);
            }
        }
        self.findNode = function (meta) {
            for (var i in nodes) {
                var node = nodes[i];
                found = true;
                for (var prop in meta) {
                    if (node.get(prop) != meta[prop])
                        found = false;
                }
                if (found) {
                    return node;
                }
            }
            return null;
        }
        self.findEdge = function (meta1, meta2) {
            var n1 = isNode(meta1) ? meta1 : self.findNode(meta1);
            var n2 = isNode(meta2) ? meta2 : self.findNode(meta2);
            if (n1 != null && n2 != null) {
                for (var key in edges) {
                    var edge = edges[key];
                    if ((edge.source == n1 && edge.target == n2) ||
                        (edge.target == n1 && edge.source == n2)) 
                        return edge;
                }
            }
            return null;
        }

        function initializeData(graph) {
            if (graph.nodes) {
                graph.nodes.forEach(function (meta) {
                    self.addNode(meta);
                })
            }
            if (graph.edges) {
                graph.edges.forEach(function (edge) {
                    self.addEdge(edge);
                })
            }
        }
        if (data) initializeData(data);
        return self;
    }
    Graph.INDEXED = _INDEXED;

    return Graph;
})