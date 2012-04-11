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
                object[property] = source[property];
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
                        if ((callback && cb !== callback) || (context && ctx !== context)) {
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
        url: "/service",
        dataType: 'json',
        async: false,
        success: function (service) {
            dataServiceURI = service.dataServiceURI;
        }
    });

    jQuery.getJSON("/service/list", function (services) {
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

    /* ===================================================
     * Iris.Widget
     */
    var Widget = Iris.Widget = {};
    Widget.create = function (spec) {
        var widget;
        spec = (spec || {});
        spec.renderers = (spec.renderers || []);
        spec.services  = (spec.services  || []);
        spec.dataflows = (spec.dataflows || []);
        
        widget = {
            target: function (target) {
                widget.targetElement = target;
                return widget;
            },
            display: function () {
                Iris._FrameBuilder.init(
                    spec.renderers,
                    spec.services,
                    spec.dataflows,
                    spec.libraries,
                    spec.layout,
                    [ spec.el ]
                );
                return widget;
            },
            getJSON: Iris.getJSON
        };
        if (spec.about && spec.about.name) {
            Widget[spec.about.name] = widget;
        }
        return widget;
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

    /* ===================================================
     * Iris.TestData
     */
    Iris.TestData = [
        [
            [[0, 0], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
            [[0, 0], [1, 0], [2, 5], [3, 0], [4, 5], [5, 0], [6, 5]],
            [[0, 0], [1, 0], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]
        ],
    
        {
            header: ["firstname", "lastname", "email"],
            data: [
                ["Peter", "Lustig", "plustig@you.wish"],
                ["Hans", "Meier", "hmeier@google.com"],
                ["Stevie", "Wonder", "stevie.wonder@mohnbroetchen.de"],
                ["Mahatma", "Ghandi", "mghandi@nirvana.org"]
            ]
        },

        [
            ["apples", 20],
            ["oranges", 30],
            ["pineapples", 40],
            ["pears", 5]
        ]
    ];
}).call(this);

// DataHandler
(function () {
    var dh = Iris._DataHandler = {};
    
    // global variables
    var DataStore = dh.DataStore = [];
    var TypeData;
    var CallbackList;
    var DataRepositories;
    var DataRepositoriesCount;
    var DataRepositoryDefault;

    // set up / reset the DataHandler, adding initial repositories


    dh.initialize_data_storage = function (repositories) {
        DataStore = [];
        TypeData = [];
        TypeData['types'] = [];
        TypeData['type_count'] = 0;
        CallbackList = [];
        DataRepositories = [];
        DataRepositoriesCount = 0;
        DataRepositoryDefault = null;

        if (repositories) {
            for (var i = 0; i < repositories.length; i++) {
                DataRepositories[repositories[i].id] = repositories[i];
                DataRepositoriesCount++;
                if (DataRepositoriesCount == 1) {
                    DataRepositoryDefault =
                        DataRepositories[repositories[i].id];
                }
            }
        }
    }

    // generic data loader
    // given a DOM id, interprets the innerHTML of the element as JSON data and loads it into the DataStore
    // given a JSON data structure, loads it into the DataStore


    dh.load_data = function (id_or_data, no_clear, type) {
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
            if (!new_data.length) {
                new_data = [{
                    'type': type,
                    'data': [new_data]
                }];
            }
            for (var i = 0; i < new_data.length; i++) {
                if (new_data[i].type) {
                    var type = new_data[i].type;
                    if (!TypeData['types'][type]) {
                        DataStore[type] = [];
                        TypeData['type_count']++;
                        TypeData['types'][type] = 0;
                        if (new_data[i].type_description) {
                            TypeData['type_description'][type] = new_data[i].type_description;
                        }
                    }
                    for (var h = 0; h < new_data[i].data.length; h++) {
                        if (!DataStore[type][new_data[i].data[h].id]) {
                            TypeData['types'][type]++;
                        }
                        DataStore[type][new_data[i].data[h].id] = new_data[i].data[h];
                    }
                }
            }
        }
    }

    // adds / replaces a repository in the DataRepositories list


    dh.add_repository = function (repository) {
        if (repository && repository.id) {
            DataRepositories[repository.id] = repository;
            DataRepositoriesCount++;
            if (repository.
        default ||DataRepositoryDefault == null) {
                DataRepositoryDefault = DataRepositories[repository.id];
            }
        }
    }

    // removes a repository from the DataRepositories list


    dh.remove_repository = function (id) {
        if (id && DataRepositories[id]) {
            DataRepositories[id] = null;
            DataRepositoriesCount--;
            if (DataRepositoryCount == 1) {
                for (var i in DataRepositories) {
                    DataRepositoryDefault = DataRepositories[i];
                }
            }
        }
    }

    // sets the default repository


    dh.default_repository = function (id) {
        if (id && DataRepositories[id]) {
            DataRepositoryDefault = DataRepositories[id];
        }
    }

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
                        load_data(new_data);
                        callback_function.call(null, callback_parameters);
                    };
                })(f);
                reader.readAsText(f);
            }
        }
    }

    // client side data requestor
    // initiates data retrieval from a resource, saving callback functions /
    // paramters
    dh.get_objects = function (type, resource_params, callback_func, callback_params) {
        if (!CallbackList[type]) {
            CallbackList[type] = [
                [callback_func, callback_params]
            ];
            get_objects_from_repository(type, resource_params);
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
    }

    // data retrieval function triggered by get_objects
    // queries the default DataRepository if none is defined in resource_params
    // sets requested query and REST parameters as well as authentication and initiates the asynchronous call
    // the data server needs to support CORS


    dh.get_objects_from_repository = function (type, resource_params) {
        var rest_params = "";
        var query_params = "";
        var base_url = DataRepositoryDefault.url;
        var authentication = "";
        if (DataRepositoryDefault.authentication) {
            authentication = "&" + DataRepositoryDefault.authentication;
        }

        if (resource_params) {
            if (resource_params.data_repository && DataRepositories[resource_params.data_repository]) {
                base_url = DataRepositories[resource_params.data_repository].url;
                if (DataRepositories[resource_params.data_repository].authentication) {
                    authentication = "&" + DataRepositories[resource_params.data_repository].authentication;
                } else {
                    authentication = "";
                }
            }
            if (resource_params.rest) {
                rest_params += resource_params.rest.join("/");
            }
            if (resource_params && resource_params.query) {
                for (var i = 0; i < resource_params.query.length - 1; i++) {
                    query_params += "&" + resource_params.query[i] + "=" + resource_params.query[i + 1];
                }
            }
        }

        base_url += type + "/" + rest_params + query_params + authentication;

        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open('GET', base_url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open('GET', base_url);
        } else {
            alert("your browser does not support CORS requests");
            return;
        }
        xhr.onload = function() {
            load_data(JSON.parse(xhr.responseText), null, type);
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
            alert("data retrieval failed");
            return;
        };

        xhr.onabort = function() {
            alert("data retrieval was aborted");
            return;
        }

        xhr.send();
    }

    // called by the returned data from a get_objects_from_repository call
    // loads the returned data into the DataStore, deletes the sent data from the DOM
    // and initiates all callback functions for the type


    dh.data_return = function (type, new_data) {
        type = type.toLowerCase();
        var old_script = document.getElementById('callback_script_' + type);
        document.getElementsByTagName('head')[0].removeChild(old_script);
        load_data([{
            'type': type,
            'data': new_data
        }]);
        callback(type);
    }

    // function for backwards compatibility


    dh.ajax_result = function (new_data, type) {
        data_return(type, new_data);
    }

    // executes the callback functions for a given type


    dh.callback = function (type) {
        type = type.toLowerCase();
        for (var c = 0; c < CallbackList[type].length; c++) {
            CallbackList[type][c][0].call(null, CallbackList[type][c][1], type);
        }
        CallbackList[type] = null;
    }

    // deletes an object from the DataStore


    dh.delete_object = function (type, id) {
        type = type.toLowerCase();
        if (DataStore[type][id]) {
            DataStore[type][id] = null;
            TypeData['types'][type]--;
            if (TypeData['types'][type] == 0) {
                delete_object_type(type);
            }
        }
    }

    // deletes a set of objects from the DataStore


    dh.delete_objects = function (type, ids) {
        type = type.toLowerCase();
        for (var i = 0; i < ids.length; i++) {
            delete_object(type, ids[i]);
        }
    }

    // deletes an entire type from the DataStore


    dh.delete_object_type = function (type) {
        type = type.toLowerCase();
        if (TypeData['types'][type]) {
            TypeData['types'][type] = null;
            TypeData['type_count']--;
            DataStore[type] = null;
        }
    }
})(); // END DataHandler

