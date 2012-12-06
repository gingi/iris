requirejs.config({
    paths: {
        
    },
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        backbone:   { exports: 'Backbone' },
        underscore:  { exports: '_' }
    },
})
require(['d3', 'jquery', 'underscore', 'backbone'], function (d3, $, _, Backbone) {
    var Network = Backbone.Model.extend({
       defaults: { name: "" },
       urlRoot: "/data/network",
    });
    
    var networkID = location.hash.substr(1) || 'random';

    var AppView = Backbone.View.extend({
        initialize: function () {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.color = d3.scale.category10();
            this.force = d3.layout.force()
                .charge(-120)
                .linkDistance(60)
                .size([this.width, this.height]);
            var network = this.model;
            network.set({ id: networkID });
            network.bind('fetch', this.render);
            network.fetch({
                success: function (model) {
                    App.render();
                }
            })
        },
        render: function () {
            var svg = d3.select("body").append("svg");
            var nodes = this.model.get('nodes');
            var edges = this.model.get('edges');
            svg.attr("width", this.width)
                .attr("height", this.height);
            this.force.nodes(nodes).links(edges).start();

            var link =
                 svg.selectAll("line.link").data(edges).enter()
                .append("line")
                    .attr("class", "link")
                    .style("stroke-width", function(d) { return d.weight; });
            var node = svg.selectAll("circle.node").data(nodes).enter()
                .append("circle")
                    .attr("class", "node")
                    .attr("r", 8)
                    .style("fill", function (d) { return App.color(d.group); })
                    .on("click", clickNode)
                    .call(this.force.drag);
        
            node.append("title").text(function (d) { return d.name; });
      
            this.force.on("tick", function() {
                  link.attr("x1", function(d) { return d.source.x; })
                      .attr("y1", function(d) { return d.source.y; })
                      .attr("x2", function(d) { return d.target.x; })
                      .attr("y2", function(d) { return d.target.y; });
      
                  node.attr("cx", function(d) { return d.x; })
                      .attr("cy", function(d) { return d.y; });
            });
            return this;
        },
        events: {
            "click svg": "doClick"
        },
        doClick: function () {
            console.log("Clicked.");
        }
    });
        
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
            .append("<b>Selected:</b> " + $(selected).children('title').text());
        $("#infoBox").fadeIn();
        $("#infoBox").on("click", function () {
            $(this).fadeOut(function () { $(this).empty(); });
            if (selected != null) {
                selected.style["fill"] = originalFill;
                selected = null;
            }
        });
    }
    var App = new AppView({ model: new Network });
});