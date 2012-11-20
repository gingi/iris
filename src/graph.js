var util = require('util');

function Node(graph, id) {
	var meta = {};
	var node = {
        id: id,
		neighbors: function () {
			return graph.neighbors(this);
		},
		link: function (neighbor) {
			graph.link(this, neighbor);
            return this;
		},
		attribute: function (key, val) {
			meta[key] = val;
            return this;
		},
		meta: function () { return meta; }
	};
	return node;
}

function Graph() {
    var idSequence = 0;
    var nodes = {};
    var edges = {};
    return {
        link: function (n1, n2, meta) {
            var key = [n1.id, n2.id].sort().join(" ");
            edges[key] = { source: n1, target: n2, meta: meta }
            return this;
        },
        createNode: function (id) {
            id = (id || idSequence++);
            var node = new Node(this, id);
            nodes[node.id] = node;
            return node;
        },
        neighbors: function (node) {
            var arr = [];
            for (var key in edges) {
                var edge = edges[key];
                if (edge.source.id == node.id)      arr.push(edge.target);
                else if (edge.target.id == node.id) arr.push(edge.source);
            }
            return arr;
        },
        nodes: function () {
            var arr = [];
            for (var k in nodes) { arr.push(nodes[k]); }
            return arr;
        },
        edges: function () {
            var arr = [];
            for (var k in edges) { arr.push(edges[k]); }
            return arr;
        },
        json: function () {
            var jsonNodes = [];
            var jsonEdges = [];
            for (var k in nodes) {
                var node = nodes[k];
                var meta = node.meta();
                meta.id = node.id;
                jsonNodes.push(meta);
            }
            for (var key in edges) {
                var edge = edges[key];
                var attributes = {};
                attributes.source = edge.source.id;
                attributes.target = edge.target.id;
                for (var a in edge.meta) {
                    if (edge.meta.hasOwnProperty(a)) {
                        attributes[a] = edge.meta[a];
                    }
                }
                jsonEdges.push(attributes);
            }
            return { nodes: jsonNodes, edges: jsonEdges };
        }
    };
}

exports.createGraph = function () {
    return new Graph();
}