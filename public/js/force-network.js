requirejs.config({
    shim: {
        jquery: { exports: '$' },
        d3:     { exports: 'd3' },
    },
})
require(['d3', 'dao', 'jquery'], function (d3, Data, $) {
    
    this.data = new Data();
    
    var svg;
    var width = window.innerWidth,
        height = window.innerHeight;

    var color = d3.scale.category10();

    var force = d3.layout.force()
        .charge(-120)
        .linkDistance(60)
        .size([width, height]);

    // !!! FIXME: User input
    var networkName = location.hash.substr(1) || 'example';

    data.updateFromServer(networkName, function () { render(); });

    function render() {
        var graph = data.getNetwork(networkName);
        var body = d3.select("body");
        svg = body.append("svg");        
        
        svg.attr("width", width)
            .attr("height", height);

        force
            .nodes(graph.nodes)
            .links(graph.edges)
            .start();

        var link = svg.selectAll("line.link").data(graph.edges).enter()
            .append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) { return d.weight; });

        var node = svg.selectAll("circle.node").data(graph.nodes).enter()
            .append("circle")
                .attr("class", "node")
                .attr("r", 8)
                .style("fill", function (d) { return color(d.group); })
                .on("click", clickNode)
                .call(force.drag);
        
        node.append("title").text(function(d) { return d.name; });
      
        force.on("tick", function() {
              link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });
      
              node.attr("cx", function(d) { return d.x; })
                  .attr("cy", function(d) { return d.y; });
        });
    }
    
    var selected, originalFill;
    function clickNode(d) {
        if (selected) {
            selected.style["fill"] = originalFill;
        }
        if (selected == this) {
            selected = null;
            $("#informationBox").css("visibility", "hidden");
            return;
        }
        selected = this;
        originalFill = selected.style["fill"];
        var fill = d3.hsl(originalFill);
        selected.style["fill"] = fill.brighter().toString();
        
        $("#informationBox")
            .css("visibility", "visible")
            .text($(selected).children("title").text());
    }
});