var IRIS_HOME   = __dirname + '/../..';
var SERVICE_DIR = IRIS_HOME + '/nodejs/services';
var target = SERVICE_DIR + '/proxy.js';
process.argv = [
    'node',
    target,
    IRIS_HOME + '/conf/examples-config.js',
    'examples'
];
var proxy = require(target);

exports.testIllegalURLs = function (test) {
    test.done();
}
