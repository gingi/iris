var loaded_libraries = [];
var library_callback_list = [];
var widget_callback_list = [];
var loaded_widgets = [];
var PageLayout;
var available_widgets = [];
var widget_resources = [];

function init_framebuilder (widgetResources, dataResources) {
  PageLayout = $('body').layout({ applyDefaultStyles: true,
	north__resizable: false,
	north__closable: false,
	north__size: 100,
	north__applyDefaultStyles: false,
	west__fxName: "none",
	west__size: 350,
	east__initClosed: true,
	south__initClosed: true,
	south__size: 150,
	east__size: 700 });

  initialize_data_storage();
  
  if (widgetResources) {
    for (i in widgetResources) {
      query_widget_resource(widgetResources[i]);
    }
  }
  if (dataResources) {
    for (i in dataResources) {
      query_data_resource(dataResources[i]);
    }
  }
}

function query_widget_resource (resource) {
  $.get(resource, function (data) {
      var res = JSON.parse(data);
      widget_resources[res.id] = res;
      for (i=0; i<res.widgets.length; i++) {
	available_widgets[res.widgets[i]] = widget_resources[res.id];
      }
      update_widget_list();
    });
}

function update_widget_list () {
  var widget_select = document.getElementById('widget_select');
  if (widget_select) {
    widget_select.options.length = 0;
    for (i in available_widgets) {
      widget_select.add(new Option(i,i), null);
    }
  }
}

function query_data_resource (resource) {
  $.get(resource, function (data) {
      add_repository(JSON.parse(data));
      update_datarepo_list();
    });  
}

function update_datarepo_list () {
  var datarepo_select = document.getElementById('data_source_select');
  if (datarepo_select) {
    datarepo_select.options.length = 0;
    for (i in DataRepositories) {
      datarepo_select.add(new Option(i,i), null);
    }
  }
}

function load_data_ids () {
  var data_source = document.getElementById('data_source_select').options[document.getElementById('data_source_select').selectedIndex].value;
  var data_type = document.getElementById('data_type_select').options[document.getElementById('data_type_select').selectedIndex].value;
  var dataid_select = document.getElementById('data_id_select');
  if (dataid_select) {
    dataid_select.options.length = 0;
    $.get(DataRepositories[data_source].url + data_type, function (data) {
	var d = JSON.parse(data);
	eval("var ids = d."+data_type+"s;");
	for (i=0;i<ids.length;i++) {
	  dataid_select.add(new Option(ids[i], ids[i]), null);
	}
      });
  }
}

function choose_id () {
  var sel = document.getElementById('data_id_select');
  if (sel &&  sel.options.length) {
    document.getElementById('data_id_text').value = sel.options[sel.selectedIndex].value;
  }
}

function get_data_for_id (ret) {
  var data_source = document.getElementById('data_source_select').options[document.getElementById('data_source_select').selectedIndex].value;
  var data_type = document.getElementById('data_type_select').options[document.getElementById('data_type_select').selectedIndex].value;
  var data_id = document.getElementById('data_id_text').value;
  if (ret) {
    document.getElementById('loaded_data').innerHTML = "<pre>"+JSON.stringify(DataStore[data_type][data_id]).replace(/,/g, ",\n")+"</pre>";
  } else {
    get_objects(data_type, { 'data_repository': data_source, 'rest': [ data_id ] }, get_data_for_id, 1);
  }
}

function select_data_source () {
  var data_type_select = document.getElementById('data_type_select');
  if (data_type_select) {
    data_type_select.options.length = 0;
    var data_source = document.getElementById('data_source_select').options[document.getElementById('data_source_select').selectedIndex].value;
    for (i=0; i<DataRepositories[data_source].resources.length; i++) {
      data_type_select.add(new Option(DataRepositories[data_source].resources[i], DataRepositories[data_source].resources[i]), null);
    }
  }
}

function test_widget (params) {
  if (params.ret) {
    document.getElementById(params.target).innerHTML = "";
    var x = params.widget;
    x = "Widget" + x.substr(x.indexOf('.')+1,1).toUpperCase() + x.substring(x.indexOf('.')+2, x.lastIndexOf('.'));
    eval("$('div')."+x+"('render', { 'data': $('div')."+x+"('example_data'), 'chart': params.target })");
  } else {
    params.ret = 1;
    load_widget(params.widget, test_widget, params);
  }
}

function load_widget (widget, callback_function, callback_params) {
  if (loaded_widgets[widget]) {
    if (loaded_widgets[widget].ready) {
      callback_function.call(null, callback_params);
    } else {
      if (! widget_callback_list[widget]) {
	widget_callback_list[widget] = [];
      }
      widget_callback_list[widget][widget_callback_list[widget].length] = [ callback_function, callback_params ];
    }
  } else {
    $.get(available_widgets[widget].url+widget, function (data) {
	eval(data);
	var x = widget;
	x = "Widget" + x.substr(x.indexOf('.')+1,1).toUpperCase() + x.substring(x.indexOf('.')+2, x.lastIndexOf('.'));
	eval("loaded_widgets[widget] = $('div')."+x+"('about')");
	for (i=0;i<loaded_widgets[widget].requires.length;i++) {
	  load_library(loaded_widgets[widget].requires[i], check_widget_dependencies, widget);
	}
	if (! widget_callback_list[widget]) {
	  widget_callback_list[widget] = [];
	}
	widget_callback_list[widget][widget_callback_list[widget].length] = [ callback_function, callback_params ];
      });
  }
}

function check_widget_dependencies (widget) {
  var ready = 1;
  for (i=0;i<loaded_widgets[widget].requires.length;i++) {
    if (! loaded_libraries[loaded_widgets[widget].requires[i]]) {
      ready = 0;
    }
  }
  if (ready) {
    for (i=0; i<widget_callback_list[widget].length; i++) {
      widget_callback_list[widget][i][0].call(null, widget_callback_list[widget][i][1]);
    }
    widget_callback_list[widget] = null;
    loaded_widgets[widget].ready = 1;
  }
}

function load_library (library, callback, params) {
  if (loaded_libraries[library]) {
    for (i=0;i<library_callback_list[library].length;i++) {
      library_callback_list[library][i][0].call(null, library_callback_list[library][i][1]);
    }
    library_callback_list[library] = null;
  } else {
    if (! library_callback_list[library]) {
      library_callback_list[library] = [];
    }
    library_callback_list[library][library_callback_list[library].length] = [ callback, params ];
    
    var scriptTag = document.createElement("script");
    scriptTag.setAttribute("type", "text/javascript");
    scriptTag.setAttribute("src", library);
    scriptTag.onload = scriptTag.onreadystatechange = function ()
      {
	if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
	  loaded_libraries[library] = 1;
	  load_library(library, callback, params);
	}
      }
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
  }
}
