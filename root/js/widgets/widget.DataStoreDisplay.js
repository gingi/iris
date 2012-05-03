(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "DataStore Display",
                name: "DataStoreDisplay",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
      return [ this.loadRenderer('table'), this.loadRenderer('jsonpretty') ];
    }

    widget.display = function (div, args) {
      var rend_disp;
      var select_disp;
      var select_list;
      var rend_sel = document.getElementById(args.renderer_select);
      
      if (div.selector) {
	select_disp = div.selector;
	rend_disp = div.renderer;
      } else {
	rend_disp = document.createElement("div");
	select_disp = document.createElement("div");
	div.appendChild(select_disp);
	div.appendChild(rend_disp);
      }

      select_disp.innerHTML += "<b>Loaded Resource Types</b><br>";
      
      select_list = document.createElement("select");
      select_list.setAttribute("id", "data_store_list_select");
      select_list.setAttribute("class", "span2");

      var btn = document.createElement("a");
      btn.setAttribute("href", "#");
      btn.setAttribute("class", "btn btn-small");
      btn.innerHTML = "<i class='icon-refresh'></i>";
      btn.onclick = function () {
	var types = Iris._DataHandler.DataStore;
	select_list.options.length = 0;
	for (i in types) {
	  select_list.add(new Option(i, i), null);
	}
      };

      var btn2 = document.createElement("a");
      btn2.setAttribute("href", "#");
      btn2.setAttribute("class", "btn");
      btn2.innerHTML = "<i class='icon-play'></i>";
      btn2.onclick = function () {
	rend_disp.innerHTML = "";
	var rend_table = document.createElement("div");
	var rend_details = document.createElement("div");
	rend_disp.appendChild(rend_table);
	rend_disp.appendChild(rend_details);
	var data_type = select_list.options[select_list.selectedIndex].value;
	var objects = Iris._DataHandler.DataStore[data_type];
	var table_header = [];
	var table_data = [];
	var idcol = 0;
	var count = 0;
	for (i in objects) {
	  if (! table_header.length) {
	    for (h in objects[i]) {
	      if (h == "id") {
		idcol = count;
	      }
	      table_header.push(h);
	      count++;
	    }
	  }
	  var row = [];
	  for (h=0; h<table_header.length; h++) {
	    if (typeof(objects[i][table_header[h]]) == 'object') {
	      row.push('object');
	    } else {
	      row.push(objects[i][table_header[h]]);
	    }
	  }
	  table_data.push(row);
	}
	Iris.Renderer.table.render( { target: rend_table, data: { header: table_header, data: table_data }, onclick_function: function (retval) {
	      rend_details.innerHTML = "<br><br><br>";
	      var objdata = jQuery.extend(true, {}, Iris._DataHandler.DataStore[data_type][retval.row[idcol]]);
	      Iris.Renderer.jsonpretty.render( { target: rend_details, data: objdata } );
	    } } );
      };

      select_disp.appendChild(select_list);
      select_disp.appendChild(btn);
      select_disp.appendChild(btn2);

      var span1 = document.createElement("span");
      span1.innerHTML = "<br><b>Available Identifiers</b><br>";
      select_disp.appendChild(span1);

      var id_list = document.createElement("select");
      id_list.setAttribute("id", "data_store_id_select");
      id_list.setAttribute("class", "span2");
      select_disp.appendChild(id_list);

      var btn3 = document.createElement("a");
      btn3.setAttribute("href", "#");
      btn3.setAttribute("class", "btn btn-small");
      btn3.innerHTML = "<i class='icon-refresh'></i>";
      btn3.onclick = function () {
	var objs = Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value];
	id_list.options.length = 0;
	var opts = "";
	for (i in objs) {
	  opts += "<option>"+i+"</option>";
	}
	id_list.innerHTML = opts;
      };
      select_disp.appendChild(btn3);

      var btn4 = document.createElement("a");
      btn4.setAttribute("href", "#");
      btn4.setAttribute("class", "btn");
      btn4.innerHTML = "<i class='icon-play'></i>";
      btn4.onclick = function () {
	rend_disp.innerHTML = "";
	var objdata = jQuery.extend(true, {}, Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value][id_list.options[id_list.selectedIndex].value]);
	Iris.Renderer.jsonpretty.render( { target: rend_disp, data: objdata } );
      };
      select_disp.appendChild(btn4);

      var span2 = document.createElement("span");
      span2.innerHTML = "<br><b>Available Attributes</b><br>";
      select_disp.appendChild(span2);

      var att_list = document.createElement("select");
      att_list.setAttribute("id", "data_store_att_select");
      att_list.setAttribute("class", "span2");
      select_disp.appendChild(att_list);

      var btn5 = document.createElement("a");
      btn5.setAttribute("href", "#");
      btn5.setAttribute("class", "btn btn-small");
      btn5.innerHTML = "<i class='icon-refresh'></i>";
      btn5.onclick = function () {
	var obj = Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value][id_list.options[id_list.selectedIndex].value];
	att_list.options.length = 0;
	var opts = "<option>-</option>";
	for (i in obj) {
	  opts += "<option>"+i+"</option>";
	}
	att_list.innerHTML = opts;
      };
      select_disp.appendChild(btn5);

      var btn6 = document.createElement("a");
      btn6.setAttribute("href", "#");
      btn6.setAttribute("class", "btn");
      btn6.innerHTML = "<i class='icon-play'></i>";
      btn6.onclick = function () {
	rend_disp.innerHTML = "";
	var d = Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value][id_list.options[id_list.selectedIndex].value][att_list.options[att_list.selectedIndex].value];
	if (typeof(d) == "object") {
	  d = jQuery.extend(true, {}, d);	  
	}
	Iris.Renderer.jsonpretty.render( { target: rend_disp, data: d } );
      };
      select_disp.appendChild(btn6);

      var span3 = document.createElement("span");
      span3.innerHTML = "<br><br>";
      select_disp.appendChild(span3);

      var btn7 = document.createElement("input");
      btn7.setAttribute("type", "button");
      btn7.setAttribute("class", "btn");
      btn7.setAttribute("value", "Show in Current Renderer");
      btn7.onclick = function () {
	var d = Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value][id_list.options[id_list.selectedIndex].value];
	if (att_list.selectedIndex > 0) {
	  d = d[att_list.options[att_list.selectedIndex].value];
	}
	rend_disp.innerHTML = "";
	Iris.Renderer[rend_sel.options[rend_sel.selectedIndex].value].render( { target: rend_disp, data: d } );
      };
      select_disp.appendChild(btn7);

      var btn8 = document.createElement("input");
      btn8.setAttribute("type", "button");
      btn8.setAttribute("class", "btn");
      btn8.setAttribute("value", "Open in New Window");
      btn8.onclick = function () {
	var d = Iris._DataHandler.DataStore[select_list.options[select_list.selectedIndex].value][id_list.options[id_list.selectedIndex].value];
	if (att_list.selectedIndex > 0) {
	  d = d[att_list.options[att_list.selectedIndex].value];
	}
	if (! d["id"]) {
	  d = { id: id_list.options[id_list.selectedIndex].value, data: d };
	}
	var win = window.open('', 'download');
	win.document.open('application/json');
	win.document.write('[ { "type": "'+select_list.options[select_list.selectedIndex].value+'", "data": [ '+JSON.stringify(d) + ' ] } ]');
	win.document.close();
	
      };
      select_disp.appendChild(btn8);

    };
      
})();