// FrameBuilder   
(function () {
    var fb = Iris._FrameBuilder = {};
    var dh = Iris._DataHandler;

    var loaded_libraries       = [];
    var library_callback_list  = [];
                              
    var renderer_resources     = [];
    var available_renderers    = [];
    var loaded_renderers       = [];
    var renderer_callback_list = [];

    var dataflow_resources     = [];
    var dataflows              = [];

    var library_resource = null;

    var PageLayout;

    var dragData = null;
    var dragType = null;
    var dropZones = [];

    //
    // initialization
    //


    fb.init = function (rendererResources, dataResources, dataflowResources, libraryResource, layout, viewports) {
        if (layout) {
            PageLayout = $('body').layout(layout);
        }

        dh.initialize_data_storage();

        if (rendererResources) {
            for (i in rendererResources) {
                fb.query_renderer_resource(rendererResources[i]);
            }
        }
        if (dataResources) {
            for (i in dataResources) {
                fb.query_data_resource(dataResources[i]);
            }
        }
        if (dataflowResources) {
            for (i in dataflowResources) {
                fb.query_dataflow_resource(dataflowResources[i]);
            }
        }
        if (libraryResource) {
            library_resource = libraryResource;
        }

        if (viewports) {
            for (i = 0; i < viewports.length; i++) {
                dropZones[viewports[i]] = 1;
                fb.init_dropzone(document.getElementById(viewports[i]));
            }
        }
    }

    //
    // resource section
    //

    fb.query_renderer_resource = function (resource, list) {
        jQuery.get(resource, function (data) {
            renderer_resources[renderer_resources.length] = resource;
            for (i = 0; i < data.length; i++) {
                available_renderers[data[i]] =
                    renderer_resources.length - 1;
            }
            if (list) {
                fb.update_renderer_list(list);
            }
        });
    }

    fb.update_renderer_list = function (list) {
        var renderer_select = document.getElementById(list);
        if (renderer_select) {
            renderer_select.options.length = 0;
            for (i in available_renderers) {
                renderer_select.add(new Option(i, i), null);
            }
        }
    }

    fb.query_dataflow_resource = function (resource, list) {
        jQuery.get(resource,
            function(data) {
                var res = data;
                dataflow_resources[dataflow_resources.length] = resource;
                for (i = 0; i < res.length; i++) {
                    dataflows[res[i]] = dataflow_resources.length - 1;
                }
                if (list) {
                    fb.update_dataflow_list(list);
                }
            }
        );
    }

    fb.update_dataflow_list = function (list) {
        var dataflow_select = document.getElementById(list);
        if (dataflow_select) {
            dataflow_select.options.length = 0;
            for (i in dataflows) {
                dataflow_select.add(new Option(i, i), null);
            }
        }
    }

    fb.query_data_resource = function (resource, list) {
        jQuery.get(resource, function(data) {
            dh.add_repository(data);
            if (list) {
                fb.update_datarepo_list(list);
            }
        });
    }

    fb.update_datarepo_list = function (list) {
        var datarepo_select = document.getElementById(list);
        if (datarepo_select) {
            datarepo_select.options.length = 0;
            for (i in DataRepositories) {
                datarepo_select.add(new Option(i, i), null);
            }
        }
    }

    //
    // renderers
    //


    fb.test_renderer = function (params) {
        if (params.ret) {
            document.getElementById(params.target).innerHTML = "";
            var x = params.renderer;
            x = "Renderer" + x.substr(x.indexOf('.') + 1, 1).toUpperCase() + x.substring(x.indexOf('.') + 2, x.lastIndexOf('.'));
            eval("$('div')." + x + "('render', { 'data': $('div')." + x + "('example_data'), 'target': params.target })");
        } else {
            params.ret = 1;
            fb.load_renderer(params.renderer, fb.test_renderer, params);
        }
    }

    fb.load_renderer = function (renderer, callback_function, callback_params) {
        if (loaded_renderers[renderer]) {
            if (!renderer_callback_list[renderer]) {
                renderer_callback_list[renderer] = [];
            }
            if (loaded_renderers[renderer].ready) {
                callback_function.call(null, callback_params);
            } else {
                renderer_callback_list[renderer][renderer_callback_list[renderer].length] = [callback_function, callback_params];
            }
        } else {
            if (!renderer_callback_list[renderer]) {
                renderer_callback_list[renderer] = [];
            }
            renderer_callback_list[renderer][renderer_callback_list[renderer].length] = [callback_function, callback_params];
            $.get(renderer_resources[available_renderers[renderer]] + renderer, function(data) {
                eval(data);
                var x = renderer;
                x = "Renderer" + x.substr(x.indexOf('.') + 1, 1).toUpperCase() + x.substring(x.indexOf('.') + 2, x.lastIndexOf('.'));
                eval("loaded_renderers[renderer] = $('div')." + x + "('about')");
                for (i = 0; i < loaded_renderers[renderer].requires.length; i++) {
                    fb.load_library(loaded_renderers[renderer].requires[i], fb.check_renderer_dependencies, renderer);
                }
                fb.check_renderer_dependencies(renderer);
            });
        }
    }

    fb.check_renderer_dependencies = function (renderer) {
        var ready = 1;
        for (i = 0; i < loaded_renderers[renderer].requires.length; i++) {
            if (!loaded_libraries[loaded_renderers[renderer].requires[i]]) {
                ready = 0;
            }
        }
        if (ready) {
            if (!renderer_callback_list[renderer]) {
                renderer_callback_list[renderer] = [];
            }
            for (i = 0; i < renderer_callback_list[renderer].length; i++) {
                renderer_callback_list[renderer][i][0].call(null, renderer_callback_list[renderer][i][1]);
            }
            renderer_callback_list[renderer] = null;
            loaded_renderers[renderer].ready = 1;
        }
    }

    fb.load_library = function (library, callback, params) {
        if (loaded_libraries[library]) {
            if (library_callback_list[library]) {
                for (i = 0; i < library_callback_list[library].length; i++) {
                    library_callback_list[library][i][0].call(null, library_callback_list[library][i][1]);
                }
                library_callback_list[library] = null;
            }
        } else {
            if (!library_callback_list[library]) {
                library_callback_list[library] = [];
            }
            library_callback_list[library][library_callback_list[library].length] = [callback, params];

            var scriptTag = document.createElement("script");
            scriptTag.setAttribute("type", "text/javascript");
            scriptTag.setAttribute("src", library_resource + library);
            scriptTag.onload = scriptTag.onreadystatechange = function() {
                if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") {
                    loaded_libraries[library] = 1;
                    fb.load_library(library, callback, params);
                }
            }
            document.getElementsByTagName("head")[0].appendChild(scriptTag);
        }
    }

    //
    // Data Flow Initial Version
    //


    fb.data_flow = function (flow) {
        if (flow.current_step < flow.steps.length) {
            var curr_step = flow.steps[flow.current_step];
            switch (curr_step.action) {
            case "get":
                // gets multiple ids of a resource
                var data_complete = 1;
                var ids;
                if (curr_step.input_ids.length) {
                    ids = curr_step.input_ids;
                } else {
                    ids = flow.steps[curr_step.input_ids].input_ids;
                }
                for (i = 0; i < curr_step.input_ids.length; i++) {
                    if (!dh.DataStore[curr_step.resource] || !dh.DataStore[curr_step.resource][curr_step.input_ids[i]]) {
                        data_complete = 0;
                        get_objects(curr_step.resource, {
                            "rest": [curr_step.input_ids[i]],
                            "data_repository": curr_step.input_data_resource
                        }, data_flow, flow);
                        break;
                    }
                }
                if (data_complete) {
                    flow.current_step++;
                    data_flow(flow);
                }
                break;
            case "merge":
                // merges multiple ids of resource subselections into a single table
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
                    for (h = 0; h < ids.length; h++) {
                        eval("for (i=0; i<dh.DataStore[curr_step.resource][ids[h]]." + curr_step.data + ".length; i++) {if (! data[dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "]) { data[dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "] = []; } data[dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "][h] = dh.DataStore[curr_step.resource][ids[h]]." + curr_step.data + "[i]" + curr_step.subselect + "; }");
                    }
                    var matrix = [];
                    for (i in data) {
                        var row = [i];
                        for (h = 0; h < data[i].length; h++) {
                            row[row.length] = data[i][h];
                        }
                        matrix[matrix.length] = row;
                    }
                    break;
                case "single_column":
                    for (h = 0; h < ids.length; h++) {
                        eval("for (i=0; i<dh.DataStore[curr_step.resource][ids[h]]." + curr_step.data + ".length; i++) {data[dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "] = dh.DataStore[curr_step.resource][ids[h]]." + curr_step.data + "[i]" + curr_step.subselect + "; data[dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "].unshift(dh.DataStore[curr_step.resource][ids[h]]." + curr_step.merge_on + "); }");
                    }
                    var matrix = data;
                    break;
                case "join":
                    var length_a = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][0];
                    for (i in dh.DataStore[curr_step.resource_a][curr_step.input_ids.a]) {
                        var merger = i;
                        if (curr_step.merge_on_a != "i") {
                            eval("merger = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][i]" + curr_step.merge_on_a + ";");
                        }
                        data[merger] = dh.DataStore[curr_step.resource_a][curr_step.input_ids.a][i];
                    }
                    for (i in dh.DataStore[curr_step.resource_b][curr_step.input_ids.b]) {
                        var merger = i;
                        if (curr_step.merge_on_b != "i") {
                            eval("merger = dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i]" + curr_step.merge_on_b + ";");
                        }
                        if (!data[merger]) {
                            data[merger] = [];
                            for (h = 0; h < length_a; h++) {
                                data[merger].push(" ");
                            }
                        }
                        for (h = 0; h < dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i].length; h++) {
                            data[merger].push(dh.DataStore[curr_step.resource_b][curr_step.input_ids.b][i][h]);
                        }
                    }
                    var matrix = [];
                    for (i in data) {
                        var row = [];
                        for (h = 0; h < data[i].length; h++) {
                            row[row.length] = data[i][h];
                        }
                        matrix[matrix.length] = row;
                    }
                    break;
                }
                if (!dh.DataStore[curr_step.name]) {
                    dh.DataStore[curr_step.name] = [];
                }
                dh.DataStore[curr_step.name][curr_step.id] = matrix;
                flow.current_step++;
                data_flow(flow);
                break;
            case "subselect":
                switch (curr_step.type) {
                case "column_list":
                    var matrix = [];
                    for (i = 0; i < dh.DataStore[curr_step.resource][curr_step.input_id].length; i++) {
                        var row = [];
                        for (h = 0; h < curr_step.filter.length; h++) {
                            if (curr_step.filter[h]) {
                                row[row.length] = dh.DataStore[curr_step.resource][curr_step.input_id][i][h];
                            }
                        }
                        matrix[matrix.length] = row;
                    }
                    if (!dh.DataStore[curr_step.name]) {
                        dh.DataStore[curr_step.name] = [];
                    }
                    dh.DataStore[curr_step.name][curr_step.id] = matrix;
                    break;
                }
                flow.current_step++;
                data_flow(flow);
                break;
            case "group":
                var data = [];
                for (i = 0; i < dh.DataStore[curr_step.resource][curr_step.input_id].length; i++) {
                    if (data[dh.DataStore[curr_step.resource][curr_step.input_id][i][curr_step.group_column]]) {
                        var j = 0;
                        for (h = 0; h < dh.DataStore[curr_step.resource][curr_step.input_id][i].length; h++) {
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
                        for (h = 0; h < dh.DataStore[curr_step.resource][curr_step.input_id][i].length; h++) {
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
                    for (h = 0; h < data[k].length; h++) {
                        row.push(data[k][h]);
                    }
                    matrix.push(row);
                }
                if (!dh.DataStore[curr_step.name]) {
                    dh.DataStore[curr_step.name] = [];
                }
                dh.DataStore[curr_step.name][curr_step.id] = matrix;
                flow.current_step++;
                data_flow(flow);
                break;
            case "renderer":
                eval(curr_step.name + "(" + curr_step.params + ")");
                flow.current_step++;
                data_flow(flow);
                break;
            }
        }
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
    }

    //
    // drag and drop
    //

    fb.init_dragobject = function (dragObject, data, type) {
        dragObject.draggable = true;
        dragObject.ondragstart = function(ev) {
            dragType = type;
            dragData = data;
            return true;
        }
        dragObject.ondragend = function(ev) {
            return false;
        }
    }

    fb.init_dropzone = function (dropZone) {
        dropZone.ondragenter = function(ev) {
            return false;
        }
        dropZone.ondragleave = function(ev) {
            return false;
        }
        dropZone.ondragover = function(ev) {
            return false;
        }
        dropZone.ondrop = function(ev) {
            ev = ev || window.event;
            var tar = ev.target;
            while (!dropZones[tar.id]) {
                tar = tar.parentNode;
            }
            if (dragType == 'renderer') {
                fb.test_renderer({
                    'target': tar.id,
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
        }
    }
})(); // END FrameBuilder
