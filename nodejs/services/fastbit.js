var iris   = require('./iris-base.js');
var config = iris.loadConfiguration();
var app    = iris.app;
var routes = iris.routes;
var exec   = require('child_process').exec;

function run_command(executable, response, args) {
    var cmd = config.BIN_DIR + '/' + executable
        + ' -d ' + config.FASTBIT_DATA_DIR
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
    run_command('fbsql', res, req.params.q);
});

app.get('/scatter', function(req, res) {
    run_command('scatter', res, req.params.q);
});

app.get('/ranges', function(req, res) {
    run_command('ranges', res, req.params.q);
});

iris.startService();