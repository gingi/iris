define(["./core", "./datahandler"], function (Iris, dh) {
    var fb = {};

    var renderer_resources  = fb.renderer_resources  = [];
    var available_renderers = fb.available_renderers = {};
    var loaded_renderers    = {};

    var widget_resources    = fb.widget_resources    = [];
    var available_widgets   = fb.available_widgets   = {};
    var loaded_widgets      = {};

    var dataflow_resources  = fb.dataflow_resources  = [];
    var available_dataflows = fb.available_dataflows = {};
    var loaded_dataflows    = [];

    fb.dataflows = {};

    var library_resource = null;
    var loaded_libraries       = {};

    var PageLayout;

    var dragData = null;
    var dragType = null;
    var dropZones = [];

    //
    // initialization
    //

    fb.init = function (settings) {
        var promise = jQuery.Deferred();
        var promises = [];
        var handleResource = function (dPromise) {
            promises.push(dPromise);
        };

        var layout = settings.layout;
        if (layout) {
            PageLayout = $('body').layout(layout);
        }

        dh.initialize_data_storage();

        var rendererResources = settings.renderer_resources;
        if (rendererResources) {
            for (i in rendererResources) {
                handleResource(fb.query_renderer_resource(rendererResources[i]));
            }
        }

        var widgetResources = settings.widget_resources;
        if (widgetResources) {
            for (i in widgetResources) {
                handleResource(fb.query_widget_resource(widgetResources[i]));
            }
        }

        var dataResources = settings.data_resources;
        if (dataResources) {
            for (i in dataResources) {
                handleResource(fb.query_data_resource(dataResources[i]));
            }
        }

        var dataflowResources = settings.dataflow_resources;
        if (dataflowResources) {
            for (i in dataflowResources) {
                handleResource(fb.query_dataflow_resource(dataflowResources[i]));
            }
        }

        var libraryResource = settings.library_resource;
        if (libraryResource) {
            library_resource = libraryResource;
        }

        var viewports = settings.viewports;
        if (viewports) {
            for (i = 0; i < viewports.length; i++) {
                dropZones[viewports[i]] = 1;
                fb.init_dropzone(document.getElementById(viewports[i]));
            }
        }

        jQuery.when.apply(this, promises).then(function() {
            promise.resolve();
        });

        return promise;
    };

    //
    // resource section
    //

    fb.query_renderer_resource = function (resource, list) {
        var promise = jQuery.Deferred();

        jQuery.getJSON(resource, function (data) {
            renderer_resources.push(resource);
            for (var i = 0; i < data.length; i++) {
	      var rend = {};
	      rend.resource = resource;
          var filename =
              typeof data[i] === 'string' ? data[i] : data[i].filename;
	      rend.name = filename.substring(filename.indexOf(".") + 1, filename.lastIndexOf("."));
	      rend.filename = filename;
	      available_renderers[rend.name] = rend;
            }
            if (list) {
                fb.update_renderer_list(list);
            }
            promise.resolve();
        });

        return promise;
    };

    fb.update_renderer_list = function (list) {
        var renderer_select = document.getElementById(list);
        if (renderer_select) {
            renderer_select.options.length = 0;
            for (i in available_renderers) {
                renderer_select.add(new Option(i, i), null);
            }
        }
    };

    fb.query_widget_resource = function (resource, list) {
        var promise = jQuery.Deferred();

        jQuery.getJSON(resource, function (data) {
            widget_resources.push(resource);
            for (ii=0; ii < data.length; ii++) {
	      var widget = {};
	      widget.resource = resource;
          var filename = typeof data[ii] === 'string' ? data[ii] : data[ii].filename;
	      widget.name = filename.substring(filename.indexOf(".") + 1, filename.lastIndexOf("."));
	      widget.filename = filename;
	      available_widgets[widget.name] = widget;
            }
            if (list) {
                fb.update_widget_list(list);
            }
            promise.resolve();
        });

        return promise;
    };

    fb.query_dataflow_resource = function (resource, list) {
        var promise = jQuery.Deferred();

        jQuery.getJSON(resource, function(data) {
            var res = data;
            dataflow_resources[dataflow_resources.length] = resource;
            for (i = 0; i < res.length; i++) {
                available_dataflows[res[i]] = dataflow_resources.length - 1;
            }
            if (list) {
                fb.update_dataflow_list(list);
            }
            promise.resolve();
        });

        return promise;
    };

    fb.update_dataflow_list = function (list) {
        var dataflow_select = document.getElementById(list);
        if (dataflow_select) {
            dataflow_select.options.length = 0;
            for (i in dataflows) {
                dataflow_select.add(new Option(i, i), null);
            }
        }
    };

    fb.query_data_resource = function (resource, list) {
      var promise = jQuery.Deferred();
      jQuery.getJSON(resource).then(function(data) {
	  dh.add_repository(data);
	  promise.resolve();
	}, function(jqXHR, textStatus, errorThrown) {
	  if (textStatus === 'parsererror') {
	    parserError(res_url);
	  }
	});
      
      return promise;
    };

    fb.update_datarepo_list = function (list) {
        var datarepo_select = document.getElementById(list);
        if (datarepo_select) {
            datarepo_select.options.length = 0;
            for (i in dh.DataRepositories) {
                datarepo_select.add(new Option(i, i), null);
            }
        }
    };

    //
    // renderers
    //


    fb.test_renderer = function (params) {
        if (params.ret) {
            params.target.innerHTML = "";

            Iris.Renderer[params.renderer].render({ data: Iris.Renderer[params.renderer].exampleData(), target: params.target });
        } else {
            params.ret = 1;
            fb.load_renderer(params.renderer).then(function() {
                fb.test_renderer(params);
            });
        }
    };

    fb.load_renderer = function (renderer) {
        var lrPromise;
        if (loaded_renderers[renderer]) {
            lrPromise = loaded_renderers[renderer];
        } else {
            lrPromise = jQuery.Deferred();
            loaded_renderers[renderer] = lrPromise;

            var promises = [];

            var rend_data = available_renderers[renderer];
            var script_url = rend_data.resource + rend_data.filename;
            jQuery.getScript(script_url, function () {
                var requires = Iris.Renderer[renderer].about.requires;
                for (var i=0; i<requires.length; i++) {
                    promises.push(fb.load_library(requires[i]));
                }

                jQuery.when.apply(this, promises).then(function() {
                    lrPromise.resolve();
                });
            }, function(jqXHR, textStatus, errorThrown) {
                if (textStatus === 'parsererror') {
                    parserError(script_url);
                }
            });
        }
        return lrPromise;
    };

    fb.load_widget = function (widget) {
        var promise;
        if (loaded_widgets[widget]) {
            promise = loaded_widgets[widget];
        } else {
            promise = jQuery.Deferred();
            loaded_widgets[widget] = promise;

            var promises = [];

            var widget_data = available_widgets[widget];
            var script_url = widget_data.resource + widget_data.filename;
            jQuery.getScript(script_url).then(function () {
                var requires = (Iris.Widget[widget].about.requires || []);
                for (var i=0; i<requires.length; i++) {
                    promises.push(fb.load_library(requires[i]));
                }

                jQuery.when.apply(this, promises).then(function() {
                    promise.resolve();
                });
            }, function(jqXHR, textStatus, errorThrown) {
                if (textStatus === 'parsererror') {
                    parserError(script_url);
                }
            });
        }

        return promise;
    };

    fb.load_library = function (library) {
        var promise;
        if (loaded_libraries[library]) {
            promise = loaded_libraries[library];
        } else {
            promise = jQuery.Deferred();
            loaded_libraries[library] = promise;

            var script_url = library_resource + library;
            jQuery.getScript(script_url).then(function() {
                promise.resolve();
            }, function(jqXHR, textStatus, errorThrown) {
                if (textStatus === 'parsererror') {
                    parserError(script_url);
                }
            });
        }

        return promise;
    };

    fb.load_dataflow = function (dataflow) {
        var promise;
        if (loaded_dataflows[dataflow]) {
            promise = loaded_dataflows[dataflow];
        } else {
            promise = jQuery.Deferred();
            loaded_dataflows[dataflow] = promise;

            var res_url = dataflow_resources[available_dataflows[dataflow]] + dataflow;
            jQuery.getJSON(res_url).then(function(data) {
		fb.dataflows[dataflow] = data;
                promise.resolve();
            }, function(jqXHR, textStatus, errorThrown) {
                if (textStatus === 'parsererror') {
		  parserError(res_url);
                }
            });
        }

        return promise;
    };

    fb.get_dataflow = function (dataflow) {
      return jQuery.extend(true, {}, fb.dataflows[dataflow]);
    }

    //
    // Data Flow Initial Version
    //

    fb.data_flow = function (flow) {
      if (! flow.promise) {
	flow.promise = jQuery.Deferred();
      }
      
      // check if the data flow has remaining steps
      if (flow.current_step < flow.steps.length) {
	
	// get the current step
	var curr_step = flow.steps[flow.current_step];
	
	// check if any parameters need to filled in for the current step
	if (flow.internal_params && flow.internal_params[flow.current_step]) {
	  for (i in flow.internal_params[flow.current_step]) {
	    var param_val = flow.parameter_examples[flow.internal_params[flow.current_step][i]];
	    if (flow.params[flow.internal_params[flow.current_step][i]]) {
	      param_val = flow.params[flow.internal_params[flow.current_step][i]];
	    }
	    curr_step[i] = param_val;
	  }
	}
	
	// check which action needs to be executed
	switch (curr_step.action) {
	case "get":  // gets multiple ids of a resource
	  fbdf_get(curr_step, flow);
	  break;
	case "merge":  // merges multiple ids of resource subselections into a single table
	  fbdf_merge(curr_step, flow);
	  break;
	case "subselect": // select parts of a table, i.e. a list of columns
	  fbdf_subselect(curr_step, flow);
	  break;
	case "group": // group a table by a certain column
	  fbdf_group(curr_step, flow);
	  break;
	case "renderer": // loads a renderer into a DOM element with passed params
	  fbdf_renderer(curr_step, flow);
	  break;
	case "clear_data": // deletes data from the dh.DataStore
	  fbdf_clear_data(curr_step, flow);
	  break;
	case "prepend_data": // prepends data to a table
	  fbdf_prepend_data(curr_step, flow);
	  break;
	}
      } else {
	flow.promise.resolve();
      }
      return flow.promise;
    }

    //
    // data flow actions
    //
    function fbdf_get (curr_step, flow) {
      var data_complete = 1;
      var ids;
      if (curr_step.input_ids.length) {
	ids = curr_step.input_ids;
      } else {
	ids = flow.input_ids;
      }
      for (i=0; i<curr_step.input_ids.length; i++) {
	if (! dh.DataStore[curr_step.resource] || ! dh.DataStore[curr_step.resource][curr_step.input_ids[i]]) {
	  data_complete = 0;
	  dh.get_objects(curr_step.resource, { "rest": [ curr_step.input_ids[i] ], "data_repository": curr_step.input_data_resource }, fb.data_flow, flow);
	  break;
	}
      }
      if (data_complete) {
	flow.current_step++;
	fb.data_flow(flow);
      }
      return false;
    }
    
    function fbdf_merge (curr_step, flow) {
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
	  eval( "for (i=0; i<dh.DataStore[curr_step.resource][ids[h]]."+curr_step.data+".length; i++) {if (! data[dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"]) { data[dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"] = []; } data[dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"][h] = dh.DataStore[curr_step.resource][ids[h]]."+curr_step.data+"[i]"+curr_step.subselect+"; }");
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
	  eval( "for (i=0; i<dh.DataStore[curr_step.resource][ids[h]]."+curr_step.data+".length; i++) {data[dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"] = dh.DataStore[curr_step.resource][ids[h]]."+curr_step.data+"[i]"+curr_step.subselect+"; data[dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"].unshift(dh.DataStore[curr_step.resource][ids[h]]."+curr_step.merge_on+"); }");
	}
	var matrix = data;
	break;
      case "join":
	var length_a = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][0];
	for (i in dh.DataStore[curr_step.resource_a][curr_step.input_ids.a]) {
	  var merger = i;
	  if (curr_step.merge_on_a != "i") {
	    eval("merger = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][i]"+curr_step.merge_on_a+";");
	  }
	  data[merger] = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][i];
	}
	for (i in dh.DataStore[curr_step.resource_b][curr_step.input_ids.b]) {
	  var merger = i;
	  if (curr_step.merge_on_b != "i") {
	    eval("merger = dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i]"+curr_step.merge_on_b+";");
	  }
	  if (! data[merger]) {
	    data[merger] = [];
	    for (h=0; h<length_a;h++) {
	      data[merger].push(" ");
	    }
	  }
	  for (h=0; h<dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i].length; h++) {
	    data[merger].push(dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i][h]);
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
      if (! dh.DataStore[curr_step.name]) {
	dh.DataStore[curr_step.name] = [];
      }
      dh.DataStore[curr_step.name][curr_step.id] = matrix;	
      flow.current_step++;
      fb.data_flow(flow);
      return false;
    }
    
    function fbdf_subselect (curr_step, flow) {
      switch (curr_step.type) {
      case "column_list":
	var matrix = [];
	for (i=0; i<dh.DataStore[curr_step.resource][curr_step.input_id].length;i++) {
	  var row = [];
	  for (h=0; h<curr_step.filter.length;h++) {
	    if (curr_step.filter[h]) {
	      row[row.length] = dh.DataStore[curr_step.resource][curr_step.input_id][i][h];
	    }
	  }
	  matrix[matrix.length] = row;
	}
	if (! dh.DataStore[curr_step.name]) {
	  dh.DataStore[curr_step.name] = [];
	}
	dh.DataStore[curr_step.name][curr_step.id] = matrix;
	break;
      }
      flow.current_step++;
      fb.data_flow(flow);
      return false;
    }
    
    function fbdf_group (curr_step, flow) {
      var data = [];
      for (i=0;i<dh.DataStore[curr_step.resource][curr_step.input_id].length;i++) {
	if (data[dh.DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]]) {
	  var j = 0;
	  for (h=0;h<dh.DataStore[curr_step.resource][curr_step.input_id][i].length;h++) {
	    if (curr_step.result_columns[h]) {
	      switch (curr_step.group_functions[j]) {
	      case "sum":
		if (dh.DataStore[curr_step.resource][curr_step.input_id][i][h] == null) {
		  dh.DataStore[curr_step.resource][curr_step.input_id][i][h] = 0;
		} else {
		  if (typeof dh.DataStore[curr_step.resource][curr_step.input_id][i][h] != 'number') {
		    dh.DataStore[curr_step.resource][curr_step.input_id][i][h] = parseFloat(dh.DataStore[curr_step.resource][curr_step.input_id][i][h]);
		  }
		}
		data[dh.DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]][j] += dh.DataStore[curr_step.resource][curr_step.input_id][i][h];
		break;
	      }
	      j++;
	    }
	  }
	} else {
	  var row = [];
	  var j = 0;
	  for (h=0;h<dh.DataStore[curr_step.resource][curr_step.input_id][i].length;h++) {
	    if (curr_step.result_columns[h]) {
	      if (curr_step.group_functions[j] == "sum") {
		if (dh.DataStore[curr_step.resource][curr_step.input_id][i][h] == null) {
		  dh.DataStore[curr_step.resource][curr_step.input_id][i][h] = 0;
		} else {
		  if (typeof dh.DataStore[curr_step.resource][curr_step.input_id][i][h] != 'number') {
		    dh.DataStore[curr_step.resource][curr_step.input_id][i][h] = parseFloat(dh.DataStore[curr_step.resource][curr_step.input_id][i][h]);
		  }
		}
	      }
	      row.push(dh.DataStore[curr_step.resource][curr_step.input_id][i][h]);
	      j++;
	    }
	  }
	  data[dh.DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]] = row;
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
      if (! dh.DataStore[curr_step.name]) {
	dh.DataStore[curr_step.name] = [];
      }
      dh.DataStore[curr_step.name][curr_step.id] = matrix;
      flow.current_step++;
      fb.data_flow(flow);
      return false;
    }
    
    function fbdf_clear_data (curr_step, flow) {
      for (i=0; i<curr_step.data.length; i++) {
	dh.DataStore[curr_step.data[i][0]][curr_step.data[i][1]] = null;
      }
      flow.current_step++;
      fb.data_flow(flow);  
      return false;
    }
    
    function fbdf_prepend_data(curr_step, flow) {
      var data = dh.DataStore[curr_step.resource][curr_step.input_id].unshift(curr_step.data);
      flow.current_step++;
      fb.data_flow(flow);
      return false;
    }
    
    //
    // helper functions
    //


    fb.mouseCoords = function (ev) {
        if (ev.pageX || ev.pageY) {
            return {
                x: ev.pageX,
                y: ev.pageY
            };
        }
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY + document.body.scrollTop - document.body.clientTop
        };
    };

    //
    // drag and drop
    //

    fb.init_dragobject = function (dragObject, data, type) {
        dragObject.draggable = true;
        dragObject.ondragstart = function(ev) {
            dragType = type;
            dragData = data;
            return true;
        };
        dragObject.ondragend = function(ev) {
            return false;
        };
    };

    fb.init_dropzone = function (dropZone) {
        dropZone.ondragenter = function(ev) {
            return false;
        };
        dropZone.ondragleave = function(ev) {
            return false;
        };
        dropZone.ondragover = function(ev) {
            return false;
        };
        dropZone.ondrop = function(ev) {
            ev = ev || window.event;
            var tar = ev.target;
            while (!dropZones[tar.id]) {
                tar = tar.parentNode;
            }
            if (dragType == 'renderer') {
                fb.test_renderer({
                    'target': document.getElementById(tar.id),
                    'renderer': dragData
                });
                dropZones[tar.id] = dragData;
            } else {
                if (!dropZones[tar.id].length) {
                    alert('you must select a renderer for this data first');
                    return false;
                }
                var x = dropZones[tar.id];
                x = "Renderer" + x.substr(x.indexOf('.') + 1, 1).toUpperCase() + x.substring(x.indexOf('.') + 2, x.lastIndexOf('.'));
                eval("$('div')." + x + "('render', { 'data': dragData, 'target': tar.id })");
            }
            dragData = null;
            return false;
        };
    };

    function parserError(script_url) {
        var error = "ParserError: '" + script_url + "' has a syntax error";

        if (jQuery.isFunction(alert)) {
            alert(error);
        }

        throw error;
    }
    return fb;
});
