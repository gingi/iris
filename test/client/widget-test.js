var target  = __dirname + '/../../root/js/widgets/widget.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var sandbox = require('nodeunit').utils.sandbox;
var context = sandbox(target, { console: console, document: documentStub });
var Iris    = context.Iris;

exports.createWithNoParamsThrowsOnDisplay = function (test) {
    var widget = Iris.Widget.create({
        about: { name: "SomeWidget" }
    });
    test["throws"](function () { widget.display(); }, null,
        "No display defined, should throw an exception");
    test.done();
};

exports.createWithRenderFunction = function (test) {
    var widget = Iris.Widget.create({
        about: { name: "SomeWidget" },
        display: function () {}
    });
    test.doesNotThrow(function () { widget.display(); }, null,
        "display() is defined. Should not complain.");
    test.done();
};

exports.createWithNonFunctionRender = function (test) {
    test["throws"](function () {
        Iris.Widget.create({
            about: { name: "HelloWidget" },
            display: "A String"
        });
    }, null, "'display:' param to create() should not be a String");
    test.done();
};

exports.findCreatedWidget = function (test) {
    var widget = Iris.Widget.create({
        about: function () {
            return { name: "MyAwesomeWidget" };
        }
    });
    
    test.ok(Iris.Widget.MyAwesomeWidget != null,
        "Should be able to reference a created widget");
    test.equals(widget, Iris.Widget.MyAwesomeWidget);
    test.done();
};

exports.aboutAsFunction = function (test) {
    var widget = Iris.Widget.create({
        about: function () {
            return { name: "FunctionAboutWidget" };
        }
    });
    test.equals(widget, Iris.Widget.FunctionAboutWidget);
    test.done();
};

exports.aboutAsAssociativeArray = function (test) {
    var widget = Iris.Widget.create({
        about: {
            name: "ArrayAboutWidget"
        }
    });
    test.equals(widget, Iris.Widget.ArrayAboutWidget);
    test.done();
};

exports.aboutAsOtherObjectThrowsError = function (test) {
    test["throws"](function () {
        Iris.Widget.create({ about: "AboutString" })
    }, null, "about: as a String should throw error");
    test.done();
};

exports.cascadingMethods = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "SomeWidget" }; }
    });
    test.equals(widget, widget.div("someDiv"));
    test.equals(widget, widget.div("div1").div("div2"));
    test.equals("div2", widget.divId);
    test.done();
};

exports.divElement = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "W" }; }
    });
    test["throws"](function () {
        widget.divElement()
    }, null, "Should throw an error when no divId defined.");
    test.done();
};

exports.getDefaultRenderer = function (test) {
    var calledRenderer = false;
    // Create stub
    Iris.Renderer = {
    };
    Iris.Renderer.MyRenderer = {
        render: function () {
            calledRenderer = true;
        }
    };
    var widget = Iris.Widget.create({
        about: {
            name: "SomeWidget",
            renderers: {
                default: "MyRenderer"
            }
        }
    });
    widget.display();
    test.ok(calledRenderer,
        "display() should have called the default renderer");
    test.done();
};