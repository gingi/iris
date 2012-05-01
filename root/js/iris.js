/*
* iris.js
*
* Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
*/

(function () {
    var root = this;
    var Iris = root.Iris = {};
    var dataServiceURI;
    var services = Iris.services = {};
    
    // Utility fuctions
    Iris.each = function (array, func) {
        for (var i = 0; i < array.length; i++) {
            func(array[i]);
        }
        return array;
    };

    Iris.extend = function (object) {
        Iris.each(Array.prototype.slice.apply(arguments), function (source) {
            for (var property in source) {
                if (!object[property]) {
                    object[property] = source[property];
                }
            }
        });
        return object;
    };
    
    Iris.keys = function (object) {
        if (object !== Object(object)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                keys[keys.length] = key;
            }
        }
        return keys;
    };

    // Retrieve the values of an object's properties.
    Iris.values = function (object) {
        var values = [];
        for (var key in this) {
            if (object.hasOwnProperty(key)) {
                values[values.length] = object[key];
            }
        }
        return values;
    };

    Iris.require = function (resource, successCb, errorCb) {
        var promise = Iris._FrameBuilder.load_library(resource);
        promise.then(successCb, errorCb);
        return promise;
    }

    function capitalize(string) {
        if (string == null || string == "") return string;
        return string[0].toUpperCase() + string.slice(1);
    }
    
    Iris.normalizeName = function (string) {
        // var capitalized = capitalize(string);
        return string.split(/\s/).join('');
    };
    
    var EventCallbacks;
    var eventSplitter = /\s+/;
    var observable = function () {
        return {
            // Bind one or more space separated events, `events`, to a `callback` function. Passing `"all"` will bind the callback to all events fired.
            on: function (events, callback, context) {

                var event, node, tail, list;
                if (!callback) return this;
                if (!EventCallbacks) EventCallbacks = {};
                events = events.split(eventSplitter);

                // Create an immutable callback list, allowing traversal during
                // modification.  The tail is an empty object that will always be used
                // as the next node.
                while (event = events.shift()) {
                    list = EventCallbacks[event];
                    node = list ? list.tail : {};
                    node.next = tail = {};
                    node.context = context;
                    node.callback = callback;
                    EventCallbacks[event] = {
                        tail: tail,
                        next: list ? list.next : node
                    };
                }

                return this;
            },

            // Remove one or many callbacks. If `context` is null, removes all callbacks
            // with that function. If `callback` is null, removes all callbacks for the
            // event. If `events` is null, removes all bound callbacks for all events.
            off: function (events, callback, context) {
                var event, node, tail, cb, ctx;

                // No events, or removing *all* events.
                if (!EventCallbacks) return;
                if (!(events || callback || context)) {
                    delete EventCallbacks;
                    return this;
                }

                // Loop through the listed events and contexts, splicing them out of the
                // linked list of callbacks if appropriate.
                events = events
                    ? events.split(eventSplitter)
                    : Iris.keys(EventCallbacks);
                while (event = events.shift()) {
                    node = calls[event];
                    delete calls[event];
                    if (!node || !(callback || context)) continue;
                    // Create a new list, omitting the indicated callbacks.
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        cb = node.callback;
                        ctx = node.context;
                        if ((callback && cb !== callback) ||
                            (context && ctx !== context)) {
                            this.on(event, cb, ctx);
                        }
                    }
                }

                return this;
            },

            // Trigger one or many events, firing all bound callbacks. Callbacks are
            // passed the same arguments as `trigger` is, apart from the event name
            // (unless you're listening on `"all"`, which will cause your callback to
            // receive the true name of the event as the first argument).
            trigger: function (events) {
                var event, node, calls, tail, args, all, rest;
                if (!EventCallbacks) return this;
                all = EventCallbacks.all;
                events = events.split(eventSplitter);
                rest = Array.prototype.slice.call(arguments, 1);

                // For each event, walk through the linked list of callbacks twice,
                // first to trigger the event, then to trigger any `"all"` callbacks.
                while (event = events.shift()) {
                    if (node = EventCallbacks[event]) {
                        tail = node.tail;
                        while ((node = node.next) !== tail) {
                            node.callback.apply(node.context || this, rest);
                        }
                    }
                    if (node = all) {
                        tail = node.tail;
                        args = [event].concat(rest);
                        while ((node = node.next) !== tail) {
                            node.callback.apply(node.context || this, args);
                        }
                    }
                }

                return this;
            }
        };
    };
    
    // FIXME: Does this really have to be synchronous?
    // With 'async: true', this gets evaluated after the rendering
    // --Shiran
    jQuery.ajax({
        url: "http://ui-dev.kbase.us/service",
        dataType: 'json',
        async: false,
        success: function (service) {
            dataServiceURI = service.dataServiceURI;
        }
    });

    jQuery.getJSON("http://ui-dev.kbase.us/service/list", function (services) {
        for (var i = 0; i < services.length; i++) {
            var service = services[i];
            services[service.path] = service.uri;
        }
    });
    
    Iris.dataURI = function (path) { return dataServiceURI + path; };
    Iris.getJSON = function (path, callback) {
        var url = Iris.dataURI(path);
        jQuery.ajax({
            url: url,
            dataType: 'json',
            data: [],
            success: callback,
            error: function (event, request, settings) {
                console.warn("AJAX error! ", event, request, settings);
            }
        });
    };

	Iris.validate = function (obj, schema) {
		if (window.json.validate) {
			return window.json.validate(obj, schema);
		} else {
			if (revalidator !== undefined) {
				return revalidator.validate(obj, schema);
			} else {
				return {valid: false, errors: ['validate function not defined']};
			}
		}
	}
    /* ===================================================
     * Iris.Widget
     */
    var Widget = Iris.Widget = {};
    Widget.extend = function (spec) {
        spec = (spec || {});
        var about;
        switch (typeof spec.about) {
            case 'function' : about = spec.about();  break;
            case 'object'   : about = spec.about;    break;
            default         : about = {};            break;
        };

        if (spec.setup && typeof spec.setup !== 'function') {
            throw "setup() must be a function returning a string.";
        }
        
        var widget = Iris.extend({}, spec);
        Iris.extend(widget, {
            target: function (target) {
                widget.targetElement = target;
                return widget;
            },
            loadRenderer: function (args) {
                return Iris._FrameBuilder.load_renderer(args);
            },
            getData: function (args) {
                return Iris._DataHandler.get_objects(args);
            },
            create: function (element, args) {
                var widgetInstance = {
                    about: function (name) {
                        return about[name];
                    }
                };
                Iris.extend(widgetInstance, widget);
                var promises = widgetInstance.setup(args);
                if (!jQuery.isArray(promises)) {
                    throw "setup() needs to return an array";
                }
                jQuery.when.apply(this, promises).then(function () {
                    widgetInstance.display(element, args);
                });
                return widgetInstance;
            },
            setup: function (args) { return [] },
            display: function () {},
            getJSON: Iris.getJSON
        });
        Iris.extend(widget, Widget);
        if (about.name) {
            Widget[about.name] = widget;
        }
        return widget;
    };
    
    /* ===================================================
     * Iris.Renderer
     */
    var Renderer = Iris.Renderer = {};

    Renderer.extend = function (spec) {
        spec = (spec || {});
        var renderer = Iris.extend({}, spec);
        Iris.extend(renderer, Renderer);
        if (renderer.about.name) {
            Iris.Renderer[renderer.about.name] = renderer;
        }

        var tmpRender = renderer.render;
        renderer.render = function (settings) {
            settings = (settings || {});
            if (renderer.about) {
                if (renderer.about.defaults) {
                    Iris.extend(settings, renderer.about.defaults);
                }
                if (renderer.about.setDefaults) {
                    Iris.extend(settings, renderer.about.setDefaults());
                }
            }
            
            // validate(args);
			if (renderer.about.schema) {
				var check = Iris.validate(settings, renderer.about.schema);
				if (check['valid']) {
					console.log("automatic validation", renderer.about.name);
					return tmpRender(settings);
				} else {
					console.log(check['errors']);
					return check['errors'];
				}
			}
            return tmpRender(settings);
        };
        return renderer;
    };

    /* ===================================================
     * Iris.Event
     */
    var Model = Iris.Model = {};
    Model.create = function (spec) {
        var model = {};
        Iris.extend(model, observable());
        return model;
    };
    
    /* ===================================================
     * Iris.Event
     */
    var Event = Iris.Event = observable();
    Event.DragDrop = function (arg1, arg2, arg3) {
        Iris._FrameBuilder.init_dragobject(arg1, arg2, arg3);
    };

}).call(this);

