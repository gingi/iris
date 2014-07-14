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
    describe("#setData", function () {
        it("should support an empty array", function (done) {
            runtest(function (Table) {
                var table = new Table();
                table.setData([]);
                table.getData().should.eql({ data: [], columns: [] });
                done();
            });            
        });
        it("should support a plain array", function (done) {
            runtest(function (Table) {
                var table = new Table();
                table.setData([["A", "B"], [1, 2]]);
                table.getData().should.eql({
                    columns: ["A", "B"],
                    data:    [ [1, 2] ]
                });
                done();
            });
        });
        it("should support an object with columns and data", function (done) {
            done();
        });
    })
});
