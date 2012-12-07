define(['jquery', 'd3'], function ($, d3) {
    var color = d3.scale.category10();
    var Network = function (el) {
        var _network = this;
        // Add and remove elements on the graph object
        this.addNode = function (node) {
            nodes.push(node);
            update();
        }

        this.removeNode = function (id) {
            var i = 0;
            var n = findNode(id);
            while (i < links.length) {
                if ((links[i]['source'] == n)||(links[i]['target'] == n)) links.splice(i,1);
                else i++;
            }
            nodes.splice(findNodeIndex(id),1);
            update();
        }
        
        this.setNodes = function (nodesArg) {
            force.nodes(nodesArg);
            nodes = force.nodes();
            // update();
        }
        
        this.setEdges = function (edgesArg) {
            force.links(edgesArg);
            links = force.links();
            // update();
        }

        this.addLink = function (source, target) {
            links.push({
                source: findNode(source),
                target: findNode(target)
            });
            update();
        }
        
        this.start = function () { update(); }

        var findNode = function(id) {
            for (var i in nodes) {if (nodes[i]["id"] === id) return nodes[i]};
        }

        var findNodeIndex = function(id) {
            for (var i in nodes) {if (nodes[i]["id"] === id) return i};
        }

        // set up the D3 visualisation in the specified element
        var w = $(el).innerWidth(),
            h = $(el).innerHeight();

        var vis = this.vis = d3.select(el).append("svg:svg")
            .attr("width", w)
            .attr("height", h);

        var force = d3.layout.force()
            .gravity(.05)
            .distance(100)
            .charge(-100)
            .size([w, h]);

        var nodes = force.nodes(),
            links = force.links();
        
        function update() {
            
            var link = vis.selectAll("line.link").data(links);
            
            var linkEnter = link.enter()
                .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });

            // var link = vis.selectAll("line.link")
            //     .data(links, function(d) { return d.source.id + "-" + d.target.id; });

            // link.enter().insert("line")
            //     .attr("class", "link");
            // 
            link.exit().remove();

            var node = vis.selectAll("circle.node").data(nodes);
            
            var nodeEnter = node.enter().append("circle")
                .attr("class", "node")
                .attr("r", 8)
                .style("fill", function (d) { return color(d.group); })
                .on("click", clickNode)
                .on("dblclick", getNeighbors)
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

        var selected, originalFill;
        function clickNode(d) {
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
            console.log("DBL");
            $.ajax({
                url: '/data/gene/' + d.name + '/neighbors',
                success: function (data) {
                    data.nodes.forEach(function (n) { 
                        _network.addNode(n);
                    });
                    _network.start();
                }
            });
        }
        

        // Make it all go
        // update();        
    };
    return Network;
});