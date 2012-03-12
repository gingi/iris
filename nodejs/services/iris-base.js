var IRIS = {};

IRIS.NODE_HOME = __dirname + '/..';
IRIS.DEFAULT_SERVICE_CONF = IRIS.NODE_HOME + '/../conf/services.json';

// Private utility functions
function absolutePath(filename) {
    var path = require('path');
    if (filename == null) {
        return null;
    }
    var normalized = path.normalize(filename);
    if (!normalized.match(/^\//)) {
        normalized = path.join(global.process.env.PWD, normalized);
    }
    return normalized;
}

function envRequire(envVar, defaultVar) {
    if (envVar) {
        return require(absolutePath(envVar));
    } else {
        return require(absolutePath(defaultVar));
    }
}

// Process command-line arguments
{
    if (process.argv[2]) {
        IRIS.confFile = absolutePath(process.argv[2]);
    }
    if (process.argv[3]) {
        IRIS.serviceName = process.argv[3];
    }
}

// Module dependencies
IRIS.express = require('express');
IRIS.routes = require(IRIS.NODE_HOME + '/routes');
IRIS.gzip = require('connect-gzip');
IRIS.app = IRIS.express.createServer(IRIS.gzip.gzip());
IRIS.config = null;
IRIS.serviceConfig = envRequire(process.env.IRIS_SERVICE_CONF, IRIS.DEFAULT_SERVICE_CONF);

// CORS middleware
var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

IRIS.app.configure(function () {
    IRIS.app.use(IRIS.express.bodyParser());
    IRIS.app.use(IRIS.express.methodOverride());
    IRIS.app.use(allowCrossDomain);
    IRIS.app.use(IRIS.app.router);
});

IRIS.app.configure('development', function (){
    IRIS.app.use(IRIS.express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

IRIS.app.configure('production', function (){
    IRIS.app.use(express.errorHandler()); 
});

// chromosome lengths for each species
IRIS.chromosomes = {
    at: '[[1,30427671],[2,19698289],[3,23459830],[4,18585056],[5,26975502]]'
};

// Public fields
exports.app         = IRIS.app;
exports.routes      = IRIS.routes;
exports.services    = IRIS.serviceConfig['services'];
exports.chromosomes = IRIS.chromosomes;

// Public functions
exports.serviceName = function (name) {
    if (name != null) {
        IRIS.serviceName = name;
    }
    return IRIS.serviceName;
}
exports.configureViews = function (app) {
    if (!app) {
        app = IRIS.app;
    }
    app.configure(function () {
        app.set('views', IRIS.NODE_HOME + '/views');
        app.set('view engine', 'jade');
        app.use(IRIS.express.static(IRIS.NODE_HOME + '/../root'));
    });
    app.set('view options', { pretty: true });        
};

exports.loadConfiguration = function (confFile) {
    if (confFile == null) {
        confFile = IRIS.confFile;
    }
    if (confFile == null) {
        console.log("Configuration file required!");
        console.log("Usage: node " + process.argv[1] + " <config_file.js> [<service-name>]");
        return;
    }
    IRIS.config = require(confFile).Config;
    if (global.process.env.NODE_PORT != null) {
        IRIS.config.appPort = global.process.env.NODE_PORT;
    }
    return IRIS.config;
};

// Finds a configured service endpoint based on a set of criteria
exports.findService = function (args) {
    // Configured endpoints available for the service
    var endpoints = IRIS.serviceConfig['endpoints'][IRIS.serviceName];
    var comparators = [];
    if (args["type"]) {
        comparators.push(["type", function (type) { return args["type"] === type }]);
    }
    if (args["path"]) {
        comparators.push(["paths", function (paths) {
            for (path in paths) {
                if (path === args["path"]) return true;
            }
            return false;
        }]);
    }
    for (service in endpoints) {
        endpoint = endpoints[service];
        var found = false;
        for (i in comparators) {
            var comparator = comparators[i];
            var key = comparator[0];
            var func = comparator[1];
            found = func(endpoint[key]) || found;
        }
        if (found) {
            return service;
        }
    }
    return null;
}

exports.startService = function () {
    IRIS.app.listen(IRIS.config.appPort);
    console.log("service-address http://localhost:%d", IRIS.app.address().port)
    console.log("service-mode %s", IRIS.app.settings.env);
}