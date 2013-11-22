var requirejs = require('../client-require')();

function runtest(fn) {
    requirejs(['charts/bar'], function (Manhattan) {
        fn(Manhattan);
    });
}

describe('BarChart', function () {
    it("should be a function", function (done) {
        runtest(function (BarChart) {
            BarChart.should.be.a.Function;
            done();
        });
    });
    it("should set and get data", function (done) {
        runtest(function (BarChart) {
            var chart = new BarChart();
            var data = [];
            chart.setData(data);
            chart.getData().should.eql(data);
            done();
        })
    });
});
