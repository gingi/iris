var target  = __dirname + '/../../root/js/widgets/widget.js';
var sandbox = require('nodeunit').utils.sandbox;
var context = sandbox(target, { console: console });
var Iris    = context.Iris;

exports.createWithNoParamsThrowsOnRender = function (test) {
    var widget = Iris.Widget.create();
    test["throws"](function () { widget.render(); },
        "No render defined, should throw an exception");
    test.done();
};

exports.createWithRenderFunction = function (test) {
    var widget = Iris.Widget.create({
        render: function () {}
    });
    test.doesNotThrow(function () { widget.render(); },
        "render() is defined. Should not complain.");
    test.done();
};

exports.createWithNonFunctionRender = function (test) {
    test["throws"](function () {
        Iris.Widget.create({
            render: "A String"
        });
    }, null, "'render:' param to create() should not be a String");
    test.done();
};

exports.findCreatedWidget = function (test) {
    Iris.Widget.create({
        name: "MyAwesomeWidget"
    });
    
    test.ok(Iris.Widget.MyAwesomeWidget != null,
        "Should be able to reference a created widget");
    test.done();
};