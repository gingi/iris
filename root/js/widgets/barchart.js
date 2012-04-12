(function() {
    var about = function () {
        return {
            name: "BarChart",
            author: "Jer-Ming Chia",
            requires: [ "d3.js" ],
        };
    };
    if (typeof exports !== 'undefined') {
        // On the server
        exports.about = about();
        widget = {};
    } else {
        // On the client
        widget = Iris.Widget.extend({
            about: about()
        });
    }
    var svg;
    var elementId;
    var targetNode;
    var phenotypes;

    widget.display = function (args) {
        elementId = widget.targetElement;
        targetNode = document.getElementById(elementId);
        var trait = (args.hasOwnProperty('trait')) ? args['trait'] : 'B11';
        var species = (args.hasOwnProperty('species')) ? args['species'] : 'at';

        var path = "/phenotypes/" + trait;
        // fetch the phenotype data
        widget.getJSON(path, function (json) {
            phenotypes = json;
            drawBarChart(20);
        });
        d3.select("#" + elementId)
            .append("input")
                .attr("type", "range")
                .attr("id", "width-range")
                .attr("name", "range")
                .attr("min", 10)
                .attr("max", 25)
                .attr('style', 'width: 100px');

        document.getElementById("width-range")
            .addEventListener("change", redrawEvent(), false);
    };

    function redrawOnSlider() {
        var width = d3.select('#width-range');
        var v = width.node().value;
        v = +v;
        drawBarChart(v);
    }

    function redrawEvent() {
        return function() {
            redrawOnSlider();
        };
    }

    function drawBarChart(width) {
        var w = width;
        var maxScore = 0;
        var data = [];

        for (var prop in phenotypes) {
            if (phenotypes.hasOwnProperty(prop))
            //notsure whatto do with NA, maybe we should ditch them completely.
            if (phenotypes[prop] != "NA") {
                var pair = {};
                pair.label = prop;
                pair.value = phenotypes[prop];
                data.push(pair);

                if (Number(pair.value) > Number(maxScore)) {
                    maxScore = pair.value;
                }
            }

        }
        // seting heights and padding
        var h = 160;
        var hGraph = 100;
        var sidePad = 20;
        var xpad = 20;

        var max_width =
            targetNode.clientWidth - sidePad - xpad;

        var rowNmbr = Math.floor(data.length * w / max_width);
        if ((data.length * w) % max_width > 0) {
            rowNmbr++;
        }
        var rowMax = Math.floor(max_width / w);

        var y = d3.scale.linear().domain([0, maxScore])
        //        .range([0,(hGraph)]);
        .range([(hGraph), 0]);

        var yAxis = d3.svg.axis().scale(y).ticks(5).orient("left");

        // define svg element
        d3.select("#" + widget.targetElement + " .chart").remove();

        svg = d3.select("#" + elementId)
            .append("svg")
                .attr("class", "chart")
                .attr("width", targetNode.clientWidth - sidePad)
                .attr("height", h * rowNmbr)
                .append("g")
                    .attr("transform", "translate(0,20)");

        // draw the bars
        svg.selectAll("rect").data(data).enter()
            .append("rect").attr("x", function(d, i) {
                    return (i % rowMax) * w + xpad;
                }).attr("y", function(d, i) {
                    return (y(d.value) + (h * (Math.floor(i / rowMax))));
                }).attr("height", function(d) {
                    return hGraph - y(d.value);
                })
                .attr("width", w)
                .attr("stroke", "white")
                .attr("fill", "#888888");

        // add the labels but only if width if greater than 15
        if (w >= 15) {
            svg.selectAll("text").data(data).enter()
                .append("text")
                .attr("x", function(d, i) {
                    return (i % rowMax) * w + xpad;
                }).attr("y", function(d, i) {
                    return (h + (h * (Math.floor(i / rowMax))) -
                        (h - hGraph - 5));
                })
                .attr("text-anchor", "start") // text-align: right
                .attr("transform", function(d, i) {
                    return "rotate(90 " +
                        ((i % rowMax) * w + xpad) + "," +
                        (h + (h * (Math.floor(i / rowMax))) -
                        (h - hGraph - 5)) + ")";
            }).attr("dx", "-.35em") // padding-right
            .attr("dy", -6) // vertical-align: middle; TODO: Calculate (Half of font size)
            .attr("font-family", "\"Helvetica Neue\",Helvetica,Verdana")
            .attr("font-size", "10")
            .attr("fill", "#888888").text(function(d, i) {
                return d.label
            });
        }

        // an axis for each row
        for (n = 1; n <= rowNmbr; n++) {

        // TODO: figure out the new d3 axis functions
        // svg.append("svg:g")
        //         .attr("class", "y axis")
        //         .attr("transform", "translate(" + w + "," + (n-1)*h +  ")")
        //         .call(yAxis.tickSubdivide(0).tickSize(6));


            svg.selectAll("lines").data(y.ticks(5)).enter()
                .append("line")
                    .attr("x1", xpad)
                    .attr("x2", max_width + w)
                    .attr("y1", y)
                    .attr("y2", y)
                    .attr("transform", "translate(0," + (n - 1) * h + ")")
                    .style("stroke", "white");

            svg.selectAll("axis labels").data(y.ticks(5)).enter()
                .append("text")
                    .attr("x", xpad - 5)
                    .attr("y", y)
                    .attr("text-anchor", "end")
                    .attr("font-family", "\"Helvetica Neue\",Helvetica,Verdana")
                    .attr("font-size", "8")
                    .attr("fill", "#888888")
                    .attr("transform", "translate(0," + (n - 1) * h + ")")
                    .text(function(d, i) {
                return d;
            });
        }
    }
})();
