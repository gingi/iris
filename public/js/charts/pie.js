define(['jquery', 'd3', 'colorbrewer'], function ($, d3, colorbrewer) {
    function PieChart(elementId, options) {
        var self = this;
        options = options ? _.clone(options) : {};
        options.padding = (options.padding || 20);
        options.categories = (options.categories || 9);
        options.colorscheme = (options.colorscheme || 'Spectral'); 
        
        var $el = $(elementId);
        var data;
        self.setData = function (inData) {
            data = inData;
        };
            
        self.display = function () {
            var w = $el.width();
            var h = $el.height();
            var r = Math.min(w, h) / 2 - options.padding;
            var color = d3.scale.ordinal().range(
                colorbrewer[options.colorscheme][options.categories]);
            
            var piedata = [];
            for (i = 0; i < data.length; i++) {
                piedata.push({
                    label: data[i][0],
                    value: data[i][1]
                });
            }
            piedata.sort(function (a, b) { return a.value - b.value; });
            var vis = d3.select(elementId)
                .append("svg:svg").data([piedata])
                    .attr("width", w).attr("height", h)
                .append("svg:g")
                    .attr("transform", "translate(" + w/2 + "," + h/2 + ")");

            var arc = d3.svg.arc().outerRadius(r);

            var pie = d3.layout.pie().value(function(d) {
                return d.value;
            });

            var arcs = vis.selectAll("g.slice")
                .data(pie).enter().append("svg:g")
                .attr("class", "slice");

            arcs.append("svg:path").attr("fill", function (d, i) {
                return color(i);
            }).attr("d", arc);

            arcs.append("svg:text")
                .attr("transform", function (d) {
                    d.innerRadius = r - 90;
                    d.outerRadius = r;
                    d.angle = (d.endAngle + d.startAngle) / 2;
                    return "translate(" + arc.centroid(d) + ")rotate("+(d.angle * 180 / Math.PI - 90)+")";
                })
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text(function (d, i) { return piedata[i].label; });
            arcs.append("title").text(function (d) { return d.data.value; });
        }
    }
    return PieChart;
});
