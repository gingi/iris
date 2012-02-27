function Chord() {
    this.svg = null;
    }

Chord.prototype = new Widget();

Chord.prototype.render = function(canvasId, args) {
    var div = document.getElementById(canvasId).parentNode;
    var chord = d3.layout.chord()
    .padding(.05)
    .sortSubgroups(d3.descending)
    .matrix([
    [11975, 5871, 8916, 2868],
    [1951, 10048, 2060, 6171],
    [8010, 16145, 8090, 8045],
    [1013, 990, 940, 6907]
    ]);

    var w = 600,
    h = 600,
    r0 = Math.min(w, h) * .41,
    r1 = r0 * 1.1;

    var fill = d3.scale.ordinal()
    .domain(d3.range(4))
    .range(["#000000", "#FFDD89", "#957244", "#F26223"]);

    
     this.svg = d3.select(div)
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

    this.svg.append("g")
    .selectAll("path")
    .data(chord.groups)
    .enter().append("path")
    .style("fill",
    function(d) {
        return fill(d.index);
    })
    .style("stroke",
    function(d) {
        return fill(d.index);
    })
    .attr("d", d3.svg.arc().innerRadius(r0).outerRadius(r1))
    .on("mouseover", this.fade(.1))
    .on("mouseout", this.fade(1));

    var ticks = this.svg.append("g")
    .selectAll("g")
    .data(chord.groups)
    .enter().append("g")
    .selectAll("g")
    .data(this.groupTicks)
    .enter().append("g")
    .attr("transform",
    function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        + "translate(" + r1 + ",0)";
    });

    ticks.append("line")
    .attr("x1", 1)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y2", 0)
    .style("stroke", "#000");

    ticks.append("text")
    .attr("x", 8)
    .attr("dy", ".35em")
    .attr("text-anchor",
    function(d) {
        return d.angle > Math.PI ? "end": null;
    })
    .attr("transform",
    function(d) {
        return d.angle > Math.PI ? "rotate(180)translate(-16)": null;
    })
    .text(function(d) {
        return d.label;
    });

    this.svg.append("g")
    .attr("class", "chord")
    .selectAll("path")
    .data(chord.chords)
    .enter().append("path")
    .style("fill",
    function(d) {
        return fill(d.target.index);
    })
    .attr("d", d3.svg.chord().radius(r0))
    .style("opacity", 1);

}
/** Returns an array of tick angles and labels, given a group. */
Chord.prototype.groupTicks = function(d) {
    var k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, 1000).map(function(v, i) {
        return {
            angle: v * k + d.startAngle,
            label: i % 5 ? null: v / 1000 + "k"
        };
    });
}

/** Returns an event handler for fading a given chord group. */
Chord.prototype.fade = function(opacity) {
    console.log("called fade");
    var widget = this;
    return function(g, i) {

        widget.svg.selectAll("g.chord path")
        .filter(function(d) {
            return d.source.index != i && d.target.index != i;
        })
        .transition()
        .style("opacity", opacity);
    };
}

Widget.registerWidget('chord', Chord);