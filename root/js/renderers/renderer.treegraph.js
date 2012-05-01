(function() {
  var renderer = Iris.Renderer.extend({
    about : {
      name: "treegraph",
	  author: "Annette Greiner",
	  version: "1.0",
	  requires: [ 'd3.js' ],
	  defaults: { width: 600,
	    height: 400,
	    padding: 0,
	    data: "exampleData()"
	    },
	  classes: ["link", "node"],
	  dataFormat: "tree"
	  },
	exampleData: function(){
	//TODO: Write a parser for newick.
	//var dataobj = {"name":26,"children":[{"name":25,"children":[{"name":"AT3G52430.1@Atha","size":3},{"name":23,"children":[{"name":"Sb05g005970.1@Sbic","size":4},{"name":21,"children":[{"name":"BRADI4G23367.1@Bdis","size":5},{"name":19,"children":[{"name":"LOC_Os11g09010.3@Osat","size":6},{"name":17,"children":[{"name":"BGIOSGA025494-PA@Oind","size":7},{"name":"BGIOSGA025495-PA@Oind","size":7}],"size":6}],"size":5}],"size":4}],"size":3}],"size":2},{"name":14,"children":[{"name":"AT5G14930.2@Atha","size":3},{"name":12,"children":[{"name":11,"children":[{"name":"AT3G48080.1@Atha","size":5},{"name":"AT3G48090.1@Atha","size":5}],"size":4},{"name":8,"children":[{"name":"Sb02g024030.1@Sbic","size":5},{"name":6,"children":[{"name":"BRADI4G29600.1@Bdis","size":6},{"name":4,"children":[{"name":"ORGLA09G0067400.1@Ogla","size":7},{"name":2,"children":[{"name":"LOC_Os09g22450.1@Osat","size":8},{"name":"BGIOSGA030701-PA@Oind","size":8}],"size":7}],"size":6}],"size":5}],"size":4}],"size":3}],"size":2}],"size":1};

	var dataobj = renderer.array_to_tree([ [ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Escherichia", "Escherichia coli", "Escherichia coli K-12", "Escherichia coli str. K-12 substr. MG1655" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Escherichia", "Escherichia coli", "Escherichia coli K-12", "Escherichia coli BW2952" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Escherichia", "Escherichia coli", "Escherichia coli 53638" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Escherichia", "Escherichia fergusonii", "Escherichia fergusonii ATCC 35469" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Escherichia", "Escherichia albertii", "Escherichia albertii TW07627" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Sodalis", "Sodalis glossinidius", "Sodalis glossinidius str. 'morsitans'" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "unclassified Enterobacteriaceae", "ant, tsetse, mealybug, aphid, etc. endosymbionts", "aphid secondary symbionts", "Candidatus Hamiltonella", "Candidatus Hamiltonella defensa", "Candidatus Hamiltonella defensa 5AT (Acyrthosiphon pisum)" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Buchnera", "Buchnera aphidicola", "Buchnera aphidicola (Schizaphis graminum)", "Buchnera aphidicola str. Sg (Schizaphis graminum)" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Enterobacteriales", "Enterobacteriaceae", "Proteus", "Proteus mirabilis", "Proteus mirabilis HI4320" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Vibrionales", "Vibrionaceae", "Vibrio", "Vibrio shilonii", "Vibrio shilonii AK1" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Aeromonadales", "Aeromonadaceae", "Tolumonas", "Tolumonas auensis", "Tolumonas auensis DSM 9187" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Moritellaceae", "Moritella", "Moritella sp. PE36" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Ferrimonadaceae", "Ferrimonas", "Ferrimonas balearica", "Ferrimonas balearica DSM 9799" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Shewanellaceae", "Shewanella", "Shewanella amazonensis", "Shewanella amazonensis SB2B" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Shewanellaceae", "Shewanella", "Shewanella loihica", "Shewanella loihica PV-4" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Pseudoalteromonadaceae", "Pseudoalteromonas", "Pseudoalteromonas atlantica", "Pseudoalteromonas atlantica T6c" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Alteromonadaceae", "Glaciecola", "Glaciecola sp. HTCC2999" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Alteromonadaceae", "Alteromonas", "Alteromonas macleodii", "Alteromonas macleodii str. 'Deep ecotype'" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Colwelliaceae", "Colwellia", "Colwellia psychrerythraea", "Colwellia psychrerythraea 34H" ],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Pseudoalteromonadaceae", "Pseudoalteromonas", "Pseudoalteromonas tunicata", "Pseudoalteromonas tunicata D2"],[ "Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Idiomarinaceae", "Idiomarina", "Idiomarina baltica", "Idiomarina baltica OS145" ],["Bacteria", "Proteobacteria", "Gammaproteobacteria", "Alteromonadales", "Idiomarinaceae", "Idiomarina", "Idiomarina loihiensis", "Idiomarina loihiensis L2TR" ] ]);

	return  dataobj;
      },
	render : function( options ) {
	
	options.target.innerHTML = "";
	var cluster = d3.layout.cluster()
	  .size([options.height, options.width/2 ]);
	
	var diagonal = d3.svg.diagonal()
	  .projection(function(d) { return [d.y, d.x]; });
	
	var vis = d3.select(options.target).append("svg")
	  .attr("width", options.width)
	  .attr("height", options.height)
	  .append("g")
	  .attr("transform", "translate(20, 0)");
	
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
	  .attr("style", "font: 16px sans-serif; font-style: italic;")
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
	
	node.append("circle")
	  .attr("r", 3)
	  .attr("style", function(d) { 
	      var stroke="stroke: grey; stroke-width: 0.5px;";
	      return d.children ? stroke+"fill: steelblue;" :  stroke+"fill: #D73027"; })
	  .attr("title", function(d) {
	      return d.name;
	    });
	
	node.append("text")
	  .attr("dx", function(d) { return d.children ? -8 : 8; })
	  .attr("dy", 3)
	  .attr("text-anchor", function(d) { return d.children ? "end" : "start"; })
	  .attr("font-family", "\"Helvetica Neue\",Helvetica,Verdana")
	  .attr("font-size", "10")
	  .attr("style", "fill: #666")
	  .text(function(d) { return d.children ? "" :  d.name; });
      },
	array_to_tree : function (data) {
	var newdata = { "name": "root", "children": [] };
	var nodes = newdata["children"];
	for (i=0; i<data.length; i++) {
	  var pnode = nodes;
	  var row = data[i];
	  for (h=0; h<row.length; h++) {
	    var found = 0;
	    var node;
	    for (j=0; j<nodes.length; j++) {
	      if (nodes[j]["name"] == data[i][h]) {
		found = 1;
		node = nodes[j];
		break;
	      }
	    }
	    if (! found) {
	      node = { "name": data[i][h] };
	      if (h < row.length - 1) {
		node["children"] = [];
	      }
	      nodes.push( node );
	    }
	    nodes = node["children"];
	  }
	  nodes = pnode;
	}
	return newdata;
      }
    });
  
 }).call(this);
