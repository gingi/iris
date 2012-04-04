//
// Global Variables
//
var fb_loaded_libraries = [];
var fb_library_callback_list = [];

var fb_renderer_resources = [];
var fb_available_renderers = [];
var fb_loaded_renderers = [];
var fb_renderer_callback_list = [];

var fb_dataflow_resources = [];
var fb_dataflows = [];

var fb_library_resource = null;

var fb_PageLayout;

var fb_dragData = null;
var fb_dragType = null;
var fb_dropZones = [];

//
// test data
//

var test_data2 = { header: [ "firstname", "lastname", "email" ],
		   data: [ [ "Peter", "Lustig", "plustig@you.wish" ],
			   [ "Hans", "Meier", "hmeier@google.com" ],
			   [ "Stevie", "Wonder", "stevie.wonder@mohnbroetchen.de" ],
			   [ "Mahatma", "Ghandi", "mghandi@nirvana.org" ] ] };

var test_data3 = [ [ "apples", 20 ],
		   [ "oranges", 30 ],
		   [ "pineapples", 40 ],
		   [ "pears", 5 ] ];

var test_data = [ [ [ 0, 0 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 4, 1 ], [ 5, 1 ], [ 6, 1 ] ],
		  [ [ 0, 0 ], [ 1, 0 ], [ 2, 5 ], [ 3, 0 ], [ 4, 5 ], [ 5, 0 ], [ 6, 5 ] ],
		  [ [ 0, 0 ], [ 1, 0 ], [ 2, 2 ], [ 3, 3 ], [ 4, 4 ], [ 5, 5 ], [ 6, 6 ] ] ];

//
// initialization
//
function init_framebuilder (rendererResources, dataResources, dataflowResources, libraryResource, layout, viewports) {
  if (layout) {
    fb_PageLayout = $('body').layout(layout);
  }

  initialize_data_storage();
  
  if (rendererResources) {
    for (i in rendererResources) {
      query_renderer_resource(rendererResources[i]);
    }
  }
  if (dataResources) {
    for (i in dataResources) {
      query_data_resource(dataResources[i]);
    }
  }
  if (dataflowResources) {
    for (i in dataflowResources) {
      query_dataflow_resource(dataflowResources[i]);
    }
  }
  if (libraryResource) {
    fb_library_resource = libraryResource;
  }

  if (viewports) {
    for (i=0; i<viewports.length; i++) {
      fb_dropZones[viewports[i]] = 1;
      init_dropzone(document.getElementById(viewports[i]));
    }
  }
}

//
// resource section
//
function query_renderer_resource (resource, list) {
  jQuery.get(resource, function (data) {
      var res = data; // JSON.parse(data);
      fb_renderer_resources[fb_renderer_resources.length] = resource;
      for (i=0; i<res.length; i++) {
	fb_available_renderers[res[i]] = fb_renderer_resources.length - 1;
      }
      if (list) {
	update_renderer_list(list);
      }
    });
}

function update_renderer_list (list) {
  var renderer_select = document.getElementById(list);
  if (renderer_select) {
    renderer_select.options.length = 0;
    for (i in fb_available_renderers) {
      renderer_select.add(new Option(i,i), null);
    }
  }
}

function query_dataflow_resource(resource, list) {
    jQuery.ajax({
        url: resource,
        dataType: 'json',
        success: function(data) {
            var res = data;
            fb_dataflow_resources[fb_dataflow_resources.length] = resource;
            for (i = 0; i < res.length; i++) {
                fb_dataflows[res[i]] = fb_dataflow_resources.length - 1;
            }
            if (list) {
                update_dataflow_list(list);
            }
        }
    });
}

function update_dataflow_list (list) {
  var dataflow_select = document.getElementById(list);
  if (dataflow_select) {
    dataflow_select.options.length = 0;
    for (i in fb_dataflows) {
      dataflow_select.add(new Option(i,i), null);
    }
  }
}

function query_data_resource(resource, list) {
    $.ajax({
        url: resource,
        dataType: 'json',
        success: function(data) {
            add_repository(data);
            if (list) {
                update_datarepo_list(list);
            }
        }
    });
}

function update_datarepo_list (list) {
  var datarepo_select = document.getElementById(list);
  if (datarepo_select) {
    datarepo_select.options.length = 0;
    for (i in DataRepositories) {
      datarepo_select.add(new Option(i,i), null);
    }
  }
}

