var target  = __dirname + '/../../root/js/iris.js';
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname + '/../../root/js',
	nodeRequire: require,
	paths: {
		jquery: require('jquery'),
	},
});

requirejs([target], function (Iris) {
	module.exports = {
		setUp: function (callback) {
			callback();
		},
	
		tearDown: function (callback) {
			callback();
		},
	
		createWidget: function (test) {
			var widget = Iris.Widget.extend({
			});
			test.ok(typeof widget.display === 'function',
				"Should be able to call display()");
			test.done();
		},
		
		modelHasEvents: function (test) {
			var model = Iris.Model.create({ foo: "bar" });
			test.ok(typeof model.on === 'function',
				'on() should be defined on Model');
			test.done();
		},
	
		aboutAppendsWidgetNamespace: function (test) {
			var widget = Iris.Widget.extend({
				about: { name: "ArrayAboutWidget" }
			});
			test.equals(widget, Iris.Widget.ArrayAboutWidget);
			test.done();
		},
		
		aboutAsFunctionInWidget: function (test) {
			var widget = Iris.Widget.extend({
				about: function () { return { name: "AnotherWidget" }; }
			});
			test.equals(widget, Iris.Widget.AnotherWidget);
			test.done();
		},
		
		targetCascades: function (test) {
			var widget = Iris.Widget.extend();
			test.equals(widget, widget.target("div"));
			test.equals("div", widget.targetElement);
			test.done();
		},
		
		modelEvents: function (test) {
			var receiver;
			var model = Iris.Model.create({ a: "x" });
			model.on("some-event", function (msg) {
				receiver = msg;
			});
			model.trigger("some-event", "Event Triggered");
			test.equals("Event Triggered", receiver);
			test.done();
		},
		
		aboutAppendsRendererNamespace: function (test) {
			var renderer = Iris.Renderer.extend({
				about: { name: "KewlRenderer" }
			});
			test.equals(renderer, Iris.Renderer.KewlRenderer);
			test.done();
		},
		
		createWidget2: function (test) {
			Iris.Widget.extend({
				about: { name: "KrazyGadget" }
			});
			var widget = Iris.Widget.KrazyGadget.create();
			test.equals("KrazyGadget", widget.about.name);
			test.done();
		},
		
		extendFromAnExistingRenderer: function (test) {
			var result;
			var renderer1 = Iris.Renderer.extend({
				about: { name: "AbstractRenderer", foo: "bar" },
				render: function () { result = "A"; }
			});
			var renderer2 = renderer1.extend({
				about: { foo: "goo" },
				render: function () { result = "B"; }
			});
			// test.equals("bar", renderer1.about("foo"));
			renderer1.render();
			test.equals("A", result);
			// test.equals("goo", renderer2.about("foo"));
			renderer2.render();
			test.equals("B", result);
			test.done();
		},
		
		widgetSetupIsOptional: function (test) {
			var widget;
			test.doesNotThrow(function () {
				widget = Iris.Widget.extend();
			});
			var setupReturn = widget.setup();
			test.deepEqual([], setupReturn,
				"setup() should have returned an empty array, but got " +
				setupReturn);
			test.done();
		},
		
		widgetSetupReturnsArrayOrElse: function (test) {
			test.throws(function () {
				var widget = Iris.Widget.extend({setup: "nonfunction"});
			});
			test.throws(function () {
				var widget = Iris.Widget.extend({ setup: function () { } });
				widget.create();
			});
			test.done();
		},
		
		rendererUsesDefaultValues: function (test) {
			var result;
			var renderer = Iris.Renderer.extend({
				about: {
					defaults: { foo: "bar" }
				},
				render: function (settings) {
					result = settings["foo"];
				}
			});
			renderer.render({ foo: "goo" });
			test.equal("goo", result,
				"'foo' default element should be overridden");
			renderer.render({});
			test.equal("bar", result,
				"'foo' default should be used");
			test.done();
		},
		
		rendererWithoutDefaults: function (test) {
			var renderer = Iris.Renderer.extend({
				about: {
				},
				render: function (settings) {
				}
			});
			test.doesNotThrow(function () {
				renderer.render();
			});
			test.done();
		},
		
		rendererUsesDefaultCallback: function (test) {
			var result;
			var renderer = Iris.Renderer.extend({
				about: {
					setDefaults: function () { return { foo: "bar" }; }
				},
				render: function (settings) {
					result = settings.foo;
				}
			});
			renderer.render();
			test.equal("bar", result, "'foo' should be set to the default");
			test.done();
		},
		dataHandlerShock: function (test) {
			var dh = Iris._DataHandler;
			test.ok(dh);
			dh.initialize_data_storage();
			dh.add_repository({
				url:'http://shock.mcs.anl.gov/node',
				id:'shock',
				type:'shock'
			});
			test.ok(dh.repositories().hasOwnProperty('shock'));
			dh.get_objects('metagenome', {
				'data_repository': 'shock',
				'query' : [ 'query', '1', 'type', 'metagenome', 'limit', '100' ]
				}, function (arg) {
					test.ok(dh.DataStore.hasOwnProperty('metagenome'));
			}, "foo");
			test.done();
		},	
	}
});