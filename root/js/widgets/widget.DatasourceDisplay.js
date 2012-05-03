(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Datasource Display",
                name: "DatasourceDisplay",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
      return [ this.loadRenderer('jsonpretty') ];
    }

    widget.display = function (div, args) {
      var rend_disp;
      var select_disp;
      var select_list;

      var canned = false;
      if (args) {
	canned = args.canned;
      }

      if (div.selector) {
	select_disp = div.selector;
	rend_disp = div.renderer;
      } else {
	rend_disp = document.createElement("div");
	select_disp = document.createElement("div");
	div.appendChild(select_disp);
	div.appendChild(rend_disp);
      }

      select_disp.innerHTML += "<b>available sources</b><br>";
      
      select_list = document.createElement("select");
      select_list.setAttribute("id", "data_source_list_select");
      
      var repos = Iris._DataHandler.repositories();
      for (i in repos) {
	select_list.add(new Option(repos[i].id, repos[i].id), null);
      }

      select_list.onchange = function () {
	var repo = Iris._DataHandler.default_repository(select_list.options[select_list.selectedIndex].value);
	if (repo.resources) {
	  repo.resources.sort();
	  var opts = "";
	  for (i=0; i<repo.resources.length; i++) {
	    opts += "<option>"+repo.resources[i]+"</option>";
	  }	  
	} else {
	  opts = "<option value=''>- not defined by datasource -</option>";
	}
	document.getElementById('data_source_resource_select').innerHTML = opts;
      };

      select_disp.appendChild(select_list);
      
      var span3 = document.createElement('span');
      span3.innerHTML = "<br><br><b>available resources</b><br><select id='data_source_resource_select' onchange='document.getElementById(\"data_source_pull_resource\").value=this.options[this.selectedIndex].value;'></select><br>";
      select_disp.appendChild(span3);

      select_list.onchange();

     //  var span1 = document.createElement('span');
//       span1.innerHTML = "<br><br><b>add new source</b><br><table style='text-align: left;'><tr><th class='span2'>ID</th><td><input type='text' id='data_source_add_id'></td></tr><tr><th>type</th><td><select id='data_source_add_type'><option>default</option><option>SHOCK</option><option>CDMI</option></select></td></tr><tr><th>URL</th><td><input type='text' id='data_source_add_url'></td></tr><tr><td colspan=2 style='text-align: right;'><input type='button' id='data_source_add_button' value='add' class='btn'></td></tr></table>";
//       select_disp.appendChild(span1);
      
//       document.getElementById('data_source_add_button').onclick = function () {
// 	if (document.getElementById('data_source_add_id').value && document.getElementById('data_source_add_url').value) {
// 	  Iris._DataHandler.add_repository( { id: document.getElementById('data_source_add_id').value, url: document.getElementById('data_source_add_url').value, type: document.getElementById('data_source_add_type').options[document.getElementById('data_source_add_type').selectedIndex].value } );
// 	  document.getElementById('data_source_list_select').options[document.getElementById('data_source_list_select').options.length] = new Option(document.getElementById('data_source_add_id').value, document.getElementById('data_source_add_id').value, true);
// 	} else {
// 	  alert('you are missing either ID or URL to add a datasource');
// 	}	
//       };

      var span2 = document.createElement('span');
      span2.innerHTML = "<br><b>pull data from selected data source</b><br><table style='text-align: left;'><tr><th class='span2'>resource</th><td><input type='text' id='data_source_pull_resource'></td></tr><tr><th>REST</th><td><input type='text' id='data_source_pull_rest' value='[]'></td></tr><tr><th>query</th><td><input type='text' id='data_source_pull_cgi' value='[]'></td></tr><tr><td colspan=2 style='text-align: right;'><input type='button' id='data_source_pull_button' value='pull' class='btn'></td></tr></table>";
      if (canned) {
	span2.setAttribute("style", "display: none;");
      }
      select_disp.appendChild(span2);
      
      document.getElementById('data_source_pull_button').onclick = function () {
	if (document.getElementById('data_source_pull_resource').value) {
	  var rest_params = null;
	  if (document.getElementById('data_source_pull_rest').value != "[]") {
	    rest_params = JSON.parse(document.getElementById('data_source_pull_rest').value);
	  }
	  var query_params = null;
	  if (document.getElementById('data_source_pull_cgi').value != "[]") {
	    query_params = JSON.parse(document.getElementById('data_source_pull_cgi').value);
	  }
	  Iris._DataHandler.get_objects( document.getElementById('data_source_pull_resource').value, { rest: rest_params, query: query_params }, function () {
	      alert('data loaded');
	    } );
	 
	} else {
	  alert('you must at least specify a resource');
	}	
      };

      var span4 = document.createElement("span");
      span4.innerHTML = "<br><b>load data from file</b><br><input type='file' onchange='Iris._DataHandler.file_upload(event, function() { alert(\"data loaded\"); }, null);'>";
      if (canned) {
	span4.setAttribute("style", "display: none;");
      }
      select_disp.appendChild(span4);

      if (canned) {
	var span5 = document.createElement("span");
	span5.innerHTML = "<br><b>example queries</b><br>";
	var canned_queries_select = document.createElement("select");
	canned_queries_select.innerHTML = "<option value=1>CDMI genome list</option><option value=2>SHOCK metagenomes</option><option value=3>MG-RAST abundance profile</option>";
	var canned_button = document.createElement("input");
	canned_button.setAttribute("type", "button");
	canned_button.setAttribute("value", "get data");
	canned_button.setAttribute("class", "btn");
	canned_button.onclick = function () {
	  rend_disp.innerHTML = "";
	  switch (canned_queries_select.options[canned_queries_select.selectedIndex].value) {
	  case "1":
	  Iris._DataHandler.get_objects( "all_entities_Genome", { data_repository: "cdmi", query: [0, 1000, [ "id", "scientific-name" ]] }, function () {
	      Iris.Renderer.jsonpretty.render( { target: rend_disp, data: jQuery.extend(true, {},Iris._DataHandler.DataStore["all_entities_Genome"]) });
	    } );
	  break;
	  case "2":
	  Iris._DataHandler.get_objects( "metagenome", { data_repository: "shock", query: [ "limit", "100" ] }, function () {
	      Iris.Renderer.jsonpretty.render( { target: rend_disp, data: jQuery.extend(true, {},Iris._DataHandler.DataStore["metagenome"]) });
	    } );

	  break;
	  case "3":
	  Iris._DataHandler.get_objects( "abundance_profile", { data_repository: "MG-RAST", rest: [ "mgm4440026.3" ] }, function () {
	      Iris.Renderer.jsonpretty.render( { target: rend_disp, data: jQuery.extend(true, {}, Iris._DataHandler.DataStore["abundance_profile"]["mgm4440026.3"] )});
	    } );

	  break;
	  }
	};
	span5.appendChild(canned_queries_select);
	span5.appendChild(canned_button);
	select_disp.appendChild(span5);
      }
      
    };
      
})();
