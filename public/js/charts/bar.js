define(['jquery', 'd3', 'underscore'], function ($, d3, _) {
    function BarChart(elementId, options) {
        var self = this;
        options = options ? _.clone(options) : {};
        options.yTitle = options.yTitle || 'Y Axis';
        var $el = $(elementId);
        var data;
        self.setData = function (inData) {
            data = inData;
        };
        self.display = function () {
            var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width  = $el.height() - margin.left - margin.right,
            height = $el.width()  - margin.top  - margin.bottom;

            var format = d3.format("0");

            var x = d3.scale.ordinal().rangeRoundBands([0, width], .1, 1);
            var y = d3.scale.linear().range([height, 0]);

            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(format);

            var svg = d3.select(elementId)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

                x.domain(_.map(data, function(d) {return d.x; }));
                y.domain([0, d3.max(data, function(d) { return d.y; })]);

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height +")")
                    .call(xAxis)
                    .selectAll("text")
                        .attr("dominant-baseline", "central")
                        .attr("text-anchor", "right")
                        .attr("transform", function (d) {
                            var bbox = this.getBBox();
                            return ["translate(",
                                (bbox.x + bbox.height) / 2, ",",
                                (bbox.y + bbox.width) / 2 + 1, ")",
                                "rotate(-90)"].join("");
                        });

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
                    .attr("x", function(d) { return x(d.x); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.y); })
                    .attr("height", function(d) { return height - y(d.y); });

                svg.on("click", change);

                var sortTimeout = setTimeout(function() {
                    // this.checked = true; change();
                }, 1000);

                function change() {
                    clearTimeout(sortTimeout);

                    var clone = _.clone(data);
                    var x0 = x.domain(_.chain(clone).sort(this.checked
                        ? function(a, b) { return b.y - a.y; }
                        : function(a, b) { return d3.ascending(a.x, b.x); })
                        .map(function(d) { return d.x; })
                        .value());

                    var transition = svg.transition()
                        .duration(750),
                        delay = function(d, i) {
                            return i * 50;
                        };

                    transition.selectAll(".bar")
                        .delay(delay)
                        .attr("x", function(d) {
                        return x0(d.x);
                    });

                    transition.select(".x.axis")
                        .call(xAxis)
                        .selectAll("g")
                        .delay(delay);
                    
                        this.checked = !this.checked;
                }
        }
    }
    return BarChart;
})
