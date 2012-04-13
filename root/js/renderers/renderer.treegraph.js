(function() {
    Iris.Renderer.extend({
	  about : function() { 
	      return {
	      name: "treegraph",
	      author: "Annette Greiner",
	      version: "1.0",
	      requires: [ 'd3.js' ],
	      options: {'width': 960,
			       'height': 1200,
			       'padding': 40,
			        'data': 'exampleData()',
			       'target': "chart"},
	      classes: ["link", "node"],
	      data_format: "tree"
	    };
	  },
	  exampleData: function(){
		var dataobj =   {
   "name": "analytics",
   "children": [
    {
     "name": "cluster",
     "children": [
      {"name": "AgglomerativeCluster", "size": 938},
      {"name": "CommunityStructure", "size": 812},
      {"name": "HierarchicalCluster", "size": 3714},
      {"name": "MergeEdge", "size": 243}
     ]
    },
    {
     "name": "graph",
     "children": [
      {"name": "BetweennessCentrality", "size": 534},
      {"name": "LinkDistance", "size": 2731},
      {"name": "MaxFlowMinCut", "size": 4840},
      {"name": "ShortestPaths", "size": 2914},
      {"name": "SpanningTree", "size": 416}
     ]
    },
    {
     "name": "optimization",
     "children": [
      {"name": "AspectRatioBanker", "size": 4074}
     ]
    }
   ]
  };
  	      	return  dataobj;
	     },
	  render : function( settings ) {
	  
	     var options = { width: 960,
			       height: 1200,
			       padding: 20,
			       target: "chart",
			       data: {} };
	       $.extend(options, settings);
	
	      options.target.innerHTML = "";
	
		  //-------    
		 
		 var cluster = d3.layout.cluster()
		     .size([options.height, options.width + 200 ]);
		 
		 var diagonal = d3.svg.diagonal()
		     .projection(function(d) { return [d.y, d.x]; });
		 
		 var vis = d3.select(options.target).append("svg")
		     .attr("width", options.width)
		     .attr("height", options.height)
		   .append("g")
		     .attr("transform", "translate(40, 0)");
		 
	   var nodes = cluster.nodes(options.data);
	 
	   var link = vis.selectAll("path.link")
	       .data(cluster.links(nodes))
	     .enter().append("path")
	       .attr("class", "link")
	       .attr("d", diagonal)
	       .attr("style", "fill: none; stroke: #ccc;", "stroke-width: 1.5px;");
	 
	   var node = vis.selectAll("g.node")
	       .data(nodes)
	     .enter().append("g")
	       .attr("class", "node")
	       .attr("style", "font: 10px sans-serif;")
	       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	 
	   node.append("circle")
	       .attr("r", 4.5)
	       .attr("style", "fill: #fff; stroke: steelblue; stroke-width: 1.5px;");
	 
	   node.append("text")
	       .attr("dx", function(d) { return d.children ? -8 : 8; })
	       .attr("dy", 3)
	       .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
	       .text(function(d) { return d.name; });
	}
});
		      
}).call(this);

