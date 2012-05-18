var JS_DIR  = __dirname + '/../../root/js';
var target  = JS_DIR + '/widgets/widget.template.js';
var stubs   = require(__dirname + '/stubs.js');
var jsdom   = require('jsdom').jsdom;
var Iris;
var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require
});

module.exports = {
    setUp: function (callback) {
        var utils = require('nodeunit').utils;
        var doc =  jsdom("<html><body></body></html>");
        requirejs([ "jQuery", JS_DIR + "/iris" ]);
        var context = utils.sandbox(target, {
            console: console,
            Iris: Iris
        });
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    createWidget: function (test) {
        var widget = Iris.Widget.template.create({});
        test.ok(typeof widget.display === 'function',
            "Should be able to call display()");
        test.equal("Widget Title", widget.about.title);
        test.done();
    },
};