var assert = require("assert");
var requirejs = require("../client-require")();

describe("Iris", function () {
    it("should be an object", function (done) {
        requirejs(["iris"], function (Iris) {
            Iris.should.be.an.Object;
            done();
        });
    });
    it("should have widget and renderer", function (done) {
        requirejs(["iris"], function (Iris) {
            Iris.should.have.property("Widget");
            Iris.should.have.property("Renderer");
            done();
        });
    });
});

describe("Iris.Widget", function () {
    it("should allow extending", function (done) {
        requirejs(["iris"], function (Iris) {
            Iris.Widget.should.have.property("extend");
            Iris.Widget.extend.should.be.a.Function;
            done();
        });
    });
    it("should allow instantiation with element", function (done) {
        requirejs(["iris"], function (Iris) {
            var Widget = Iris.Widget.extend({
                foo: function () {
                    this.element.should.equal("myeye");
                    [this.otherProp].should.be.undefined;
                    done();
                }
            });
            var widget = new Widget({ element: "myeye", otherProp: "hi" });
            widget.foo();
        });
    });
    it("should support registering of new Widgets", function (done) {
        requirejs(["iris"], function (Iris) {
            var Widget = Iris.Widget.extend();
            Iris.Widget.register("MyFunkyWidget", Widget);
            Iris.Widget.MyFunkyWidget.should.equal(Widget);
            done();
        })
    });    
});

describe("Iris.Renderer", function () {
    it("should allow extending", function (done) {
        requirejs(["iris"], function (Iris) {
            Iris.Renderer.should.have.property("extend");
            Iris.Renderer.extend.should.be.a.Function;
            
            var renderer = Iris.Renderer.extend();
            new renderer().should.be.an.instanceof(Iris.Renderer);
            done();
        });
    });
    it("should call 'initialize()' on new", function (done) {
        requirejs(["iris"], function (Iris) {
            var called = false;
            var Renderer2 = Iris.Renderer.extend({
                initialize: function () { called = true; }
            });
            var renderer = new Renderer2();
            called.should.be.true;
            done();
        });
    });
    it("should have getData and setData", function (done) {
        requirejs(["iris"], function (Iris) {
            var renderer = new Iris.Renderer();
            renderer.setData.should.be.a.Function;
            renderer.getData.should.be.a.Function;
            done();
        });
    });
    it("should have an about object", function (done) {
        requirejs(["iris"], function (Iris) {
            var MyRenderer = Iris.Renderer.extend({
                about: { foo: "bar" }
            });
            var renderer = new MyRenderer();
            renderer.about.should.eql({ foo: "bar" });
            done();
        })
    });
    it("should use body element by default", function (done) {
        requirejs(["iris"], function (Iris) {
            var renderer = new Iris.Renderer();
            renderer.options.element.should.equal("body");
            done();
        });
    });
    it("should allow target element to be overridden", function (done) {
        requirejs(["iris"], function (Iris) {
            var renderer = new Iris.Renderer({ element: "#element-id" });
            renderer.options.element.should.equal("#element-id");
            done();
        });
    });
    it("should allow extending of sub-renderers", function (done) {
        requirejs(["iris"], function (Iris) {
            var VirtualRenderer =
                Iris.Renderer.extend({ about: { name: "base" } });
            var SubRenderer =
                VirtualRenderer.extend({ about: { name: "sub" } });
            var vRenderer = new VirtualRenderer();
            vRenderer.about.should.eql({ name: "base" });
            var subRenderer = new SubRenderer()
            subRenderer.should.be.an.instanceOf(Iris.Renderer);
            subRenderer.about.should.eql({ name: "sub" });
            done();
        });
    });
    it("should support registering of new Renderers", function (done) {
        requirejs(["iris"], function (Iris) {
            var Renderer = Iris.Renderer.extend();
            Iris.Renderer.register("MyFunkyRenderer", Renderer);
            Iris.Renderer.MyFunkyRenderer.should.equal(Renderer);
            done();
        })
    });
});
