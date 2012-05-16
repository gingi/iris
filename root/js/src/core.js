/*
* core.js
*
* Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
*/

define(["datahandler", "framebuilder", "jquery"],
function (DataHandler, FrameBuilder, jQuery) {
    console.log("core");
    var Iris = {};
    var dataServiceURI;
    var services = Iris.services = {};
    var Widget = Iris.Widget = {};
    var Renderer = Iris.Renderer = {};
    
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

    function capitalize(string) {
        if (string == null || string == "") return string;
        return string[0].toUpperCase() + string.slice(1);
    }
    
    Iris.normalizeName = function (string) {
        // var capitalized = capitalize(string);
        return string.split(/\s/).join('');
    };
    
    var initPromise = null;
	var revalidPromise = null;
    Iris.init = function () {
        if (initPromise == null) {
            initPromise = FrameBuilder.init({
	            renderer_resources: [ '/renderer/' ],
	            data_resources: [
	                'http://dev.metagenomics.anl.gov/api_new.cgi'
	            ], 
	            dataflow_resources: [
	                 'http://dev.metagenomics.anl.gov/api_new.cgi/dataflow/'
	            ],
	            library_resource: '/js/',
	            widget_resources: [ '/widget/' ],
	            layout: null,
	            viewports: null
	        });
	    }
		revalidPromise = Iris.require('revalidator.js');
        return initPromise;
    }
    
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

	Iris.validate = function (obj, schema) {
		if (revalidPromise !== null) {
			return window.json.validate(obj, schema);
		} else {
			return {valid: false, errors: ['validate function not defined']};
		}
	}
    /* ===================================================
     * Iris.Widget
     */
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
            renderers: {},
            target: function (target) {
                widget.targetElement = target;
                return widget;
            },
            loadRenderer: function (name) {
                var promise = FrameBuilder.load_renderer(name);
                return promise;
            },
            getData: function (args) {
                return Iris._DataHandler.get_objects(args);
            },
            create: function (element, args) {
                var widgetInstance = {
                    about: about
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
            
            if (renderer.about.schema != null) {
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
    	FrameBuilder.init_dragobject(arg1, arg2, arg3);
    };

    return Iris;
});