// DataHandler
(function () {
    var dh = Iris._DataHandler = {};

    // global variables
    dh.DataStore = [];
    dh.DataRepositories = [];
    var TypeData;
    var CallbackList;
    var DataRepositoriesCount;
    var DataRepositoryDefault;

    // set up / reset the DataHandler, adding initial repositories

    // get / set
    dh.repository = function (name, value) {
        if( typeof value !== 'undefined' &&
            typeof name  !== 'undefined' ) {
            return dh.DataRepositories[name] = value;
        } else if( typeof name !== 'undefined' ) {
            return dh.DataRepositories[name];
        } else {
            return dh.DataRepositories;
        }
    }
    dh.repositories = function () { return dh.repository(); }

    dh.initialize_data_storage = function (repositories) {
        dh.DataStore = [];
        TypeData = [];
        TypeData['types'] = [];
        TypeData['type_count'] = 0;
        CallbackList = [];
        dh.DataRepositories = [];
        DataRepositoriesCount = 0;
        DataRepositoryDefault = null;

        if (repositories) {
            for (var i = 0; i < repositories.length; i++) {
                dh.DataRepositories[repositories[i].id] = repositories[i];
                DataRepositoriesCount++;
                if (DataRepositoriesCount == 1) {
                    DataRepositoryDefault = dh.DataRepositories[repositories[i].id];
                }
            }
        }
    };

    // generic data loader
    // given a DOM id, interprets the innerHTML of the element as JSON data and loads it into the DataStore
    // given a JSON data structure, loads it into the DataStore


    dh.load_data = function (id_or_data, no_clear, type, repo_type) {
        var new_data;
        if (typeof(id_or_data) == 'string') {
            var elem = document.getElementById(id);
            if (elem) {
                new_data = JSON.parse(elem.innerHTML);
                if (!no_clear) {
                    document.getElementById(id).innerHTML = "";
                }
            }
        } else {
            new_data = id_or_data;
        }

        if (new_data) {
            switch (repo_type) {
                case 'default':
                    if (!new_data.length) {
                        new_data = [{
                            'type': type,
                            'data': [new_data]
                        }];
                    }
                    if (typeof(new_data[0]) != 'object') {
                        var dataids = [];
                        for (i=0; i<new_data.length; i++) {
                            dataids.push( { 'id': new_data[i] } );
                        }
                        new_data = [ { 'type': type, 'data': dataids } ];
                    }
                    break;
                case 'shock':
                    var parsed = [];
                    new_data = new_data.D;
                    for (i=0; i<new_data.length; i++) {
                        parsed.push(new_data[i].attributes);
                    }
                    new_data = [ { 'type': type, 'data': parsed } ];
                    break;
                case 'cdmi':
		var parsed = [];
		for (i in new_data) {
		  parsed.push(new_data[i]);
		}
                    new_data = [ { 'type': type, 'data': parsed } ];
                    break; 
            }
            for (var i = 0; i < new_data.length; i++) {
                if (new_data[i].type) {
                    var type = new_data[i].type;
                    if (!TypeData['types'][type]) {
                        dh.DataStore[type] = [];
                        TypeData['type_count']++;
                        TypeData['types'][type] = 0;
                        if (new_data[i].type_description) {
                            TypeData['type_description'][type] = new_data[i].type_description;
                        }
                    }
                    for (var h = 0; h < new_data[i].data.length; h++) {
                        if (!dh.DataStore[type][new_data[i].data[h].id]) {
                            TypeData['types'][type]++;
                        }
                        dh.DataStore[type][new_data[i].data[h].id] = new_data[i].data[h];
                    }
                }
            }
        }
    };

    // adds / replaces a repository in the dh.DataRepositories list


    dh.add_repository = function (repository) {
      if (repository && repository.id) {
	dh.DataRepositories[repository.id] = repository;
	DataRepositoriesCount++;
	if (repository.default ||DataRepositoryDefault == null) {
	  DataRepositoryDefault = dh.DataRepositories[repository.id];
	}
      }
      if (repository.hasOwnProperty('type') && repository.type === 'cdmi' ) {
	Iris.require("cdmi.js").then( function () { 
	    var API = {
	      "API": new CDMI_API(repository.url),
	      "EntityAPI": new CDMI_EntityAPI(repository.url)
	    };
	    var apiName, api, fn, API_functions = {
	      "API": [],
	      "EntityAPI": []
	    },
	      fns = [];
	      for (apiName in API) {
		if (API.hasOwnProperty(apiName)) {
		  api = API[apiName];
		  for (fn in api) {
		    if (api.hasOwnProperty(fn) && typeof api[fn] === 'function' && !fn.match(/_async/)) {
		      API_functions[fn] = apiName;
		      fns.push(fn);
		    }
		  }
		}
	      }
	      repository.api = API;
	      repository.api_functions = API_functions;
	      repository.resources = fns;
	  });
      }
    };
    
    // removes a repository from the dh.DataRepositories list
    
    
    dh.remove_repository = function (id) {
      if (id && dh.DataRepositories[id]) {
	dh.DataRepositories[id] = null;
	DataRepositoriesCount--;
	if (DataRepositoryCount == 1) {
	  for (var i in dh.DataRepositories) {
	    DataRepositoryDefault = dh.DataRepositories[i];
	  }
	}
      }
    };
    
    // sets the default repository
    
    
    dh.default_repository = function (id) {
      if (id && dh.DataRepositories[id]) {
	DataRepositoryDefault = dh.DataRepositories[id];
      }
      return DataRepositoryDefault;
    };
    
    // event handler for an input type file element, which interprets the selected file(s)
    // as JSON data and loads them into the DataStore
    
    
    dh.file_upload = function (evt, callback_function, callback_parameters) {
      var files = evt.target.files;
      
      if (files.length) {
	for (var i = 0; i < files.length; i++) {
	  var f = files[i];
	  var reader = new FileReader();
	  reader.onload = (function(theFile) {
	      return function(e) {
		var new_data = JSON.parse(e.target.result);
		dh.load_data(new_data);
		callback_function.call(null, callback_parameters);
	      };
	    })(f);
	  reader.readAsText(f);
	}
      }
    };
    
    // client side data requestor
    // initiates data retrieval from a resource, saving callback functions /
    // paramters
    dh.get_objects = function (type, resource_params, callback_func, callback_params) {
      if (!CallbackList[type]) {
	CallbackList[type] = [ [callback_func, callback_params] ];
	dh.get_objects_from_repository(type, resource_params);
      } else {
	if (CallbackList[type].in_progress) {
	  if (!CallbackList[type]['new_params']) {
	    CallbackList[type]['new_params'] = [type, resource_params];
	    CallbackList[type]['new_list'] = [];
	  }
	  CallbackList[type].new_list[CallbackList[type].new_list.length] = [callback_func, callback_params];
	} else {
	  CallbackList[type][CallbackList[type].length] = [callback_func, callback_params];
	}
      }
      return 0;
    };
    
    // data retrieval function triggered by get_objects
    // queries the default DataRepository if none is defined in resource_params
    // sets requested query and REST parameters as well as authentication and initiates the asynchronous call
    // the data server needs to support CORS
    
    
    dh.get_objects_from_repository = function (type, resource_params) {
      var rest_params = "";
      var query_params = "";
      var authentication = "";
      
      var base_url = DataRepositoryDefault.url;
      if (DataRepositoryDefault.authentication) {
	authentication = "&" + DataRepositoryDefault.authentication;
      }
      var repo_type = 'default';
      var repo = DataRepositoryDefault;
      if (DataRepositoryDefault.type) {
	repo_type = DataRepositoryDefault.type;
      }
      
      if (resource_params) {
	if (resource_params.data_repository && dh.DataRepositories[resource_params.data_repository]) {
	  
	  repo = dh.DataRepositories[resource_params.data_repository];
	  if (repo.type) {
	    repo_type = repo.type;
	  }
	  base_url = dh.DataRepositories[resource_params.data_repository].url;
	  
	  if (dh.DataRepositories[resource_params.data_repository].authentication) {
	    authentication = "&" + dh.DataRepositories[resource_params.data_repository].authentication;
	  } else {
	    authentication = "";
	  }
	}
	if (resource_params.rest) {
	  rest_params += resource_params.rest.join("/") + "/";
	}
	if (repo_type == 'shock') {
	  if (! resource_params.query) {
	    resource_params.query = [];
	  }
	  resource_params.query.unshift("query", "1", "type", type);
	}
	if (resource_params && resource_params.query) {	  
	  query_params += "?" + resource_params.query[0] + "=" + resource_params.query[1];
	  for (var i = 2; i < resource_params.query.length - 1; i+=2) {
	    query_params += "&" + resource_params.query[i] + "=" + resource_params.query[i + 1];
	  }
	}
      }
      
      switch (repo_type) {
        case 'default':
          base_url += type + "/" + rest_params + query_params + authentication;
          do_ajax(base_url, type, repo_type);
          break;
        case 'shock':
          base_url += query_params + authentication;
          do_ajax(base_url, type, repo_type);
          break;
        case 'cdmi':
          var apiName = repo.api_functions[type];
          var api = repo.api[apiName];
	var data = api[type].apply(this, resource_params.query);
	dh.load_data(data, null, type, repo_type);
	break;
      }
    }

    function do_ajax (base_url, type, repo_type) { 
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open('GET', base_url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open('GET', base_url);
        } else {
            console.log("your browser does not support CORS requests");
            return;
        }
        xhr.onload = function() {
	  dh.load_data(JSON.parse(xhr.responseText), null, type, repo_type);
            if (CallbackList[type]) {
                CallbackList[type]['in_progress'] = 1;
                for (i = 0; i < CallbackList[type].length; i++) {
                    CallbackList[type][i][0].call(null, CallbackList[type][i][1]);
                }
                if (CallbackList[type].new_params) {
                    var new_params = CallbackList[type].new_params;
                    CallbackList[type] = CallbackList[type].new_list;
                    get_objects_from_repository(new_params[0], new_params[1]);
                } else {
                    CallbackList[type] = null;
                }
            }
        };

        xhr.onerror = function() {
            console.log("data retrieval failed");
            return;
        };

        xhr.onabort = function() {
            console.log("data retrieval was aborted");
            return;
        };

        xhr.send();
    };

    // called by the returned data from a get_objects_from_repository call
    // loads the returned data into the DataStore, deletes the sent data from the DOM
    // and initiates all callback functions for the type


    dh.data_return = function (type, new_data) {
        type = type.toLowerCase();
        var old_script = document.getElementById('callback_script_' + type);
        document.getElementsByTagName('head')[0].removeChild(old_script);
        dh.load_data([{
            'type': type,
            'data': new_data
        }]);
        callback(type);
    };

    // function for backwards compatibility


    dh.ajax_result = function (new_data, type) {
        data_return(type, new_data);
    };

    // executes the callback functions for a given type


    dh.callback = function (type) {
        type = type.toLowerCase();
        for (var c = 0; c < CallbackList[type].length; c++) {
            CallbackList[type][c][0].call(null, CallbackList[type][c][1], type);
        }
        CallbackList[type] = null;
    };

    // deletes an object from the DataStore


    dh.delete_object = function (type, id) {
        type = type.toLowerCase();
        if (dh.DataStore[type][id]) {
            dh.DataStore[type][id] = null;
            TypeData['types'][type]--;
            if (TypeData['types'][type] == 0) {
                delete_object_type(type);
            }
        }
    };

    // deletes a set of objects from the DataStore


    dh.delete_objects = function (type, ids) {
        type = type.toLowerCase();
        for (var i = 0; i < ids.length; i++) {
            delete_object(type, ids[i]);
        }
    };

    // deletes an entire type from the DataStore


    dh.delete_object_type = function (type) {
        type = type.toLowerCase();
        if (TypeData['types'][type]) {
            TypeData['types'][type] = null;
            TypeData['type_count']--;
            dh.DataStore[type] = null;
        }
    };
}).call(this); // END DataHandler

