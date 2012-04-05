(function( $ ){

  var methods = {
  about : function() { 
      return {
      name: "piechart",
      author: "Tobias Paczian",
      version: "1.0",
      requires: [ 'd3.min.js',
		  'd3.geom.min.js',
		  'd3.layout.min.js' ],
      options: { 'width': 600,
		 'height': 600,
		 'radius': 290,
		 'target': 'pie_space',
		 'data': 'example_data()' },
      classes: [  ],
      data_format: "list of 2-tuple of string, float"
      }
    },
  example_data : function() {
      return [ [ "slice a", 20 ], [ "slice b", 30 ], [ "slice c", 25 ], [ "slice d", 5 ] ];
    },
  render : function( settings ) {
      
      this.options = { width: 500,
		       height: 500,
		       radius: 245,
		       target: "pie_space",
		       data: [] };
      $.extend (this.options, settings);
      
      var target = document.getElementById(this.options.target);
      var opt = this.options;
      target.innerHTML = "";
      target.onclick = function() {
	if (fb_dragData) {
	  opt.data = fb_dragData;
	  $('div').RendererPiechart.render(opt);
	  fb_dragData = null;
	}
      }

      var w = this.options.width;
      var h = this.options.height;
      var r = this.options.radius;
      var color = d3.scale.category20c();
      
      var data = [];
      for (i=0;i<this.options.data.length;i++) {
	data.push( { "label": this.options.data[i][0]+" ("+this.options.data[i][1]+")", "value": this.options.data[i][1] });
      }
      
      var vis = d3.select(document.getElementById(this.options.target))
      .append("svg:svg")
      .data([data])
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + r + "," + r + ")");
      
      var arc = d3.svg.arc()
      .outerRadius(r);
      
      var pie = d3.layout.pie()
      .value(function(d) { return d.value; });
      
      var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "slice");
      
      arcs.append("svg:path")
      .attr("fill", function(d, i) { return color(i); } )
      .attr("d", arc);
      
      arcs.append("svg:text")
      .attr("transform", function(d) {
	  d.innerRadius = 0;
	  d.outerRadius = r;
	  return "translate(" + arc.centroid(d) + ")";
	})
      .attr("text-anchor", "middle")
      .text(function(d, i) { return data[i].label; });
    }
  };

  $.fn.RendererPiechart = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.RendererPiechart' );
    }
  };

})( jQuery );
