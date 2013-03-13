var requirejs = require('../../client-require')();

describe('Manhattan', function () {
    it("should be a function", function (done) {
        requirejs(['renderers/manhattan'], function (Manhattan) {
            Manhattan.should.be.a("function");
            done();
        });
    });
    it("should throw an error on wrong data", function (done) {
        requirejs(['renderers/manhattan'], function (Manhattan) {
            var manhattan = new Manhattan();
            try {
                manhattan.setData({ foo: "bar" });
                should.fail("Should have thrown an error");
            } catch (err) {
                done();
            }
        })
    })
    it("should set and get data", function (done) {
        requirejs(['renderers/manhattan'], function (Manhattan) {
            var manhattan = new Manhattan();
            var data = {
                contigs: [],
                variations: [],
                maxscore: 0
            };
            manhattan.setData(data);
            manhattan.getData().should.eql(data);
            done();
        })
    })
});
