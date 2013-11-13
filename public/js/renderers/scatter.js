define([
    "iris",
    "d3",
    "underscore",
    "util/eventemitter"
], function (Iris, d3, _, EventEmitter, DropdownTmpl) {
    var RADIUS_RANGE        = [3, 60];
    var PADDING             = RADIUS_RANGE[1];
    var TRANSITION_DURATION = 400;
    var Scatter = Iris.Renderer.extend({
        about: {
            title: "Scatter Plot",
            name: "scatter",
            author: "Shiran Pasternak",
            description: "A scatterplot"
        },
        defaults: {
            element: "body",
            margin: { top: 10, right: 40, bottom: 20, left: 60 },
            width: 800,
            height: 600
        },
        initialize: function () {
            this.infoBox      = null;
            this.width        = null;
            this.height       = null;
            this.svg          = null;
            this.x            = null;
            this.y            = null;
            this.radius       = null;
            this.color        = null;
            this.headings     = null;
            this.xAxis        = null;
            this.yAxis        = null;
            this.xAxisElement = null;
            this.yAxisElement = null;
            this.data         = null;
        },
        setData: function (data) {
            var self = this;
            self.headings = data.columns;
            self.data     = data.data;
            var labels = []
            self.colIndex = [];
            for (var i = 0; i < self.headings.length; i++) {
                if (self.headings[i].role === "dimension") {
                    self.colIndex.push(i);
                } else if (self.headings[i].role === "label") {
                    labels.push(i);
                }
            }
            self.labeler = function (d) {
                return _.map(labels, function (i) { return d[i] }).join(", ");
            }
        },
        render: function () {
            if (this.svg !== null) {
                this.update();
                return;
            }
            var margin = this.options.margin;
            this.width = this.options.width - margin.left - margin.right;
            this.height = this.options.height - margin.top - margin.bottom;

            this.svg = d3.select(this.options.element)
                .append("svg")
                .attr("width",  this.width  + margin.left + margin.right)
                .attr("height", this.height + margin.top  + margin.bottom)
                .append("g").attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            this.x = d3.scale.linear().range([PADDING, this.width-PADDING]);
            this.y = d3.scale.linear().range([this.height-PADDING, PADDING]);
            this.radius = d3.scale.linear().range(RADIUS_RANGE);
            this.color  = d3.scale.linear().range(["steelblue", "#BD0026"]);


            this.xAxis = d3.svg.axis().scale(this.x).orient("bottom");
            this.yAxis = d3.svg.axis().scale(this.y).orient("left");

            this.infoBox = this.svg.append("g")
                .style("display", "none");
            this.infoBox.append("text")
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .style("fill-opacity", 1);
            
            this.update();
            return this;
        },
        setDimension: function (oldColumn, newColumn) {
            this.colIndex[oldColumn] = newColumn;
        },
        update: function () {
            var self = this;
            var domainExtent = function (scale, i) {
                scale.domain(d3.extent(
                    self.data, function (d) { return d[self.colIndex[i]]; }
                ));
            };
            var toRange = function (scale, i) {
                return function (d) { return scale(d[self.colIndex[i]]); }
            };
            
            domainExtent(self.x,      0);
            domainExtent(self.y,      1);
            domainExtent(self.radius, 2);
            domainExtent(self.color,  3);

            var circles = self.svg.selectAll("circle").data(self.data);
                
            circles.enter().append("circle")
                .style("stroke", "black")
                .style("stroke-width", 0.5)
                .style("fill-opacity", 0.6)
                .on("mouseover", function (d) {
                    self.infoBox.style("display", null)
                        .attr("transform", "translate(" +
                            d3.select(this).attr("cx") + "," +  
                            d3.select(this).attr("cy") + ")")
                        .select("text")
                            .text(self.labeler(d))
                })
                .on("mouseout", function (d) {
                    self.infoBox.style("display", "none");
                });
            circles.exit().remove();
            circles.transition().duration(400)
                .attr("cx",    toRange(self.x,      0))
                .attr("cy",    toRange(self.y,      1))
                .attr("r",     toRange(self.radius, 2))
                .style("fill", toRange(self.color,  3));
                
            if (self.xAxisElement) {
                self.xAxisElement.transition()
                    .duration(TRANSITION_DURATION).remove();
            }
            self.xAxisElement = self.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + self.height + ")")
                .call(self.xAxis);
            self.xAxisElement.append("text")
                .attr("class", "title")
                .attr("transform", "translate(" + self.width + ",-6)")
                .style("text-anchor", "end")
                .text(self.headings[self.colIndex[0]].name);

            if (self.yAxisElement) {
                self.yAxisElement.transition()
                    .duration(TRANSITION_DURATION).remove();
            }
            self.yAxisElement = self.svg.append("g")
                .attr("class", "y axis")
                .call(self.yAxis);
            self.yAxisElement.append("text")
                .attr("class", "title")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(self.headings[self.colIndex[1]].name);
                
            return self;
        }
    });
    return Scatter;
});
