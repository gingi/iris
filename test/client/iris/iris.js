var requirejs = require('../../client-require')();

describe('Iris', function () {
    it("should be an object", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.should.be.a("object");
            done();
        });
    });
    it("should have widget and renderer", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.should.have.property("Widget");
            Iris.should.have.property("Renderer");
            done();
        });
    });
});

describe('Iris.Widget', function () {
    it("should allow extending", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.Widget.should.have.property("extend");
            Iris.Widget.extend.should.be.a("function");
            done();
        });
    });
    it("should allow instantiation with element", function (done) {
        requirejs(['iris'], function (Iris) {
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
    })
});

describe('Iris.Renderer', function () {
    it("should allow extending", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.Renderer.should.have.property("extend");
            Iris.Renderer.extend.should.be.a("function");
            done();
        });
    });
    it("should call 'initialize()' on new", function (done) {
        requirejs(['iris'], function (Iris) {
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
        requirejs(['iris'], function (Iris) {
            var renderer = new Iris.Renderer();
            renderer.setData.should.be.a("function");
            renderer.getData.should.be.a("function");
            done();
        });
    });
    it("should have an about object", function (done) {
        requirejs(['iris'], function (Iris) {
            var MyRenderer = Iris.Renderer.extend({
                about: { foo: "bar" }
            });
            var renderer = new MyRenderer();
            renderer.about.should.eql({ foo: "bar" });
            done();
        })
    });
    it("should use body element by default", function (done) {
        requirejs(['iris'], function (Iris) {
            var renderer = new Iris.Renderer();
            renderer.options.element.should.equal("body");
            done();
        });
    });
    it("should allow target element to be overridden", function (done) {
        requirejs(['iris'], function (Iris) {
            var renderer = new Iris.Renderer({ element: "#element-id" });
            renderer.options.element.should.equal("#element-id");
            done();
        })
    });
});
