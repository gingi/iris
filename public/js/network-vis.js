define(['jquery', 'd3'], function ($, d3) {
    
    var DOCK_DELAY = 1000; // 1 seconds
    var NODE_SIZE  = {
        GENE: 8,
        CLUSTER: 12
    };
    var color = d3.scale.category10();
    
    var Network = function (el) {
        var _network = this;
        var _idSequence = 1;
        var _autoUpdate = true;
        
        this.addNode = function (node) {
            if (node.id) {
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
        }
        
        this.setNodes = function (nodesArg) {
            force.nodes(nodesArg);
            nodes = force.nodes();
            _idSequence = d3.max(nodes, function (n) { return n.id }) + 1;
        }
        
        this.setEdges = function (edgesArg) {
            force.links(edgesArg);
            links = force.links();
        }

        this.addEdge = function (edge) {
            edge.source = this.findNode(edge.source);
            edge.target = this.findNode(edge.target);
            links.push(edge);
            if (_autoUpdate) update();
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
        }
        
        this.highlight = function (name) {
            var node = this.findNode(name, "name");
            if (node) {
                console.log("Found", node);
            }
        }
        
        this.start = function () { update(); }

        this.findNode = function (key, type) {
            type = (type || 'id');
            for (var i in nodes) {if (nodes[i][type] === key) return nodes[i]};
        }

        var findNodeIndex = function (id) {
            for (var i in nodes) {if (nodes[i].id === id) return i};
        }

        var w = $(el).innerWidth(),
            h = $(el).innerHeight();

        var vis = this.vis = d3.select(el).append("svg:svg")
            .attr("width", w)
            .attr("height", h);
            
        // var dockNodeStyle = vis.append("svg:defs")
        //     .append("svg:filter").attr("id", "dockStyle")
        //     .append("svg:feGaussianBlur").attr("stdDeviation", 0.2);
        
        var docked = {};
        var dock = vis.append("rect")
            .attr("id", "networkDock")
            .attr("width", w / 2)
            .attr("height", 30)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("x", (w - 600) / 2)
            .attr("y", h * 5 / 6)
            .style("fill", "black")
            .style("opacity", "0.1");
        var dockDims = {
            x1: parseInt(dock.attr("x")),
            x2: parseInt(dock.attr("x")) + parseInt(dock.attr("width")),
            y1: parseInt(dock.attr("y")),
            y2: parseInt(dock.attr("y")) + parseInt(dock.attr("height")),
        };
            
        dock
            .on("mouseover", function () { dock.style("opacity", "0.2"); })
            .on("mouseout",  function () { dock.style("opacity", "0.1"); })
            .on("click", dockHud);

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
        
        function update() {
            var link = linkG.selectAll("line.link").data(links);
            var linkEnter = link.enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });
            link.exit().remove();

            var node = nodeG.selectAll("circle.node").data(nodes);
            var nodeEnter = node.enter().append("circle")
                .attr("class", "node")
                .attr("r", function (d) { return nodeSize(d); })
                .style("fill", function (d) { return color(d.group); })
                .on("click", clickNode)
                .on("dblclick", getNeighbors)
                .on("mousedown", forceDragging)
                .on("mousemove", handleDock)
                .call(force.drag);
            node.exit().remove();

            force.on("tick", function() {
                link.attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
                node.attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; });
            });

            // Restart the force layout.
            force.start();
        }
        
        function nodeSize(d) {
            var size = NODE_SIZE[d.type] || 8;
            return size;
        }

        var selected, originalFill;
        function clickNode(d) {
            var $hud = $("#infoBox");
            if (selected) {
                selected.style["fill"] = originalFill;
                // $(selected).popover('hide');
            }
            if (selected == this) {
                $hud.fadeOut(function () { $(this).empty(); });
                selected = null;
                return;
            }
            selected = this;
            originalFill = selected.style["fill"];
            var fill = d3.hsl(originalFill);
            selected.style["fill"] = fill.brighter().toString();
        
            // $(selected).popover({
            //     title: $(selected).children('title').text(),
            //     placement: 'bottom',
            //     toggle: 'click',
            //     delay: { hide: 1000 }
            // });
            // $(selected).popover("show");]
            $hud.empty()
                .append(nodeInfo(d))
            $hud.fadeIn();
            $hud.on("click", function () {
                $(this).fadeOut(function () { $(this).empty(); });
                if (selected != null) {
                    selected.style["fill"] = originalFill;
                    selected = null;
                }
            });
        }
        
        function nodeInfo(d) {
            var $table = $("<table id='nodeInfo' class='table table-condensed'>")
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
        
        var draggedNode, dragStart, changedDockState;
        function forceDragging(d) {
            dragStart = { px: d.x, py: d.y };
            draggedNode = this;
            changedDockState = false;
        }
        
        function updateDockHud() {
            var $hud = $("#dockHud");
            $hud.empty();
            $hud.append("<h4>Dock</h4>");
            for (d in docked) {
                $hud.append("<li>" + d + "</li>");
            }            
        }
        
        function dockHud() {
            updateDockHud();
            var $hud = $("#dockHud");
            $hud.fadeIn();
            $hud.on("click", function () {
                $hud.fadeOut();
            });
        }
        
        function getNeighbors(d) {
            var path = d.entityId ? d.entityId + '/network' : d.name + '/neighbors';
            $.ajax({
                url: '/data/gene/' + path,
                success: function (data) {
                    var origAutoUpdate = _autoUpdate;
                    _autoUpdate = false;
                    var nodeMap = {};
                    data.nodes.forEach(function (n) {
                        var node = _network.findNode(n.name, "name");
                        var oldId = n.id;
                        if (node) {
                            nodeMap[oldId] = node.id;
                        } else {
                            n.id = null;
                            var newId = _network.addNode(n);
                            nodeMap[oldId] = newId;
                        }
                    });
                    data.edges.forEach(function (e) {
                        _network.addLink(
                            nodeMap[e.source], nodeMap[e.target],
                            { weight: e.weight });
                    });
                    update();
                    _autoUpdate = origAutoUpdate;
                }
            });
        }
        
        function intersectsDock(d) {
            return d.px >= dockDims.x1 &&
                   d.px <= dockDims.x2 &&
                   d.py >= dockDims.y1 &&
                   d.py <= dockDims.y2
        }
                
        function handleDock(d) {
            if (!draggedNode) return;
            var selected = d3.select(this);
            if (intersectsDock(d) &&
                (!intersectsDock(dragStart) || changedDockState)) {
                selected
                    .style("stroke", "yellow")
                    .style("stroke-width", 3)
                    .style("stroke-location", "outside");
                    // .attr("filter", "url(#dockStyle)");

                d.fixed = true;
                docked[d.name] = d;
                updateDockHud();
                changedDockState = true;
            }
            if (!intersectsDock(d) &&
                (intersectsDock(dragStart) || changedDockState)) {
                selected
                    .style("stroke", null)
                    .style("stroke-width", null)
                    .style("stroke-location", null);
                    // .attr("filter", null);
                    
                setTimeout(function () {
                    d.fixed = false;
                    draggedNode = null;
                }, DOCK_DELAY);
                delete docked[d.name];
                updateDockHud();
                changedDockState = true;
            }
        }
        // Make it all go
        // update();
    };
    return Network;
});