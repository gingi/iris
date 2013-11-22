define(["iris", "jquery", "d3", "underscore"], function (Iris, JQ, d3, _) {
    function labelFontHeight(svg) {
        var text = svg.append("g").attr("class", "x axis")
            .append("svg:text").text("M");
        var height = text.node().getBBox().height;
        text.remove();
        return height;
    }

    var BarChart = Iris.Renderer.extend({
        defaults: {
            yTitle: 'Y Axis',
            axisLabelFontSize: 10,
            padding: 10,
            margin: { top: 20, right: 20, bottom: 40, left: 40 }
        },
        setData: function (inData) {
            if (typeof inData === "object") {
                this.data = [];
                for (var key in inData) {
                    this.data.push(inData[key]);
                }
            } else {
                // It's a plain list
                this.data = inData;
            }
            return this;
        },
        render: function () {
            var self = this;
            var margin = self.options.margin;
            var padding = self.options.padding;
            var $el = JQ(self.options.element);
            var width  = $el.width()  - margin.left - margin.right - padding;
            var height = $el.height() - margin.top  - margin.bottom - padding;
            $el.empty();

            var format = d3.format(".0");

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis =
                 d3.svg.axis().scale(y).orient("left").tickFormat(format);

            var svg = d3.select($el[0])
                .append("svg")
                .attr("width", $el.width() - padding)
                .attr("height", height)
                .style("margin", padding / 2)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");


            x.domain(_.map(self.data, function (d) {return d.x; }));
            y.domain([0, d3.max(self.data, function (d) { return d.y; }) ]);

            function drawXAxis(elem) {
                if (x.rangeBand() > labelFontHeight(svg)) {
                    elem.call(xAxis)
                        .selectAll("text")
                        .attr("transform", function (d) {
                            var bbox = this.getBBox();
                            return ["translate(",
                                -bbox.height, ",",
                                bbox.width / 2 + 5, ")",
                                "rotate(-90)"].join("");
                        });
                }
                return elem;
            }

            drawXAxis(svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height +")"))

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text(self.options.yTitle);

            svg.selectAll(".bar")
                .data(self.data)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function (d) { return x(d.x); })
                .attr("width", x.rangeBand())
                .attr("y", function (d) { return y(d.y); })
                .attr("height", function (d) { return height - y(d.y); })
                .append("title").text(function (d) { return d.title });

            svg.on("click", change);

            function change() {
                var clone = _.clone(self.data);
                var x0 = x.domain(_.chain(clone).sort(this.checked
                    ? function(a, b) { return d3.ascending(a.x, b.x); }
                    : function(a, b) { return b.y - a.y; })
                    .map(function(d) { return d.x; })
                    .value());

                var transition = svg.transition()
                    .duration(750),
                    delay = function(d, i) {return i * 50; };

                transition.selectAll(".bar")
                    .delay(delay)
                    .attr("x", function(d) {
                    return x0(d.x);
                });

                drawXAxis(transition.select(".x.axis"))
                    .selectAll("g")
                    .delay(delay);
                    
                this.checked = !this.checked;
            }
            return self;
        }
    });
    return BarChart;
})