//
// renderers
//
function test_renderer (params) {
  if (params.ret) {
    document.getElementById(params.target).innerHTML = "";
    var x = params.renderer;
    x = "Renderer" + x.substr(x.indexOf('.')+1,1).toUpperCase() + x.substring(x.indexOf('.')+2, x.lastIndexOf('.'));
    eval("$('div')."+x+"('render', { 'data': $('div')."+x+"('example_data'), 'target': params.target })");
  } else {
    params.ret = 1;
    load_renderer(params.renderer, test_renderer, params);
  }
}

function load_renderer (renderer, callback_function, callback_params) {
  if (fb_loaded_renderers[renderer]) {
    if (! fb_renderer_callback_list[renderer]) {
      fb_renderer_callback_list[renderer] = [];
    }
    if (fb_loaded_renderers[renderer].ready) {
      callback_function.call(null, callback_params);
    } else {
      fb_renderer_callback_list[renderer][fb_renderer_callback_list[renderer].length] = [ callback_function, callback_params ];
    }
  } else {
    if (! fb_renderer_callback_list[renderer]) {
      fb_renderer_callback_list[renderer] = [];
    }
    fb_renderer_callback_list[renderer][fb_renderer_callback_list[renderer].length] = [ callback_function, callback_params ];
    $.get(fb_renderer_resources[fb_available_renderers[renderer]]+renderer, function (data) {
	eval(data);
	var x = renderer;
	x = "Renderer" + x.substr(x.indexOf('.')+1,1).toUpperCase() + x.substring(x.indexOf('.')+2, x.lastIndexOf('.'));
	eval("fb_loaded_renderers[renderer] = $('div')."+x+"('about')");
	for (i=0;i<fb_loaded_renderers[renderer].requires.length;i++) {
	  load_library(fb_loaded_renderers[renderer].requires[i], check_renderer_dependencies, renderer);
	}
	check_renderer_dependencies(renderer);
      });
  }
}

function check_renderer_dependencies (renderer) {
  var ready = 1;
  for (i=0;i<fb_loaded_renderers[renderer].requires.length;i++) {
    if (! fb_loaded_libraries[fb_loaded_renderers[renderer].requires[i]]) {
      ready = 0;
    }
  }
  if (ready) {
    if (! fb_renderer_callback_list[renderer]) {
      fb_renderer_callback_list[renderer] = [];
    }
    for (i=0; i<fb_renderer_callback_list[renderer].length; i++) {
      fb_renderer_callback_list[renderer][i][0].call(null, fb_renderer_callback_list[renderer][i][1]);
    }
    fb_renderer_callback_list[renderer] = null;
    fb_loaded_renderers[renderer].ready = 1;
  }
}

function load_library (library, callback, params) {
  if (fb_loaded_libraries[library]) {
    if (fb_library_callback_list[library]) {
      for (i=0;i<fb_library_callback_list[library].length;i++) {
	fb_library_callback_list[library][i][0].call(null, fb_library_callback_list[library][i][1]);
      }
      fb_library_callback_list[library] = null;
    }
  } else {
    if (! fb_library_callback_list[library]) {
      fb_library_callback_list[library] = [];
    }
    fb_library_callback_list[library][fb_library_callback_list[library].length] = [ callback, params ];
    
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", fb_library_resource + library);
    scriptTag.onload = scriptTag.onreadystatechange = function ()
      {
	if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
	  fb_loaded_libraries[library] = 1;
	  load_library(library, callback, params);
	}
      }
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
  }
}

