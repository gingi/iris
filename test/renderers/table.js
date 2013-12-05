var requirejs = require('../client-require')();

function runtest(fn) {
    requirejs(['renderers/table'], function (Table) {
        fn(Table);
    });
}

describe('Table', function () {
    it("should be a function", function (done) {
        runtest(function (Table) {
            Table.should.be.a.Function;
            done();
        });
    });
    it("should set and get data", function (done) {
        runtest(function (Table) {
            var table = new Table();
            table.setData([]);
            table.getData().should.eql([]);
            done();
        })
    });
    it("should render a table", function (done) {
        runtest(function (Table) {
            var table = new Table();
            table.setData({
                columns: ["A", "B", "C"],
                data: [[1, 2, 3], [2, 4, 6], [3, 6, 9]]
            });
            table.render();
            done();
        });
    })
});