// FrameBuilder   
(function () {
    var fb = Iris._FrameBuilder = {};
    var dh = Iris._DataHandler;

    var renderer_resources     = [];
    Iris._FrameBuilder.renderer_resources = renderer_resources;
    var available_renderers    = {};
    var loaded_renderers       = {};
    Iris._FrameBuilder.available_renderers = available_renderers;

    var widget_resources     = [];
    Iris._FrameBuilder.widget_resources = widget_resources;
    var available_widgets    = {};
    var loaded_widgets       = {};
    Iris._FrameBuilder.available_widgets = available_widgets;

    var dataflow_resources     = [];
    Iris._FrameBuilder.dataflow_resources = dataflow_resources;
    var available_dataflows    = {};
    var loaded_dataflows       = [];
    Iris._FrameBuilder.available_dataflows = available_dataflows;
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

        var layout = settings.layout;
        if (layout) {
            PageLayout = $('body').layout(layout);
        }

        dh.initialize_data_storage();

        var rendererResources = settings.renderer_resources;
        if (rendererResources) {
            for (i in rendererResources) {
                promises.push(fb.query_renderer_resource(rendererResources[i]));
            }
        }

        var widgetResources = settings.widget_resources;
        if (widgetResources) {
            for (i in widgetResources) {
                promises.push(fb.query_widget_resource(widgetResources[i]));
            }
        }

        var dataResources = settings.data_resources;
        if (dataResources) {
            for (i in dataResources) {
                promises.push(fb.query_data_resource(dataResources[i]));
            }
        }

        var dataflowResources = settings.dataflow_resources;
        if (dataflowResources) {
            for (i in dataflowResources) {
                promises.push(fb.query_dataflow_resource(dataflowResources[i]));
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
            for (i = 0; i < data.length; i++) {
	      var rend = {};
	      rend.resource = resource;
	      rend.name = data[i].substring(data[i].indexOf(".") + 1, data[i].lastIndexOf("."));
	      rend.filename = data[i];
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
	      widget.name = data[ii].substring(data[ii].indexOf(".") + 1, data[ii].lastIndexOf("."));
	      widget.filename = data[ii];
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
        var promise;
        if (loaded_renderers[renderer]) {
            promise = loaded_renderers[renderer];
        } else {
            promise = jQuery.Deferred();
            loaded_renderers[renderer] = promise;

            var promises = [];

            var rend_data = available_renderers[renderer];
            var script_url = rend_data.resource + rend_data.filename;
            jQuery.getScript(script_url).then(function() {
                var requires = Iris.Renderer[renderer].about.requires;
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
            jQuery.getScript(script_url).then(function() {
                var requires = Iris.Widget[widget].about('requires');
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
}).call(this); // END FrameBuilder
