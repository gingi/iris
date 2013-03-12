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
