define(['jquery', 'd3'], function ($, d3) {
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
            for (var p in params) {
                edge[p] = params[p];
            }
            links.push(edge);
            update();
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

        // set up the D3 visualisation in the specified element
        var w = $(el).innerWidth(),
            h = $(el).innerHeight();

        var vis = this.vis = d3.select(el).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        // vis.on("mousemove", function() {
        //   cursor.attr("transform", "translate(" + d3.svg.mouse(this) + ")");
        // });

        vis.on("mousedown", function() {
            // var point = d3.svg.mouse(this);
        });
        
        var docked = {};
        var dock = vis.append("rect")
            .attr("id", "networkDock")
            .attr("width", w / 2)
            .attr("height", 30)
            .attr("rx", 10)
            .attr("ry", 10)
            .attr("x", (w - 600) / 2)
            .attr("y", h * 5 / 6)
            .style("fill", "rgba(0,0,0,0.1)");
        var dockDims = {
            x1: parseInt(dock.attr("x")),
            x2: parseInt(dock.attr("x")) + parseInt(dock.attr("width")),
            y1: parseInt(dock.attr("y")),
            y2: parseInt(dock.attr("y")) + parseInt(dock.attr("height")),
        };
            
        dock.on("mouseover", function () {
            dock.style("stroke", "yellow");
        })
        .on("mouseout", function () {
            dock.style("stroke", "none");
        });

        var force = d3.layout.force()
            .gravity(.05)
            .distance(100)
            .charge(-60)
            .size([w, h]);

        var nodes = force.nodes(),
            links = force.links();
        
        function update() {
            var link = vis.selectAll("line.link").data(links);
            
            var linkEnter = link.enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });

            link.exit().remove();

            var node = vis.selectAll("circle.node").data(nodes);
            var nodeEnter = node.enter().append("circle")
                .attr("class", "node")
                .attr("r", 8)
                .style("fill", function (d) { return color(d.group); })
                .on("click", clickNode)
                .on("dblclick", getNeighbors)
                .on("mousemove", updateDock)
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

        var selected, originalFill, dragged;
        function clickNode(d) {
            dragged = true;
            if (selected) {
                selected.style["fill"] = originalFill;
                // $(selected).popover('hide');
            }
            if (selected == this) {
                $("#infoBox").fadeOut(function () { $(this).empty(); });
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
            $("#infoBox").empty()
                .append("<b>Selected:</b> " + d.name);
            $("#infoBox").fadeIn();
            $("#infoBox").on("click", function () {
                $(this).fadeOut(function () { $(this).empty(); });
                if (selected != null) {
                    selected.style["fill"] = originalFill;
                    selected = null;
                }
            });
        }
        
        function getNeighbors(d) {
            $.ajax({
                url: '/data/gene/' + d.name + '/neighbors',
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
                    force.resume();
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
        
        function updateDock(d) {
            intersecting = intersectsDock(d);
            var draggedNode = this;
            if (intersectsDock(d)) {
                var dockTimeout = setTimeout(function () {
                    if (intersectsDock(d)) {
                        d3.select(draggedNode)
                            .style("stroke", "yellow")
                            .style("stroke-width", 1);
                
                        d.fixed = true;                    
                    } else {
                        d3.select(draggedNode).style("stroke", "none");
                    }
                }, 2000);
            }
        }
        // Make it all go
        // update();
    };
    return Network;
});