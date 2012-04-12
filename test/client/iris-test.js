var target  = __dirname + '/../../root/js/iris.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var jQueryStub = require(__dirname + '/stubs.js').jQueryStub;
var Iris = null;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: documentStub,
            jQuery: jQueryStub
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
    }
};