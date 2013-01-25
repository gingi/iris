define(['jquery', 'd3', 'underscore',
    'util/dock', 'util/eventemitter', 'util/hud'],
function ($, d3, _, Dock, EventEmitter, HUD) {
    
    var defaults = {
        dock: true
    };
    
    var NODE_SIZE  = {
        GENE: 8,
        CLUSTER: 16
    };
    var color = d3.scale.category10();
    
    var Network = function (options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var $el = $(options.element);
        var _idSequence = 1;
        var _autoUpdate = true;
        
        this.addNode = function (node) {
            if (node.id) {
                node.id = parseInt(node.id);
                var existing = findNode(node.id);
                if (!existing) {
                    nodes.push(node);
                    _idSequence = d3.max(_idSequence, node.id + 1);
                }
            } else {
                node.id = _idSequence++;
                nodes.push(node);
            }
            if (_autoUpdate) update();
            return node.id;
        }

        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] == n) ||
                    (links[i]['target'] == n))
                    links.splice(i,1);
                else i++;
            }
            nodes.splice(findNodeIndex(id),1);
            update();
            return this;
        }
        
        this.setData  = function (data) {
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
        
        this.addLink = function (source, target, params) {
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
        
        this.highlight = function (name) {
            d3.select("#" + name)
                .style("stroke", "yellow")
                .style("stroke-width", 3)
                .style("stroke-location", "outside")
            return this;
        }
        
        this.display = function () { update(); return this; }

        this.findNode = function (key, type) {
            type = (type || 'id');
            for (var i in nodes) {if (nodes[i][type] === key) return nodes[i]};
        }

        function findNodeIndex(id) {
            for (var i in nodes) { if (nodes[i].id === id) return i };
        }

        var w = $el.width(),
            h = $el.height();

        var vis = this.vis = d3.select($el[0]).append("svg:svg")
            .attr("width", w)
            .attr("height", h);
            
        var dock;
        if (options.dock) { dock = new Dock(vis) };
        
        // This order matters (nodes painted on top of links)
        var linkG = vis.append("g").attr("id", "networkLinks");
        var nodeG = vis.append("g").attr("id", "networkNodes");
            
        var force = d3.layout.force()
            .gravity(.05)
            .distance(100)
            .charge(-60)
            .size([w, h]);
            
        var nodes = force.nodes(),
            links = force.links();
            
        var svgNodes, svgLinks;
        function tick() {
            svgLinks.attr("x1", function (d) { return d.source.x; })
                    .attr("y1", function (d) { return d.source.y; })
                    .attr("x2", function (d) { return d.target.x; })
                    .attr("y2", function (d) { return d.target.y; });
            svgNodes.attr("cx", function (d) { return d.x; })
                    .attr("cy", function (d) { return d.y; });
        }
        
        function update() {
            svgLinks = linkG.selectAll("line.link").data(links);
            var linkEnter = svgLinks.enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });
            svgLinks.exit().remove();

            svgNodes = nodeG.selectAll("circle.node").data(nodes);
            var nodeEnter = svgNodes.enter().append("circle")
                .attr("class", "node")
                .attr("id",     function (d) {
                    d.elementId = "node-" + d.id; return d.elementId;
                })
                .attr("r",      function (d) { return nodeSize(d); })
                .style("fill",  function (d) { return color(d.group); })
                .on("click",    function (d) {
                    d3.event.stopPropagation();
                    self.emit("click-node", [d, this]);
                })
                .on("dblclick", function (d) {
                    d3.event.stopPropagation();
                    self.emit("dblclick-node", [d, this]);
                });
            if (options.dock) {
                nodeEnter.call(dock.drag());
            } else {
                nodeEnter.call(force.drag);
            }
            svgNodes.exit().remove();

            force.on("tick", tick);            
            force.start();
        }
        
        if (options.dock) {
            dock.on("dragstart.dock", function () { force.stop(); })
                .on("dragmove.dock",  function () { tick() })
                .on("dragend.dock",   function () { tick(); force.start(); })
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
            selected.style["fill"] = fill.brighter().toString();
        
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
            return $table;
        }
        
        self.merge = function (data) {
            if (nodes.length == 0 && links.length == 0) {
                self.setData(data).display();
                return this;
            }
            var origAutoUpdate = _autoUpdate;
            _autoUpdate = false;
            var nodeMap = {};
            if (data.nodes == null) data.nodes = [];
            if (data.edges == null) data.edges = [];
            for (var i = 0; i < data.nodes.length; i++) {
                var n = data.nodes[i];
                var node = self.findNode(n.name, "name");
                var oldId = i;
                if (node) {
                    nodeMap[oldId] = node.id;
                    _.extend(node, n);
                    node.id = nodeMap[oldId];
                } else {
                    n.id = null;
                    var newId = self.addNode(n);
                    nodeMap[oldId] = newId;
                }
            }
            data.edges.forEach(function (e) {
                self.addLink(
                    nodeMap[e.source], nodeMap[e.target],
                    { weight: e.weight });
            });
            self.display();
            _autoUpdate = origAutoUpdate;
            return this;
        }
        self.reset = function () {
            nodes.length = 0; links.length = 0;
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
        };
        self.addDockAction = function (callback) {
            dock.addUpdateAction(callback);
        }
        return self;
    };
    Network.getNeighbors = function (node) {
        var network = this;
        if (!node) return;
        var path = node.entityId
            ? 'node/' + node.entityId + '/neighbors'
            : 'network/random/' + node.name + '/neighbors';
        $.ajax({
            url: '/data/' + path,
            success: function (data) {
                network.merge(data);
            }
        });
    }
    $.extend(Network.prototype, EventEmitter);
    return Network;
});