var requirejs = require('../client-require')();

function wrapRequire(callback) {
    requirejs(['util/progress'], callback);
}

describe('Iris.Util.Progress', function () {
    it("should be a function", function (done) {
        wrapRequire(function (Progress) {
            Progress.should.be.a.Function;
            done();
        });
    });
    it("should allow an empty constructor", function (done) {
        wrapRequire(function (Progress) {
            var progress = new Progress();
            progress.should.be.instanceof(Progress);
            progress.show.should.be.a.function;
            progress.dismiss.should.be.a.function;
            progress.progress.should.be.a.function;
            done();
        });
    });
});
