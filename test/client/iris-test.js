var target  = __dirname + '/../../root/js/iris.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var jQueryStub = require(__dirname + '/stubs.js').jQueryStub;
var Iris = null;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: documentStub,
            jQuery: jQueryStub
        });
        Iris = context.Iris;
        documentStub.Stub.clearDocument();
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    createWidget: function (test) {
        var widget = Iris.Widget.create();
        test.done();
    }
};