var requirejs = require('./clientshim')();

requirejs(['iris/root'], function (Root) {
    console.log("Described");
    console.log("Requirejs", requirejs)
        console.log("Got Root", Root);
        describe('Iris.Root', function () {
        it("should be a function", function () {
            Root.should.be.a("string");
        })
    })
}, function (err) { console.log("oops", arguments)})
