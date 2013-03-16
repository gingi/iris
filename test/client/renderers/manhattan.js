var requirejs = require('../../client-require')();

function runtest(fn) {
    requirejs(['renderers/manhattan'], function (Manhattan) {
        fn(Manhattan);
    });
}

describe('Manhattan', function () {
    it("should be a function", function (done) {
        runtest(function (Manhattan) {
            Manhattan.should.be.a("function");
            done();
        });
    });
    it("should throw an error on wrong data", function (done) {
        runtest(function (Manhattan) {
            var manhattan = new Manhattan();
            try {
                manhattan.setData({ foo: "bar" });
                should.fail("with a thrown error");
            } catch (err) {
                done();
            }
        })
    });
    it("should set and get data", function (done) {
        runtest(function (Manhattan) {
            var manhattan = new Manhattan();
            var data = {
                contigs: [],
                variations: [],
                maxscore: 1
            };
            manhattan.setData(data);
            manhattan.getData().should.eql(data);
            done();
        })
    });
    it("should calculate maxscore if not specified", function (done) {
        runtest(function (Manhattan) {
            var manhattan = new Manhattan();
            var data = {
                contigs: [],
                variations: [[0, 1, 842], [1, 16, 1711], [2, 44, 62]]
            };
            manhattan.setData(data);
            manhattan.maxscore.should.equal(1711);
            done();
        });
    });
    it("should set genomeLength when contigs are present", function (done) {
        runtest(function (Manhattan) {
            var manhattan = new Manhattan();
            var data = {
                contigs: [
                    { id: "1", len: 8711534432 },
                    { id: "2", len: 3247234111 }
                ],
                variations: []
            };
            try {
                manhattan.setRanges();
                should.fail("with a thrown error");
            } catch (err) {}
            manhattan.setData(data);
            manhattan.setRanges();
            manhattan.genomeLength.should.equal(11958768543);
            done();
        });
    });
});
