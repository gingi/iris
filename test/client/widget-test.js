var target = __dirname + '/../../root/js/widgets/widget.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var Iris;


module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: documentStub
        });
        Iris = context.Iris;
        callback();
    },
    tearDown: function (callback) {
        delete Iris.Widget;
        delete Iris;
        callback();
    },
    
    createWithNoParamsThrowsOnDisplay: function (test) {
        var widget = Iris.Widget.create({
            about: {
                name: "SomeWidget"
            }
        });
        test.throws(function () {
            widget.display();
        }, null, "No display defined, should throw an exception");
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
                about: {
                    name: "HelloWidget"
                },
                display: "A String"
            });
        }, null, "'display:' param to create() should not be a String");
        test.done();
    },

    findCreatedWidget: function (test) {
        var widget = Iris.Widget.create({
            about: function () {
                return {
                    name: "MyAwesomeWidget"
                };
            }
        });

        test.ok(Iris.Widget.MyAwesomeWidget != null,
            "Should be able to reference a created widget");
        test.equals(widget, Iris.Widget.MyAwesomeWidget);
        test.done();
    },

    aboutAsFunction: function (test) {
        var widget = Iris.Widget.create({
            about: function () {
                return {
                    name: "FunctionAboutWidget"
                };
            }
        });
        test.equals(widget, Iris.Widget.FunctionAboutWidget);
        test.done();
    },

    aboutAsAssociativeArray: function (test) {
        var widget = Iris.Widget.create({
            about: {
                name: "ArrayAboutWidget"
            }
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
            about: function () {
                return {
                    name: "SomeWidget"
                };
            }
        });
        test.equals(widget, widget.div("someDiv"));
        test.equals(widget, widget.div("div1").div("div2"));
        test.equals("div2", widget.divId);
        test.done();
    },

    divElement: function (test) {
        var widget = Iris.Widget.create({
            about: function () {
                return {
                    name: "W"
                };
            }
        });
        test.throws(function () {
            widget.divElement()
        }, null, "Should throw an error when no divId defined.");
        test.done();
    },

    getDefaultRenderer: function (test) {
        var calledRenderer = false;
        // Create stub
        Iris.Renderer = {};
        Iris.Renderer.MyRenderer = {
            render: function () {
                calledRenderer = true;
            }
        };
        var widget = Iris.Widget.create({
            about: {
                name: "SomeWidget",
                renderers: {
                default:
                    "MyRenderer"
                }
            }
        });
        widget.display();
        test.ok(calledRenderer,
            "display() should have called the default renderer");
        test.done();
    },

    renderLayout: function (test) {
        var calledRender = 0;
        var times = 5;
        var widget = Iris.Widget.create({
            about: {
                name: "SomeWidget"
            },
            layout: function (layout) {
                for (var i = 0; i < times; i++) {
                    layout.append({
                        render: function (data) {
                            calledRender++;
                        },
                        dataPath: ""
                    });
                }
            }
        });
        test.equals(0, calledRender,
            "render() should be called 0 times before display() " +
            "(called " + calledRender + " times)");

        // Stub getJSON to avoid network communication
        widget.getJSON = function (path, fn) {
            fn();
        };
        widget.display();
        test.equals(times, calledRender,
            "render() should be called " + times + " times after display() " +
            "(called " + calledRender + " times)");
        test.done();
    },

    malformedLayoutThrowsError: function (test) {
        // No render function
        test.throws(function () {
            Iris.Widget.create({
                about: {
                    name: "SomeWidget"
                },
                layout: function (layout) {
                    layout.append({
                        dataPath: ""
                    });
                }
            });
        }, null, "layout.append with empty object should throw error");

        // 'render:' is not a function
        test.throws(function () {
            Iris.Widget.create({
                about: {
                    name: "SomeWidget"
                },
                layout: function (layout) {
                    layout.append({
                        dataPath: "",
                        render: {}
                    });
                }
            });
        }, null, "layout.append should throw error on non-function render:");

        // No dataPath
        test.throws(function () {
            Iris.Widget.create({
                about: {
                    name: "SomeWidget"
                },
                layout: function (layout) {
                    layout.append({
                        render: function () {}
                    });
                }
            });
        }, null, "layout.append with no dataPath should throw error");

        // No error
        test.doesNotThrow(function () {
            Iris.Widget.create({
                about: {
                    name: "SomeWidget"
                },
                layout: function (layout) {
                    layout.append({
                        render: function () {},
                        dataPath: "/"
                    });
                }
            });
        }, null, "Should be valid layout.append() usage");
        test.done();
    },

    layoutRenderer: function (test) {
        var calledRender = false;
        Iris.Renderer = {
            "MyRenderer": {
                render: function () {
                    calledRender = true;
                }
            }
        };
        var widget = Iris.Widget.create({
            about: {
                name: "MyWidget"
            },
            layout: function (layout) {
                layout.append({
                    renderer: "MyRenderer",
                    dataPath: "/"
                });
            }
        })

        // Stub getJSON to avoid network communication
        widget.getJSON = function (path, fn) {
            fn();
        };
        
        test.ok(!calledRender,
            "Should not have called render() before widget.display()");
        widget.display();
        test.ok(calledRender,
            "Should have called render() after widget.display()");
        test.done();
    },
};
