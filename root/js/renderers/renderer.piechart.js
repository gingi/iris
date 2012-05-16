define(["iris", "d3", "colorbrewer"], function (Iris) {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            width: {
                type: 'integer'
            },
            height: {
                type: 'integer'
            },
            radius: {
                type: 'integer',
                required: true
            },
            data: {
                description: "list of 2-tuple of string, float",
                required: true,
                type: 'array',
                items: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 2,
                    items: {
                        type: ['number', 'string']
                    }
                }
            }
        }
    };
    Iris.Renderer.extend({
        about: {
            name: "piechart",
            author: "Tobias Paczian",
            version: "1.0",
            defaults: {
                width: 600,
                height: 600,
                radius: 290,
                target: 'pie_space',
                data: 'exampleData()',
                padding: 50
            },
            dataFormat: schema.properties.data.description
        },
        exampleData: function() {
            return [["slice a", 20], ["slice b", 30], ["slice c", 25], ["slice d", 5]];
        },
        render: function (options) {

            var target = options.target;
            target.innerHTML = "";
            var w = options.width;
            var h = options.height;
            var r = options.radius-options.padding;
            var color = d3.scale.ordinal().range(colorbrewer.RdYlBu[9]);

            var data = [];
            options.data.sort(function (a, b) {
                return b[1] - a[1];
            });
            for (i = 0; i < options.data.length; i++) {
                data.push({
                    "label": options.data[i][0] + " (" + options.data[i][1] + ")",
                    "value": options.data[i][1]
                });
            }
            var vis = d3.select(options.target)
                .append("svg:svg").data([data])
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

            arcs.append("svg:path").attr("fill", function(d, i) {
                return color(i);
            }).attr("d", arc);

            arcs.append("svg:text").attr("transform", function(d) {
                d.innerRadius = r;
                d.outerRadius = r*2;
                d.angle = (d.endAngle + d.startAngle) / 2;
                return "translate(" + arc.centroid(d) + ")rotate("+(d.angle * 180 / Math.PI - 90)+")";
            }).attr("text-anchor", "middle").text(function(d, i) {
                return data[i].label;
            }).attr("font-size", "10");
        }
    });
});
