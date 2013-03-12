var path = require('path');

var IRIS_HOME            = path.join(__dirname, '/..');
var DEFAULT_SERVICE_CONF = path.join(IRIS_HOME, 'conf', 'services.json');
var DOCSROOT             = path.join(IRIS_HOME, 'public');

var confFile;
var service = null;
var configuration;
var liveServer = null;
var logFile = null;
var silent = 'production' == process.env.NODE_ENV;

// Module dependencies
var express = require('express')
  , routes  = require(path.join(IRIS_HOME, 'routes'))
  , gzip    = require('connect-gzip')
  , app     = express(gzip.gzip())
  , http    = require('http')
  , util    = require('util')
  , fs      = require('fs');

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

function uri() {
    return 'http://' +
        service.hostname + ':' + liveServer.address().port;
}
    
function setEndpoints() {
    endpoints = serviceConfig.endpoints[service.name];
    if (endpoints != null) {
        var services = serviceConfig.services;
        for (var i = 0; i < services.length; i++) {
            var svc = serviceConfig.services[i];
            if (endpoints[svc.name] != null) {
                var endpoint = endpoints[svc.name];
                endpoint.port     = svc.port;
                endpoint.hostname = svc.hostname
                    ? svc.hostname
                    : configuration.settings.hostname;
            }
        }
    }
}
    
function usage(msg) {
    console.log(msg);
    console.log(process.argv);
    console.log("Usage: node " +
        process.argv[1] + " <config_file.js> <service-name>");
    process.exit(1);
}

// Process command-line arguments
(function () {
    confFile = absolutePath(process.argv[2]);
    var serviceName = process.argv[3];
    if (process.argv[4]) {
        logFile = fs.createWriteStream(process.argv[4]);
    } else {
        logFile = process.stdout;
    }
    if (confFile == null) {
        usage("Configuration file required!");
    }
    if (serviceName == null) {
        usage("Service name is required!");
    }

    configuration = require(confFile).Config;

    serviceConfig =
        envRequire(process.env.IRIS_SERVICE_CONF, DEFAULT_SERVICE_CONF);

    if (global.process.env.NODE_PORT != null) {
        configuration.appPort = global.process.env.NODE_PORT;
    }
    configuration.settings = serviceConfig.settings;
    if (!configuration.settings) {
        configuration.settings = {};
    }
    if (!configuration.settings.hostname) {
        configuration.settings.hostname = '0.0.0.0';
    }
    var i = 0;
    var services = serviceConfig.services;
    while (i < services.length && service == null) {
        if (services[i].name == serviceName) {
            service = services[i];
        }
        i++;
    }
    if (service == null) {
        usage("Service name " + serviceName + " is not configured.");
    }
    if (service.hostname == null) {
        service.hostname = configuration.settings.hostname;
    }

    setEndpoints();
})();

/******************* CONFIGURATION *******************/

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(allowCrossDomain);
app.use(app.router);
app.use(express.logger({
    stream: logFile,
    format: ':method :url - :referrer (:req[content-type] -> :res[content-type])'
}));

// CORS middleware
function allowCrossDomain(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods',
         'GET,PUT,POST,DELETE,OPTIONS,HEAD');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.send(500, {
            error: 'Something blew up!'
        });
    } else {
        next(err);
    }
}

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

app.configure('development', function (){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function () {
    app.disable('verbose errors');
    app.use(express.errorHandler()); 
});

// Public fields
exports.IRIS_HOME   = IRIS_HOME;
exports.app         = app;
// chromosome lengths for each species
exports.chromosomes = {
    at: {
        1: 30427671,
        2: 19698289,
        3: 23459830,
        4: 18585056,
        5: 26975502
    }
};
exports.routes      = routes;
exports.endpoints   = endpoints;
exports.config      = configuration;

// Public functions
exports.configureViews = function () {
    app.configure(function () {
        app.set('views', path.join(IRIS_HOME, 'views'));
        app.set('view engine', 'jade');
        app.set('view options');
        app.use(express.favicon(path.join(DOCSROOT, 'favicon.ico')));
	    app.use(express.static(DOCSROOT));
        app.engine('html', require('ejs').renderFile);
    });
};

function setErrorRoutes() {
    
    // Based on http://goo.gl/qq09o            
    app.use(app.router);

    app.use(function(req, res, next) {
        res.status(404);

        // respond with html page
        if (req.accepts('html')) {
            res.render('404', { url: req.url });
            return;
        }

        // respond with json
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }

        // default to plain-text. send()
        res.type('txt').send('Not found');
    });

    // app.use(function(err, req, res, next) {
    //     // we may use properties of the error object
    //     // here and next(err) appropriately, or if
    //     // we possibly recovered from the error, simply next().
    //     res.status(err.status || 500);
    //     res.render('500', { error: err });
    // });

    // Routes
    app.get('/404', function (req, res, next) {
        // trigger a 404 since no other middleware
        // will match /404 after this one, and we're not
        // responding here
        next();
    });

    app.get('/403', function(req, res, next) {
        // trigger a 403 error
        var err = new Error('not allowed!');
        err.status = 403;
        next(err);
    });

    app.get('/500', function(req, res, next) {
        // trigger a generic (500) error
        next(new Error('keyboard cat!'));
    });
}

// Finds a configured service endpoint based on a set of criteria
exports.findService = function (args) {
    var comparators = [];
    if (args["type"]) {
        comparators.push(["type", function (type) {
            return args["type"] === type
        }]);
    }
    if (args["path"]) {
        comparators.push(["paths", function (paths) {
            for (path in paths) {
                if (paths[path] === args["path"]) return true;
            }
            return false;
        }]);
    }
    for (var serviceName in endpoints) {
        endpoint = endpoints[serviceName];
        var found = true;
        for (var i in comparators) {
            var comparator = comparators[i];
            var key = comparator[0];
            var func = comparator[1];
            found = func(endpoint[key]) && found;
        }
        if (found) {
            return serviceName;
        }
    }
    return null;
};

exports.startService = function () {
    // Needs to be called after service-specific routes:
    setErrorRoutes();
    
    if (!process.env.NODE_TEST_MODE) {
        liveServer = app.listen(configuration.appPort);
        exports.log("service-address %s\n", uri());
        exports.log("service-mode %s\n", app.settings.env);
    }
};

exports.httpGET = function (response, serviceName, path) {
    exports.log(serviceName, endpoints[serviceName].port, path);
    http.get({
        port: endpoints[serviceName].port,
        path: path
    }, function (proxyResponse) {
        proxyResponse.pipe(response);
    });
};
    
exports.serviceName = function () {
    return service.name;
};

exports.log = function (format) {
    logFile.write(util.format(format, Array.prototype.slice.call(arguments, 1)));
};
    
exports.uri = uri;


/* SERVICE API
 *
 * Every service provides this REST API for service discovery
 */
app.get('/service', function (req, res) {
	res.json({
        name: service.name,
        dataServiceURI: uri(),
	    next: { "list" : "/service/list" },
	});
});

app.get('/service/list', function (req, res) {
    var services = [{
        name: service.name,
        uri: uri()
    }];
    for (var serviceName in endpoints) {
        var endpoint = endpoints[serviceName];
        var paths = endpoint.paths;
        for (var i = 0; i < paths.length; i++) {
            var svc = {
                name: serviceName,
                path: paths[i],
                uri: 'http://' + endpoint.hostname + ':' + endpoint.port
            };
            services.push(svc);            
        }
    }
    res.json(services);
});
