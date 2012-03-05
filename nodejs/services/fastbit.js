/**
 * Module dependencies.
 */

var express = require('express'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    app = module.exports = express.createServer();
    
var confFile = process.argv[2];
if (confFile == null) {
    console.log("Configuration file required!");
    console.log("Usage: node " + process.argv[1] + " <config_file.js>");
    return;
}
var config = require(confFile).Config;

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

// Configuration
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
});

app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});
app.configure('production', function() {
    app.use(express.errorHandler());
});

function run_command(executable, response, args) {
    var cmd = config.binDir + '/' + executable
        + ' -d ' + config.dataDir
        + ' ' + args; // FIXME: Major injection security risk    
    console.log(cmd);
    var scatter = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        response.writeHead(200, {
            'Content-Type': 'application/json'
        });
        response.end(stdout);
    });
}

app.get('/fbsql', function(req, res) {
    run_command('fbsql', res, req.params.args);
});

// Generic scatter
app.get('/scatter', function(req, res) {
    run_command('scatter', res, req.params.args);
});

// Ranges
app.get('/ranges', function(req, res) {
    run_command('ranges', res, req.params.args);
});

app.listen(config.appPort);
app.listen(config.appPort);
console.log("service-address http://localhost:%d", app.address().port)
console.log("service-mode %s", app.settings.env);
