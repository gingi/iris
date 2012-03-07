function BarChart() {
    Widget.call(this);
}
    
BarChart.prototype = new Widget();

BarChart.prototype.render = function(divId, args) {
    
    var widget = this;
    var trait = (args.hasOwnProperty('trait')) ? args['trait'] : 'B11';
    var species = (args.hasOwnProperty('species')) ? args['species'] : 'at';

    var path = "/data/phenotypes/" + trait;
    // fetch the phenotype data

    widget.divId = divId;
    this.getJSON(path,
    function(phenotypes) {
        widget.phenotypes=phenotypes;
        widget.draw_barChart(20);        
    });
//    this.divId = divId;

    d3.select(document.getElementById(divId))
     .append("input")
     .attr("type","range")
     .attr("id","width-range")
     .attr("name","range")
     .attr("min",10)
     .attr("max",25)
     .attr('style','width: 100px');

    document.getElementById("width-range").addEventListener("change", this.redraw_event(), false);
}

BarChart.prototype.redraw_on_slider = function (){
    var width = d3.select('#width-range');
    var v = width.node().value;
    v= +v;
    console.log("value:" + v);
    this.draw_barChart(v);
}

BarChart.prototype.redraw_event = function() {
    var widget = this;
    return function() {
        widget.redraw_on_slider();
    };
}

BarChart.prototype.draw_barChart = function(width){
    var phenotypes=this.phenotypes;
    var divId = this.divId;
    var w = width;
    var maxScore = 0;
    var data = [];
    
    console.log("Drawing barchart" + phenotypes);
    
    for (var prop in phenotypes) {
        if (phenotypes.hasOwnProperty(prop))

        //notsure whatto do with NA, maybe we should ditch them completely.
        if (phenotypes[prop] != "NA") {
            var pair = {};
            pair.label = prop;
            pair.value = phenotypes[prop];
            data.push(pair);
            if (pair.value > maxScore)
                maxScore = pair.value;
        }
    }
    console.log(divId);

    var max_width = document.getElementById(divId).clientWidth - 20;
    
    var rowNmbr = Math.floor(data.length * w / max_width);
    if ((data.length * w) % max_width > 0) {
        rowNmbr++;
    }
    var rowMax = Math.floor(max_width / w);
/*
    console.log("Number of data points: " + data.length);
    console.log("Widths: max=" + max_width + " barW=" + w);
    console.log("Nunber of rows: " + rowNmbr);
    console.log("Nunber of bars/row: " + rowMax);*/
    // setting each row to be 120px high
    var h = 120;
    
    var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

    var y = d3.scale.linear()
    //.domain([0, h)
    .domain([0, maxScore])
    .range([0, h-20]);

    // define svg element
    d3.select("#" + divId + " .chart").remove();
    this.svg = d3.select(document.getElementById(divId))
    .append("svg")
    .attr("class", "chart")
    .attr("width", max_width)
    .attr("height", h * rowNmbr);

    // draw the bars
    this.svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x",
    function(d, i) {
        return (i % rowMax) * w;
    })
    .attr("y",
    function(d, i) {
        return (h - y(d.value) - .5 + (h * (Math.floor(i/rowMax))));
    })
    .attr("height",
    function(d) {
        return y(d.value);
    })
    .attr("width", w)
    .attr("stroke", "white")
    .attr("fill", "#888888");                

    // add the labels but only if width if greater than 15
    if (w >=15){
        this.svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x",
        function(d, i) {
            return (i % rowMax) * w;
        })
        .attr("y",
        function(d, i) {
             return (h - .5 + (h * (Math.floor(i/rowMax))));
        })
        .attr("text-anchor", "end") // text-align: right
        .attr("transform", function(d, i) { return "rotate(90 " + (i % rowMax) * w + ","
            + (h - .5 + (h * (Math.floor(i/rowMax)))) + ")"; })
        .attr("dx", "-.35em") // padding-right
        .attr("dy", -6) // vertical-align: middle; TODO: Calculate (Half of font size)
        .attr("font-family", "\"Helvetica Neue\",Helvetica,Verdana")
        .attr("font-size", "10")
        .attr("fill", "white")
        .text(function(d, i) { return d.label });        
    }
    
}

Widget.registerWidget('barChart', BarChart);