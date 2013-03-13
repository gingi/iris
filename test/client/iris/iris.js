var requirejs = require('../../client-require')();

describe('Iris', function () {
    it("should be an object", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.should.be.a("object");
            done();
        })
    })
    it("should have widget and renderer", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.should.have.property("Widget");
            Iris.should.have.property("Renderer");
            done();
        })
    })
});

describe('Iris.Widget', function () {
    it("should allow extending", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.Widget.should.have.property("extend");
            Iris.Widget.extend.should.be.a("function");
            done();
        })
    })
});

describe('Iris.Renderer', function () {
    it("should allow extending", function (done) {
        requirejs(['iris'], function (Iris) {
            Iris.Renderer.should.have.property("extend");
            Iris.Renderer.extend.should.be.a("function");
            done();
        })
    })
});
