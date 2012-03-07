var NODE_HOME = __dirname + '/..';

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require(NODE_HOME + '/routes');
var gzip = require('connect-gzip');
var app = express.createServer(gzip.gzip());
var config = null;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});

var services = require(NODE_HOME + '/../conf/services.json');

exports.app    = app;
exports.routes = routes;
exports.services = services;
exports.configureViews = function(app) {
    if (!app) {
        app = this.app;
    }
    app.configure(function() {
        app.set('views', NODE_HOME + '/views');
        app.set('view engine', 'jade');
        app.use(express.static(NODE_HOME + '/../root'));
    });
    app.set('view options', { pretty: true });        
};

exports.loadConfiguration = function() {
    var path = require('path');
    var confFile = path.normalize(process.argv[2]);
    if (!confFile.match(/^\//)) {
        confFile = path.join(global.process.env.PWD, confFile);
    }
    if (confFile == null) {
        console.log("Configuration file required!");
        console.log("Usage: node " + process.argv[1] + " <config_file.js>");
        return;
    }
    config = require(confFile).Config;
    if (global.process.env.NODE_PORT != null) {
        config.appPort = global.process.env.NODE_PORT;
    }
    return config;
};

exports.startService = function() {
    app.listen(config.appPort);
    console.log("service-address http://localhost:%d", app.address().port)
    console.log("service-mode %s", app.settings.env);
}