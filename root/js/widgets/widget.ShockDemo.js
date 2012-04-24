(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Shock Demo",
                name: "ShockDemo",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
      return [ this.loadRenderer('table'), this.loadRenderer('barchart') ];
    }

    widget.display = function (div, args) {
        div.innerHTML = '<div id="table_display" style="width: 800px;" class="well"></div>';
	div.innerHTML += '<div id="chart_display" style="width: 800px;" class="well"></div>';
        var tab_disp = document.getElementById('table_display');
	var chart_disp = document.getElementById('chart_display');
	Iris.Renderer.table.render( { target: tab_disp, data: { header: [ 'name', 'project', 'type', 'id' ], data: [ [ '-', '-', '-', '-' ] ] } } );

	Iris._DataHandler.add_repository({'url':'http://shock-dev.kbase.us:8000/node','id':'shock','type':'shock'});
	Iris._DataHandler.get_objects('metagenome', { 'data_repository': 'shock', 'query' : [ 'query', '1', 'type', 'metagenome', 'limit', '100' ] }, function () {
	    tab_disp.innerHTML = "";
	    var table_header = [ 'name', 'project', 'type', 'id' ];
	    var table_data = [];
	    for (i in Iris._DataHandler.DataStore['metagenome']) {
	      var obj = Iris._DataHandler.DataStore['metagenome'][i];
	      table_data.push( [ obj.name, obj.project, obj.type, obj.id ] );
	    }
	    Iris.Renderer.table.render( { target: tab_disp, data: { header: table_header, data: table_data }, onclick_function: function (retval) {
		  if (Iris._DataHandler.DataStore['matrix'] && Iris._DataHandler.DataStore['matrix']["phylo_abund_"+retval.row[3]]) {
		    chart_disp.innerHTML = "";
		    Iris.Renderer.barchart.render( { target: chart_disp, data: Iris._DataHandler.DataStore['matrix']["phylo_abund_"+retval.row[3]] } );
		  } else {
		    if (confirm("load profile for "+retval.row[3]+"?")) {
		      Iris._FrameBuilder.load_dataflow('example').then( function () {
			  var groupfuncs = [ 'x', 'sum' ];
			  var viscols = [0,0,1,0,0,0,0,0,0,1];
			  var header = [ "Phylum", retval.row[3] ];
			  var flow = Iris._FrameBuilder.get_dataflow('example');
			  flow.params = { "target": "chart_display", "metagenome": [ retval.row[3] ], "table_header": header, "visible_columns": viscols, "group_functions": groupfuncs, "matrix_id": "phylo_abund_"+retval.row[3] };
			  Iris._FrameBuilder.data_flow(flow).then( function () {
			      chart_disp.innerHTML = "";
			      Iris.Renderer.barchart.render( { target: chart_disp, data: Iris._DataHandler.DataStore['matrix']["phylo_abund_"+retval.row[3]] } );
			    });			
			} );
		    }
		  }
		} } ); 
	  });
    };
    
})();
