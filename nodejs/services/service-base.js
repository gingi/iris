(function () {

    var NODE_HOME = __dirname + '/..';
    var DEFAULT_SERVICE_CONF = NODE_HOME + '/../conf/services.json';
    var IRIS_HOME = NODE_HOME + '/..';
    var confFile;
    var service = null;
    var configuration;
	var liveServer = null;

    // Module dependencies
    var express = require('express')
      , routes = require(NODE_HOME + '/routes')
      , gzip = require('connect-gzip')
      , app = express(gzip.gzip())
      , http = require('http')
      , util = require('util')
	  , path = require('path');

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

    // CORS middleware
    function allowCrossDomain(req, res, next) {
    	res.header('Access-Control-Allow-Origin', '*');
    	res.header('Access-Control-Allow-Credentials', true);
    	res.header('Access-Control-Allow-Methods',
             'GET,PUT,POST,DELETE,OPTIONS,HEAD');
    	res.header('Access-Control-Allow-Headers', 'Content-Type');
    	next();
    };

    app.configure(function () {
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(allowCrossDomain);
        app.use(app.router);
    });

    app.configure('development', function (){
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    app.configure('production', function () {
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
    exports.configureViews = function (app) {
        if (!app) {
            app = app;
        }
        app.configure(function () {
            app.set('views', NODE_HOME + '/views');
            app.set('view engine', 'jade');
		    app.use(express.favicon());
		    app.use(express.logger());
		    app.use(express.bodyParser());
		    app.use(express.methodOverride());
		    app.use(express.cookieParser('your secret here'));
		    app.use(express.session());
		    app.use(app.router);
		    app.use(express.static(path.join(IRIS_HOME, 'root')));
            app.engine('html', require('ejs').renderFile);
        });
    };

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
        if (!process.env.NODE_TEST_MODE) {
            liveServer = app.listen(configuration.appPort);
            console.log("service-address %s", uri());
            console.log("service-mode %s", app.settings.env);
        }
    };

    exports.httpGET = function (response, serviceName, path) {
        console.log(serviceName, endpoints[serviceName].port, path);
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
})();