//
// Data Flow Initial Version
//
function data_flow (flow) {
  if (flow.current_step < flow.steps.length) {
    var curr_step = flow.steps[flow.current_step];
    switch (curr_step.action) {
    case "get":  // gets multiple ids of a resource
      var data_complete = 1;
      var ids;
      if (curr_step.input_ids.length) {
	ids = curr_step.input_ids;
      } else {
	ids = flow.steps[curr_step.input_ids].input_ids;
      }
      for (i=0; i<curr_step.input_ids.length; i++) {
	if (! dh_DataStore[curr_step.resource] || ! dh_DataStore[curr_step.resource][curr_step.input_ids[i]]) {
	  data_complete = 0;
	  get_objects(curr_step.resource, { "rest": [ curr_step.input_ids[i] ], "data_repository": curr_step.input_data_resource }, data_flow, flow);
	  break;
	}
      }
      if (data_complete) {
	flow.current_step++;
	data_flow(flow);
      }
      break;
    case "merge":  // merges multiple ids of resource subselections into a single table
      var ids;
      if (curr_step.input_ids.length) {
	ids = curr_step.input_ids;
      } else {
	if (typeof curr_step.input_ids == 'number') {
	  ids = flow.steps[curr_step.input_ids].input_ids;
	}
      }
      var data = [];
      switch (curr_step.merge_type) {
      case "append_column":
	for (h=0; h<ids.length; h++) {
	  eval( "for (i=0; i<dh_DataStore[curr_step.resource][ids[h]]."+curr_step.data+".length; i++) {if (! data[dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"]) { data[dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"] = []; } data[dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"][h] = dh_DataStore[curr_step.resource][ids[h]]."+curr_step.data+"[i]"+curr_step.subselect+"; }");
	}
	var matrix = [];
	for (i in data) {
	  var row = [ i ];
	  for (h=0; h<data[i].length; h++) {
	    row[row.length] = data[i][h];
	  }
	  matrix[matrix.length] = row;
	}
	break;
      case "single_column":
	for (h=0; h<ids.length; h++) {
	  eval( "for (i=0; i<dh_DataStore[curr_step.resource][ids[h]]."+curr_step.data+".length; i++) {data[dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"] = dh_DataStore[curr_step.resource][ids[h]]."+curr_step.data+"[i]"+curr_step.subselect+"; data[dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"].unshift(dh_DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"); }");
	}
	var matrix = data;
	break;
      case "join":
	var length_a = dh_DataStore[curr_step.resource_a][curr_step.input_ids.a][0];
	for (i in dh_DataStore[curr_step.resource_a][curr_step.input_ids.a]) {
	  var merger = i;
	  if (curr_step.merge_on_a != "i") {
	    eval("merger = dh_DataStore[curr_step.resource_a][curr_step.input_ids.a][i]"+curr_step.merge_on_a+";");
	  }
	  data[merger] = dh_DataStore[curr_step.resource_a][curr_step.input_ids.a][i];
	}
	for (i in dh_DataStore[curr_step.resource_b][curr_step.input_ids.b]) {
	  var merger = i;
	  if (curr_step.merge_on_b != "i") {
	    eval("merger = dh_DataStore[curr_step.resource_b][curr_step.input_ids.b][i]"+curr_step.merge_on_b+";");
	  }
	  if (! data[merger]) {
	    data[merger] = [];
	    for (h=0; h<length_a;h++) {
	      data[merger].push(" ");
	    }
	  }
	  for (h=0; h<dh_DataStore[curr_step.resource_b][curr_step.input_ids.b][i].length; h++) {
	    data[merger].push(dh_DataStore[curr_step.resource_b][curr_step.input_ids.b][i][h]);
	  }
	}
	var matrix = [];
	for (i in data) {
	  var row = [];
	  for (h=0; h<data[i].length; h++) {
	    row[row.length] = data[i][h];
	  }
	  matrix[matrix.length] = row;
	}
	break;
      }
      if (! dh_DataStore[curr_step.name]) {
	dh_DataStore[curr_step.name] = [];
      }
      dh_DataStore[curr_step.name][curr_step.id] = matrix;	
      flow.current_step++;
      data_flow(flow);
      break;
    case "subselect":
      switch (curr_step.type) {
      case "column_list":
	var matrix = [];
	for (i=0; i<dh_DataStore[curr_step.resource][curr_step.input_id].length;i++) {
	  var row = [];
	  for (h=0; h<curr_step.filter.length;h++) {
	    if (curr_step.filter[h]) {
	      row[row.length] = dh_DataStore[curr_step.resource][curr_step.input_id][i][h];
	    }
	  }
	  matrix[matrix.length] = row;
	}
	if (! dh_DataStore[curr_step.name]) {
	  dh_DataStore[curr_step.name] = [];
	}
	dh_DataStore[curr_step.name][curr_step.id] = matrix;
	break;
      }
      flow.current_step++;
      data_flow(flow);
      break;
    case "group":
      var data = [];
      for (i=0;i<dh_DataStore[curr_step.resource][curr_step.input_id].length;i++) {
	if (data[dh_DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]]) {
	  var j = 0;
	  for (h=0;h<dh_DataStore[curr_step.resource][curr_step.input_id][i].length;h++) {
	    if (curr_step.result_columns[h]) {
	      switch (curr_step.group_functions[j]) {
	      case "sum":
		if (dh_DataStore[curr_step.resource][curr_step.input_id][i][h] == null) {
		  dh_DataStore[curr_step.resource][curr_step.input_id][i][h] = 0;
		} else {
		  if (typeof dh_DataStore[curr_step.resource][curr_step.input_id][i][h] != 'number') {
		   dh_DataStore[curr_step.resource][curr_step.input_id][i][h] = parseFloat(dh_DataStore[curr_step.resource][curr_step.input_id][i][h]);
		  }
		}
		data[dh_DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]][j] += dh_DataStore[curr_step.resource][curr_step.input_id][i][h];
		break;
	      }
	      j++;
	    }
	  }
	} else {
	  var row = [];
	  var j = 0;
	  for (h=0;h<dh_DataStore[curr_step.resource][curr_step.input_id][i].length;h++) {
	    if (curr_step.result_columns[h]) {
	      if (curr_step.group_functions[j] == "sum") {
		if (dh_DataStore[curr_step.resource][curr_step.input_id][i][h] == null) {
		  dh_DataStore[curr_step.resource][curr_step.input_id][i][h] = 0;
		} else {
		  if (typeof dh_DataStore[curr_step.resource][curr_step.input_id][i][h] != 'number') {
		    dh_DataStore[curr_step.resource][curr_step.input_id][i][h] = parseFloat(dh_DataStore[curr_step.resource][curr_step.input_id][i][h]);
		  }
		}
	      }
	      row.push(dh_DataStore[curr_step.resource][curr_step.input_id][i][h]);
	      j++;
	    }
	  }
	  data[dh_DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]] = row;
	}
      }
      var matrix = [];
      for (var k in data) {
	var row = [];
	for (h=0;h<data[k].length;h++) {
	  row.push(data[k][h]);
	}
	matrix.push(row);
      }
      if (! dh_DataStore[curr_step.name]) {
	dh_DataStore[curr_step.name] = [];
      }
      dh_DataStore[curr_step.name][curr_step.id] = matrix;
      flow.current_step++;
      data_flow(flow);
      break;
    case "renderer":
      eval(curr_step.name+"("+curr_step.params+")");
      flow.current_step++;
      data_flow(flow);
      break;
    }
  }
}

