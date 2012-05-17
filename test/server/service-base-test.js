var IRIS_HOME   = __dirname + '/../..';
var SERVICE_DIR = IRIS_HOME + '/nodejs/services';
var target = SERVICE_DIR + '/service-base.js';
process.env.IRIS_SERVICE_CONF = __dirname + '/../fixtures/services-test.json';
process.argv = [
    'node',
    target,
    IRIS_HOME + '/conf/examples-config.js',
    'examples'
];
var iris = require(target);

exports.testFindService = function (test) {
    var service = iris.findService({ path: "/gwas", type: "fastbit" });
    test.equals("examples-fastbit", service, "Expected to locate 'examples-fastbit', instead got " + service);
    test.done();
}