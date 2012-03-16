var target  = __dirname + '/../../root/js/widgets/widget.js';
var sandbox = require('nodeunit').utils.sandbox;
var context = sandbox(target, { console: console });
var Iris    = context.Iris;

exports.createWithNoParamsThrowsOnRender = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "SomeWidget" }; }
    });
    test["throws"](function () { widget.display(); }, null,
        "No display defined, should throw an exception");
    test.done();
};

exports.createWithRenderFunction = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "SomeWidget" }; },
        display: function () {}
    });
    test.doesNotThrow(function () { widget.display(); }, null,
        "display() is defined. Should not complain.");
    test.done();
};

exports.createWithNonFunctionRender = function (test) {
    test["throws"](function () {
        Iris.Widget.create({
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

exports.cascadingMethods = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "SomeWidget" }; }
    });
    test.equals(widget, widget.div("someDiv"));
    test.equals(widget, widget.div("div1").div("div2"));
    test.equals("div2", widget.divId);
    test.done();
}

exports.divElement = function (test) {
    var widget = Iris.Widget.create({
        about: function () { return { name: "W" }; }
    });
    test["throws"](function () {
        widget.divElement()
    }, null, "Should throw an error when no divId defined.");
    test.done();
}