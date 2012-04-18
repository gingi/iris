var target  = __dirname + '/../../root/js/iris.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var xmlHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Iris = null;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: documentStub,
            jQuery: require('jQuery'),
            XMLHttpRequest: xmlHttpRequest,
            XDomainRequest: xmlHttpRequest
        });
        Iris = context.Iris;
        documentStub.Stub.clearDocument();
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
    dataHandlerCDMI: function (test) {
        var api = require("../../root/js/cdmi.js").CDMI_EntityAPI;
        var dh = Iris._DataHandler;
        test.ok(dh);
        dh.initialize_data_storage();
        var types = "AlignmentTree Annotation AtomicRegulon Attribute Biomass BiomassCompound Compartment Complex Compound Contig ContigChunk ContigSequence CoregulatedSet Diagram EcNumber Experiment Family Feature Genome Identifier Media Model ModelCompartment OTU PairSet Pairing ProbeSet ProteinSequence Publication Reaction ReactionRule Reagent Requirement Role SSCell SSRow Scenario Source Subsystem SubsystemClass TaxonomicGrouping Variant Variation".split(' ');
        for(i=0; i<types.length; i++) {
            var type = types[i];
            var argsWithoutId = ['type', type, 'offset', 0, 'limit', 100];
            var lib = new api();
            var fn   = dh.CDMI_get_function(type, argsWithoutId);
            test.equal(typeof lib[fn], 'function');
            var argsWihId     = ['type', type, 'offset', 0, 'limit', 100];
            var args = dh.CDMI_get_args(type, argsWithoutId);
            test.deepEqual(args[2], {});
            test.equal(args.length, 3);
        }
        test.done();
    },

    irisRequire: function (test) {
        var cb, err;
        cb  = function () { test.ok(true); };
        err = function () { test.ok(false); };
        Iris.require("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", cb);
        Iris.require("https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js", cb, err);
        test.expect(2);
        setTimeout(function () {
            test.done();
        }, 500);
    }

};