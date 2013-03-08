var requirejs = require('./client-require')();

describe('Iris.Root', function () {
    it("should be a proper function", function (done) {
        requirejs(['iris/root'], function (Root) {
            Root.should.be.a("function");
            done();
        })
    })
    it("should have event functions", function (done) {
        requirejs(['iris/root'], function (Root) {
            var object = new Root();
            object.should.have.property('bind');
            object.should.have.property('trigger');
            done();
        })
    })
    it("should allow extending", function (done) {
        requirejs(['iris/root'], function (Root) {
            var Subclass = Root.extend({
                foo: "bar"
            });
            var object = new Subclass();
            object.should.be.instanceof(Root);
            object.should.have.property("foo", "bar");
            done();
        })
    })
});
