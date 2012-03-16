var IRIS_HOME   = __dirname + '/../..';
var SERVICE_DIR = IRIS_HOME + '/nodejs/services';
var iris = require(SERVICE_DIR + '/service-base.js');
iris.loadConfiguration(IRIS_HOME + '/conf/examples-config.js');

exports.testSetServiceName = function (test) {
    iris.serviceName('thingamajigee');
    test.equals('thingamajigee', iris.serviceName(), "Couldn't set serviceName");
    test.done();
}

exports.testFindService = function (test) {
    iris.serviceName('examples');
    var service = iris.findService({ path: "/gwas", type: "fastbit" });
    test.equals("examples-fastbit", service, "Expected to locate 'examples-fastbit', instead got " + service);
    test.done();
}