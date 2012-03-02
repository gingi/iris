function BarChart() {
    Widget.call(this);
}
    
BarChart.prototype = new Widget();

BarChart.prototype.render = function(divId, args) {

    var widget = this;
    var trait = getParameterByName('trait');
    var species = getParameterByName('species');

    var path = "/data/phenotypes/" + trait;


    // fetch the phenotype data
    this.getJSON(path,
    function(phenotypes) {

        var phenotype_array = []
        var phenotype_values = [];
        //var labels = [];
        var data = [];
        
        for (var prop in phenotypes) {
            if (phenotypes.hasOwnProperty(prop))

            //notsure whatto do with NA, maybe we should ditch them completely.
            if (phenotypes[prop] != "NA") {
                phenotype_array.push([prop, phenotypes[prop]]);
                //labels.push(prop);
                phenotype_values.push(phenotypes[prop]);

                var pair = {};
                pair.label = prop;
                pair.value = phenotypes[prop];
                data.push(pair);
            }
        }

        var max_width = document.getElementById(divId).clientWidth - 20;
        var w = 22;
        var rowNmbr = Math.floor(phenotype_values.length * w / max_width);
        if ((phenotype_values.length * w) % max_width > 0) {
            rowNmbr++;
        }

        Array.max  = function( array ){
            return Math.max.apply( Math, array );
        };
        var test = Array.max(phenotype_values);
        console.log(test);
        
        var rowMax = Math.floor(max_width / w);
        console.log("Number of data points: " + phenotype_values.length);
        console.log("Widths: max=" + max_width + " barW=" + w);
        console.log("Nunber of rows: " + rowNmbr);
        console.log("Nunber of bars/row: " + rowMax);

        var h = 100;
        // setting each row to be 100px high
        var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, w]);

        var y = d3.scale.linear()
        //.domain([0, Math.max(phenotype_values)])
        .domain([0, Array.max(phenotype_values)])
        .range([0, h]);

        // define svg element
        this.svg = d3.select(document.getElementById(divId))
        .append("svg")
        .attr("class", "chart")
        .attr("width", max_width)
        .attr("height", (h + 20) * rowNmbr);

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
            return (h - y(d.value) - .5 + ((h + 20) * Math.floor((i + 1) * w / max_width)));
        })
        .attr("height",
        function(d) {
            return y(d.value);
        })
        .attr("width", w)
        .attr("stroke", "white")
        .attr("fill", "steelblue");
        
        

    });
}
            
Widget.registerWidget('barChart', BarChart);