//
// helper functions
//
function mouseCoords (ev) {
  if (ev.pageX || ev.pageY) {
    return {x:ev.pageX, y:ev.pageY};
  }
  return { x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
      y:ev.clientY + document.body.scrollTop  - document.body.clientTop };
}

//
// drag and drop
//
function init_dragobject (dragObject, data, type) {
  dragObject.draggable = true;
  dragObject.ondragstart = function(ev) {
    fb_dragType = type;
    fb_dragData = data;
    return true;
  }
  dragObject.ondragend = function(ev) {
    return false;
  }
}

function init_dropzone (dropZone) {
  dropZone.ondragenter = function (ev) {
    return false;
  }
  dropZone.ondragleave = function (ev) {
    return false;
  }
  dropZone.ondragover = function (ev) {
    return false;
  }
  dropZone.ondrop = function (ev) {
    ev = ev || window.event;
    var tar = ev.target;
    while (! fb_dropZones[tar.id]) {
      tar = tar.parentNode;
    }
    if (fb_dragType == 'renderer') {
      test_renderer({ 'target': tar.id, 'renderer': fb_dragData});
      fb_dropZones[tar.id] = fb_dragData;
    } else {
      if (! fb_dropZones[tar.id].length) {
	alert('you must select a renderer for this data first');
	return false;
      }
      var x = fb_dropZones[tar.id];
      x = "Renderer" + x.substr(x.indexOf('.')+1,1).toUpperCase() + x.substring(x.indexOf('.')+2, x.lastIndexOf('.'));
      eval("$('div')."+x+"('render', { 'data': fb_dragData, 'target': tar.id })");
    }
    fb_dragData = null;
    return false;
  }
}
