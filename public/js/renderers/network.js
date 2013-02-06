define(['jquery', 'd3', 'underscore',
    'util/dock', 'util/eventemitter', 'util/hud'],
function ($, d3, _, Dock, EventEmitter, HUD) {
    
    var defaults = {
        dock: true,
        joinAttribute: "name",
        nodeLabel: {}
    };
    
    var Physics = {
        GENE:    { charge: -100 },
        CLUSTER: { charge: -120 },
        "GENE:GENE": {
            linkDistance:  80,
            linkStrength:  0.1
        },
        "CLUSTER:GENE": {
            linkDistance:  120,
            linkStrength:  0.7,
        },
        "CLUSTER:CLUSTER": {
            linkDistance:   100,
            linkStrength:   1
        },
        default: {
            linkDistance:   80,
            linkStrength:    1,
            charge:        -70
        }
    }
    
    var groupColor = {};
    
    var NODE_SIZE  = {
        GENE: 8,
        CLUSTER: 20
    };
    var color = d3.scale.category20();
    
    var Network = function (options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var $el = $(options.element);
        var _idSequence = 1;
        var _autoUpdate = true;
        var Foci = {
            CLUSTER: {
                x: Math.round($el.width() / 2),
                y: Math.round($el.height() * 5 / 6),
                spreadx: Math.floor($el.width() * 0.8),
                spready: 50,
                binx: 10,
                biny: 3
            },
            GENE:    {
                x: Math.round($el.width() / 2),
                y: Math.round($el.height() * 1 / 6),
                spreadx: Math.floor($el.width() * 0.5),
                spready: Math.floor($el.height() * 0.1),
                binx: 10,
                biny: 1
            }
        }
        for (var f in Foci) {
            Foci[f].intx   = Math.floor(Foci[f].spreadx / Foci[f].binx);
            Foci[f].inty   = Math.floor(Foci[f].spready / Foci[f].biny);
            Foci[f].startx = Math.floor(Foci[f].x - Foci[f].spreadx / 2);
            Foci[f].starty = Math.floor(Foci[f].y - Foci[f].spready / 2);
        }
        
        function setColor(node) {
            if (!node.hasOwnProperty("group")) {
                groupColor[node.id] = color(null);
            } else if (!groupColor.hasOwnProperty(node.id)) {
                groupColor[node.id] = color(node.group);
            }
        }
        
        self.findOrCreateNode = function (node, idKey) {
            var ret;
            var existing = self.findNode(node[idKey], idKey);
            if (existing) {
                var tmp = _.extend({}, node, existing);
                ret = _.extend(existing, tmp);
            } else {
                node.id = _idSequence++;
                nodes.push(node);
                ret = node;
                labelStatus(node);
                setColor(node);
            }
            if (_autoUpdate) update();
            return ret;
        }
        
        function labelStatus(node) {
            var label = true;
            for (var prop in options.nodeLabel) {
                if (!node.hasOwnProperty(prop) ||
                     node[prop] != options.nodeLabel[prop]) {
                    label = false;
                }
            }
            if (label) node.hasLabel = true;
        }
        
        self.addNode = function (node) {
            if (node.id) {
                node.id = parseInt(node.id);
                var existing = self.findNode(node.id);
                if (!existing) {
                    nodes.push(node);
                    _idSequence = d3.max(_idSequence, node.id + 1);
                }
                labelStatus(node);
            } else {
                node.id = _idSequence++;
                nodes.push(node);
                setColor(node);
            }
            if (_autoUpdate) update();
            return node.id;
        }

        self.removeNode = function (id) {
            var i = 0;
            var n = self.findNode(id);
            if (n == null) return;
            while (i < links.length) {
                if ((links[i].source == n) ||
                    (links[i].target == n))
                    links.splice(i,1);
                else i++;
            }
            nodes.splice(findNodeIndex(id),1);
            update();
            return this;
        }
        
        self.setData  = function (data) {
            this.setNodes(data.nodes);
            this.setEdges(data.edges);
            return this;
        }
        
        this.setNodes = function (nodesArg) {
            force.nodes(nodesArg);
            nodes = force.nodes();
            _idSequence = d3.max(nodes, function (n) { return n.id }) + 1;
            return this;
        }
        
        this.setEdges = function (edgesArg) {
            force.links(edgesArg);
            links = force.links();
            return this;
        }

        this.addEdge = function (edge) {
            edge.source = this.findNode(edge.source);
            edge.target = this.findNode(edge.target);
            links.push(edge);
            if (_autoUpdate) update();
            return this;
        }
        
        self.addLink = function (source, target, params) {
            var edge = {
                source: this.findNode(source),
                target: this.findNode(target),
            };
            if (edge.source == null || edge.target == null) {
                console.log("Cannot find edge for ", source, target);
            }
            for (var p in params) {
                edge[p] = params[p];
            }
            links.push(edge);
            if (_autoUpdate) update();
            return this;
        }
        
        self.highlight = function (name) {
            d3.select("#" + name)
                .style("stroke", "yellow")
                .style("stroke-width", 3)
                .style("stroke-location", "outside")
            return this;
        }
        
        self.render = function () { update(); return this; }

        var _nodeCache = {};
        self.findNode = function(key, type) {
            type = (type || 'id');
            var hash = [key, type].join("-");
            if (_nodeCache.hasOwnProperty(hash)) return _nodeCache[hash];
            for (var i in nodes) {
                if (nodes[i][type] === key) {
                    _nodeCache[hash] = nodes[i];
                    return nodes[i]
                }
            }
            return null;
        }
        this.findEdge = function (source, target) {
            for (var i in links) {
                if ((links[i].source.id == source.id &&
                     links[i].target.id == target.id) ||
                    (links[i].source.id == target.id &&
                     links[i].target.id == source.id))
                    return links[i];
            }
            return null;
        }
        
        this.find = function (key, type) {
            type = (type || 'id');
            var result = [];
            for (var i in nodes) {
                if (nodes[i][type] === key) result.push(nodes[i]);
            }
            return result;
        }

        function findNodeIndex(id) {
            for (var i in nodes) { if (nodes[i].id === id) return i };
        }

        var w = $el.width(),
            h = $el.height();

        var _paused = false;
        var vis = this.vis = d3.select($el[0]).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

/*
for (var t in Foci) {
    var f = Foci[t];
    for (var x = f.startx; x < f.startx + f.spreadx; x += f.intx) {
        for (var y = f.starty; y < f.starty + f.spready; y += f.inty) {
            vis.append("circle")
                .attr("cx", x).attr("cy", y).attr("r", 3).style("fill", "pink");
        }
    }
}
*/
            
        var dock;
        if (options.dock) { dock = new Dock(vis) };
        
        // This order matters (nodes painted on top of links)
        var linkG = vis.append("g").attr("id", "networkLinks");
        var nodeG = vis.append("g").attr("id", "networkNodes");
        var labelG = vis.append("g").attr("id", "networkLabels");
        
        var physics = function (key, prop) {
            if (!Physics.hasOwnProperty(key)) key = "default";
            var ret = Physics[key].hasOwnProperty(prop)
                ? Physics[key][prop] : Physics["default"][prop];
            return ret;
        }
        
        function nodePhysics(node, prop) {
            return physics(node.type || "default", prop);
        }
        
        function linkPhysics(link, prop) {
            var key =
                _.pluck([link.source, link.target], "type").sort().join(":");
            return physics(key, prop);
        }
        
        function nodeCharge(d)   { return nodePhysics(d, "charge") }
        function linkDistance(d) { return linkPhysics(d, "linkDistance") }
        function linkStrength(d) { return linkPhysics(d, "linkStrength") }
            
        var force = d3.layout.force()
            .linkDistance(linkDistance)
            .linkStrength(linkStrength)
            .charge(nodeCharge)
            .size([w, h]);
            
        var nodes = force.nodes(),
            links = force.links();
            
        var svgNodes, svgLinks, svgLabels;
        
        
        function calcbin(o, f) {
            return {
                x: f.x, // + Math.round((o.x - f.x) / f.spreadx) * f.intx,
                y: f.y, // + Math.round((o.y - f.y) / f.spready) * f.inty
            }
        }
        
        var nodebins = {};
        function tick (e) {
            if (e) {
                var k = 1 * e.alpha;
                // TODO: Unhidden nodes only
                nodes.forEach(function (o, i) {
                    if (o.fixed) return;
                    var f = Foci[o.type];
                    if (!f) return;
                    o.y += (f.y - o.y) * k;
                });
            }
            svgLinks.attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });
            svgNodes.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
            svgLabels.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")"
            });
        }
        
        function notHidden(d) { return !d.hidden || d.hidden == false }
        function hasLabel(d) { return d.hasLabel }
        function isDocked(d) {
            var docked = dock.get();
            for (var id in docked) {
                var n = docked[id];
                if (d[options.joinAttribute] == n[options.joinAttribute]) {
                    return true;
                }
            }
            return false;
        }
        
        function update() {
            svgLinks = linkG.selectAll("line.link")
                .data(_.filter(links, notHidden));
            var linkEnter = svgLinks.enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });
            svgLinks.exit().remove();

            svgNodes = nodeG.selectAll("circle.node")
                .data(_.filter(nodes, notHidden));
            var nodeEnter = svgNodes.enter().append("circle")
                .attr("class", "node")
                .attr("id",     function (d) {
                    d.elementId = "node-" + d.id; return d.elementId;
                })
                .attr("r",       function (d) { return nodeSize(d); })
                .style("fill",   function (d) { return groupColor[d.id]; })
                .style("stroke", function (d) {
                    return d3.rgb(groupColor[d.id]).darker(1); 
                })
                .on("click",    function (d) {
                    d3.event.stopPropagation();
                    self.emit("click-node", [d, this]);
                })
                .on("dblclick", function (d) {
                    d3.event.stopPropagation();
                    self.emit("dblclick-node", [d, this]);
                })
            svgLabels = labelG.selectAll("text")
                .data(_.filter(nodes, hasLabel));
            svgLabels.enter().append("svg:text")
                .attr("y", ".35em")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .text(function (d) { return d.name.substring(0,6) });
            nodeEnter.call(options.dock ? dock.drag() : force.drag);
            svgNodes.exit().remove();

            force.on("tick", tick);
            if (!_paused) force.start();
        }
        
        function toggleFixed(d) {
            d.fixed = !d.fixed;
        }
        
        if (options.dock) {
            dock.on("dragstart.dock", function () { force.stop(); })
                .on("dragmove.dock",  function () { tick() })
                .on("dragend.dock",   function (evt, d) {
                    if (!isDocked(d)) d.fixed = !d.fixed;
                    tick(); force.start();
                })
                .on("dock", function (evt, d, element) {
                    element
                        .style("stroke", "yellow")
                        .style("stroke-width", 3)
                        .style("stroke-location", "outside")   
                })
                .on("undock", function (evt, d, element) {
                    element
                        .style("stroke", null)
                        .style("stroke-width", null)
                        .style("stroke-location", null);
                });
        }
                
        function nodeSize(d) {
            var size = NODE_SIZE[d.type] || 8;
            return size;
        }

        var selected, originalFill,
            hud = new HUD({
                position: { bottom: 20, left: 20 },
                width: 300
            });
        self.clickNode = function (d, element) {
            if (selected) {
                selected.style["fill"] = originalFill;
            }
            if (selected == element) {
                hud.dismiss();
                selected = null;
                return;
            }
            selected = element;
            originalFill = selected.style["fill"];
            var fill = d3.hsl(originalFill);
            selected.style["fill"] = fill.brighter(1).toString();
        
            hud.empty().append(nodeInfo(d))
            hud.show();
            hud.on("dismiss", function () {
                if (selected != null) {
                    selected.style["fill"] = originalFill;
                    selected = null;
                }
            });
        }
        
        function nodeInfo(d) {
            var $table =
                $("<table id='nodeInfo' class='table table-condensed'>")
                .append($("<tbody>"));
            function row(key, val) {
                if (!val) return;
                $table.find("tbody").append($("<tr>")
                    .append($("<th>").text(key))
                    .append($("<td>").text(val))
                );
            }
            row("Name", d.name);
            row("KBase ID", d.kbid);
            row("Type", d.type);
            row("Entity ID", d.entityId);
            row("Neighbors", self.neighbors(d).length);
            return $table;
        }
        
        // Get neighbors for a given node.
        self.neighbors = function (node, args) {
            args = args || {};
            var neigh = [];
            
            links.forEach(function (link) {
                var n;
                if (link.source.id == node.id) {
                    n = link.target;
                    for (var prop in args) {
                        if (n[prop] != args[prop])
                            n = null;
                    }
                } else if (link.target.id == node.id) {
                    n = link.source;
                    for (var prop in args) {
                        if (n[prop] != args[prop])
                            n = null;
                    }
                }    
                if (n != null && n !== node)
                    neigh.push([ n, link ]);
            });
            return neigh;
        }
                
        self.collapse = function (node) {
            var collapsed = node._collapsed = {};
            var neighbors = self.neighbors(node);
            // Create hash of primary neighbors
            var seen = {};
            for (var i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i];
                var n = neighbor[0];
                seen[n.id] = true;
            }
            for (var i = 0; i < neighbors.length; i++) {
                neighbor = neighbors[i];
                var n = neighbor[0];
                
                var cousins = self.neighbors(n);
                var cousinEdges = [];
                var j = 0;
                
                // Handle neighbors to the collapsing nodes that
                // link with each other. Filter out all seen nodes.
                while (j < cousins.length) {
                    if (seen[cousins[j][0].id]) {
                        var edge = _.clone(cousins[j][1]);
                        edge.source = edge.source.id;
                        edge.target = edge.target.id;
                        cousinEdges.push(edge);
                        cousins.splice(j, 1);
                    } else j++
                }
                // Collapse nodes if not implicated with other nodes.
                if (cousins.length <= 1) {
                    var edge = _.clone(neighbor[1]);
                    edge.source = edge.source.id;
                    edge.target = edge.target.id;
                    collapsed[n.id] = {
                        node: n,
                        edges: _.flatten([edge, cousinEdges])
                    };
                }
            }
            for (var id in collapsed) {
                self.removeNode(parseInt(id));
            }
            return this;
        }
        
        self.uncollapse = function (node) {
            if (!node._collapsed) return this;
            var origAutoUpdate = _autoUpdate;
            _autoUpdate = false;
            // First add the nodes
            for (var id in node._collapsed) {
                var d = node._collapsed[id];
                nodes.push(d.node);
            }
            
            // Then add the edges
            for (var id in node._collapsed) {
                var d = node._collapsed[id];
                d.hidden = false;
                d.edges.forEach(function (edge) {
                    self.addEdge(edge);
                    edge.hidden = false;
                });
                delete node._collapsed[id];
            }
            self.render();
            _autoUpdate = true;
            delete node._collapsed;
            return this;
        }
        
        self.merge = function (data, args) {
            args = args ? _.clone(args) : {};
            args.hidden = args.hidden != null ? args.hidden : false;
            if (nodes.length == 0 && links.length == 0) {
                self.setData(data).render();
                return this;
            }
            var origAutoUpdate = _autoUpdate;
            _autoUpdate = false;
            var nodeMap = {};
            if (data.nodes == null) data.nodes = [];
            if (data.edges == null) data.edges = [];
            for (var i = 0; i < data.nodes.length; i++) {
                var node = data.nodes[i];
                node.hidden = args.hidden;
                node = self.findOrCreateNode(node, options.joinAttribute);
                nodeMap[i] = node.id;
            }
            data.edges.forEach(function (e) {
                self.addLink(
                    nodeMap[e.source], nodeMap[e.target],
                    { weight: e.weight, hidden: args.hidden });
            });
            self.render();
            _autoUpdate = origAutoUpdate;
            return this;
        }
        self.reset = function () {
            nodes.length = 0; links.length = 0;
            labelG.selectAll("text").remove();
            if (dock) { dock.reset() }
            update();
            return self;
        }
        self.dockNodes = function (names) {
            var nodes = [];
            for (var i in names) {
                var node = self.findNode(names[i], 'name');
                if (node) nodes.push(node);
            }
            dock.set(nodes);
        }
        self.dockedNodes = function () {
            return dock.get();
        }
        self.addDockAction = function (callback) {
            dock.addUpdateAction(callback);
        }
        self.dockHudContent = function (callback) {
            dock.hudContent(callback);
        }
        self.pause = function () {
            force.stop();
            _paused = true;
        }
        self.resume = function () {
            force.resume();
            _paused = false;
        }
        self.nodeProperty = function (node, prop) {
            var element = d3.select("#" + node.elementId);
            return element.style(prop);
        }
        self.toggleHidden = function (node) {
            node.hidden = !node.hidden;
            var neighbors = self.neighbors(node);
            neighbors.forEach(function (neighbor) {
                neighbor[1].hidden = node.hidden;
            });
            update();
        }
        
        return self;
    };
    $.extend(Network.prototype, EventEmitter);
    return Network;
});