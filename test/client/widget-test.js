var target  = __dirname + '/../../root/js/widgets/widget.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var jQueryStub = require(__dirname + '/stubs.js').jQueryStub;
var Iris;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: documentStub,
            jQuery: jQueryStub
        });
        Iris = context.Iris;
        Iris.Renderer = {
            create: function (args) {
                var that = args;
                that.div = function () {};
                return that;
            }
        };
        Iris.getJSON = function (path, func) { func(); };
        callback();
    },

    tearDown: function (callback) {
        delete Iris.Widget;
        delete Iris;
        callback();
    },

    createWithNoParamsThrowsOnDisplay: function (test) {
        var widget = Iris.Widget.create({
            about: { name: "SomeWidget" }
        });
        test.throws(function () {
            widget.display();
        }, null, "Without renderer defined, should throw an exception");
    test.done();
    },

    createWithRenderFunction: function (test) {
        var widget = Iris.Widget.create({
            about: {
                name: "SomeWidget"
            },
            display: function () {}
        });
        test.doesNotThrow(function () {
            widget.display();
        }, null, "display() is defined. Should not complain.");
        test.done();
    },

    createWithNonFunctionRender: function (test) {
        test.throws(function () {
            Iris.Widget.create({
                about: { name: "HelloWidget" },
                display: "A String"
            });
        }, null, "'display:' param to create() should not be a String");
        test.done();
    },

    aboutAsFunction: function (test) {
        var widget = Iris.Widget.create({
            about: function () {
                return { name: "FunctionAboutWidget" };
            }
        });
        test.equals(widget, Iris.Widget.FunctionAboutWidget);
        test.done();
    },

    aboutAsAssociativeArray: function (test) {
        var widget = Iris.Widget.create({
            about: { name: "ArrayAboutWidget" }
        });
        test.equals(widget, Iris.Widget.ArrayAboutWidget);
        test.done();
    },

    aboutAsOtherObjectThrowsError: function (test) {
        test.throws(function () {
            Iris.Widget.create({
                about: "AboutString"
            })
        }, null, "about: as a String should throw error");
        test.done();
    },

    cascadingMethods: function (test) {
        var widget = Iris.Widget.create({
            about: { name: "SomeWidget" }
        });
        test.equals(widget, widget.div("someDiv"));
        test.equals(widget, widget.div("div1").div("div2"));
        test.equals("div2", widget.divId);
        test.done();
    },

    divElement: function (test) {
        var widget = Iris.Widget.create({
            about: { name: "W" }
        });
        test.throws(function () {
            widget.divElement()
        }, null, "Should throw an error when no divId defined.");
        test.done();
    },

    renderLayout: function (test) {
        var calledRender = 0;
        var times = 5;
        var widget = Iris.Widget.create({ about: { name: "SomeWidget" } });
        for (var i = 0; i < times; i++) {
            widget.append({
                render: function (data) {
                    calledRender++;
                },
                dataPath: ""
            });
        }
        
        test.equals(0, calledRender,
            "render() should be called 0 times before display() " +
            "(called " + calledRender + " times)");

        widget.display();
        test.equals(times, calledRender,
            "render() should be called " + times + " times after display() " +
            "(called " + calledRender + " times)");
        test.done();
    },

    malformedLayoutThrowsError: function (test) {
        var layoutWidget = function (renderItem) {
            var widget = Iris.Widget.create({ about: { name: "SomeWidget" } });
            widget.append(renderItem);
        };
        // No render function
        test.throws(function () {
            layoutWidget({ dataPath: "" });
        }, null, "layout.append with empty object should throw error");

        // 'render:' is not a function
        test.throws(function () {
            layoutWidget({ dataPath: "", render: {} });
        }, null, "layout.append should throw error on non-function render:");

        // No error
        test.doesNotThrow(function () {
            layoutWidget({ render: function () {}, dataPath: "/" });
        }, null, "Should be valid layout.append() usage");
        test.done();
    },

    layoutRenderer: function (test) {
        var calledRender = false;
        Iris.Renderer = {
            MyRenderer: {
                render: function () {
                    calledRender = true;
                },
                div: function () {}
            }
        };
        var widget = Iris.Widget.create({ about: { name: "MyWidget" } });
        widget.append({
            renderer: "MyRenderer",
            dataPath: "/"
        });
        
        test.ok(!calledRender,
            "Should not have called render() before widget.display()");
        widget.display();
        test.ok(calledRender,
            "Should have called render() after widget.display()");
        test.done();
    },
    
    transformDataForRenderer: function (test) {
        var calls = [];
        Iris.Renderer = {
            MyRenderer: {
                render: function (data) { calls.push("render"); },
                div: function () {}
            }
        };
        var widget = Iris.Widget.create({ about: { name: "MyWidget" } });
        widget.append({
            renderer: "MyRenderer",
            dataPath: "",
            transform: function (data) {
                calls.push("transform");
            },
        });
        widget.getJSON = function (path, fn) {
            fn();
        };
        test.deepEqual([], calls,
            "transform: should not be called before widget.display()");
        widget.display();
        test.deepEqual(["transform", "render"], calls,
            "widget.display() should trigger render(), then transform()");
        test.done();
    },
    
    multipleRenderers: function (test) {
        var calls = [];
        var widget = Iris.Widget.create({ about: { name: "LayoutWidget" } });
        widget.append({
            dataPath: "/dataPath1",
            render: function () {
                calls.push("Renderer1");
            }
        })
        .append({
            dataPath: "/dataPath2",
            render: function () {
                calls.push("Renderer2");
            }
        });
        widget.getJSON = function (path, fn) {
            fn();
        };
        test.deepEqual([], calls);
        widget.display();
        test.deepEqual(["Renderer1", "Renderer2"], calls);
        test.done();
    }
};
