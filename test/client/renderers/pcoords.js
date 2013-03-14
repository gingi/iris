var requirejs = require('../../client-require')();

describe('Pcoords', function () {
    it("should be a function", function (done) {
        requirejs(['renderers/pcoords'], function (Pcoords) {
            Pcoords.should.be.a("function");
            done();
        });
    });
    it("should throw an error on wrong data", function (done) {
        requirejs(['renderers/pcoords'], function (Pcoords) {
            var renderer = new Pcoords();
            try {
                renderer.setData({ foo: "bar" });
                should.fail("Should have thrown an error");
            } catch (err) {
                done();
            }
        });
    });
    it("should set and get data", function (done) {
        requirejs(['renderers/pcoords'], function (Pcoords) {
            var renderer = new Pcoords();
            var data = {
                contigs: [],
                variations: [],
                maxscore: 0
            };
            renderer.setData(data);
            renderer.getData().should.eql(data);
            done();
        });
    });
});
