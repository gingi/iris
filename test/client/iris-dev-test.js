/*
 * General test to ensure that the core modules act cohesively.
 */
var target  = __dirname + '/../../root/js/iris-dev.js';
var jsdom = require('jsdom');
var Iris = null;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        var context = sandbox(target, {
            console: console,
            document: jsdom,
            window: jsdom.createWindow(),
            require: require('requirejs'),
        });
        Iris = context.Iris;
        callback();
    },

    tearDown: function (callback) {
        callback();
    },

    something: function (test) {
        test.done();
    },
};
