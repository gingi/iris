(function () {
  var schema = {
  properties: {
    target: {type: 'object', required: true},
    width: {type: 'integer'},
    height: {type: 'integer'},
    padding: {type: 'integer'},
    barPadding: {type: 'integer'},
    data: {
      description: "a list of title - value pairs",
      required: true,
      type: 'array',
      items: {
	type: 'array',
	minItems: 2,
	maxItems: 2,
	items: {
	  type: 'string'
	  }
	}
    }
  }
  };

  Iris.Renderer.extend({
    about: {
      name: "barchart",
	  author: "Tobias Paczian",
	  version: "1.0",
	  requires: ['d3.js'],
	  defaults: {
    	width: 200,
	    height: 350,
	    padding: 40,
	    target: "chart",
	    barPadding: 3
            },
	  classes: ['axis-text', 'color#', 'rule', 'axis'],
	  dataFormat: schema.properties.data.description
	  },
        exampleData: function() {
	return [ ["bar a", 5],
		 ["bar b", 4],
		 ["bar c", 3],
		 ["bar d", 7],
		 ["bar e", 1],
		 ["bar f", 4] ];
      },
        render: function(options) {

            options.target.innerHTML = "";

            var maxy = 0;
            for (i = 0; i < options.data.length; i++) {
	      if (options.data[i][1] > maxy) {
		maxy = options.data[i][1];
	      }
            }

	    var w = options.width;
            var y = d3.scale.linear().domain([0, maxy]).range([options.height, 0]);

            var vis = d3.select(options.target).append("svg").attr("width", options.width + options.padding * 2).attr("height", options.height + options.padding * 2).append("g").attr("transform", "translate(" + options.padding + "," + options.padding + ")");

            vis.selectAll("rect")
	      .data(options.data)
	      .enter()
	      .append("svg:rect")
	      .attr("x", function(d, i) {
		  return i * (w / options.data.length);
		})
	      .attr("y", function(d) {
		  return y(d[1]);
		})
	      .attr("width", w / options.data.length - options.barPadding)
	      .attr("height", function(d) {
		  return options.height - y(d[1]);
		})
	      .attr("fill", function(d) {
		  return "rgb(150, 150, 150)";
		})
	      .attr("title", function(d) {
		  return d[0];
		});
	    
	    vis.selectAll("text")
	      .data(options.data)
	      .enter()
	      .append("text")
	      .text(function(d) {
		  return d[1];
		})
	      .attr("x", function(d, i) {
		  return i * (w / options.data.length);
		})
	      .attr("y", function(d) {
		  return y(d[1]) - 5;
		})
	      .attr("font-family", "sans-serif")
	      .attr("font-size", "8px")
	      .attr("fill", "black")
	      .attr("title", function(d) {
		  return d[0];
		});
	}
    });
}).call(this);
