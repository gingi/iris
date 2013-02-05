define(['jquery', 'd3', 'underscore'], function ($, d3, _) {
    var defaults = {
        yTitle: 'Y Axis',
        axisLabelFontSize: 10,
        padding: 10
    };
    
    function labelFontHeight(svg) {
        var text = svg.append("g").attr("class", "x axis")
            .append("svg:text").text("M");
        var height = text.node().getBBox().height;
        text.remove();
        return height;
    }
    
    function BarChart(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var $el = $(options.element);
        var data;
        self.setData = function (inData) {
            data = inData;
            return self;
        };
        self.render = function () {
            $el.empty();
            var margin = {
                top: 20,
                right: 20,
                bottom: 40,
                left: 40
            },
            width  =
                $el.width()  - margin.left - margin.right - options.padding,
            height =
                $el.height() - margin.top  - margin.bottom - options.padding;

            var format = d3.format(".0");

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis =
                 d3.svg.axis().scale(y).orient("left").tickFormat(format);

            var svg = d3.select(options.element)
                .append("svg")
                .attr("width", $el.width() - options.padding)
                .attr("height", $el.height() - options.padding)
                .style("margin", options.padding / 2)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            

            x.domain(_.map(data, function (d) {return d.x; }));
            y.domain([0, d3.max(data, function (d) { return d.y; }) ]);

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
                .text(options.yTitle);

            svg.selectAll(".bar")
                .data(data)
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
                var clone = _.clone(data);
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
    }
    return BarChart;
})
