var express  = require('express'),
    routes   = require('./routes'),
    http     = require('http'),
    path     = require('path'),
    fs       = require('fs'),
    util     = require('util'),
    cache    = require('web-cache');

var app = express();

var packageJson = require(path.join(__dirname, "package.json"));
var irisVersion = packageJson.version;
    
var ONE_YEAR = 31557600000;
var ONE_DAY  = 86400;

var RANDOM_NEIGHBORHOOD_NODES = 20;
var MAX_ITEMS = 300;

var defaultEnv = process.env.NODE_ENV || "development";
var optimist = require('optimist')
    .usage("Run the datavis app\nUsage: $0 [options]")
    .boolean(["cache"])
    .default("port",  4747)
    .default("env",   defaultEnv)
    .describe("cache", "Turn on caching")
    .describe("env",   "The run environment {development,production}")
    .describe("port",  "The network port")
    .check(function (opts) {
        if (opts.env && !validEnvironment(opts.env))
            throw new Error("Invalid environment (--env): " + opts.env);
        return true;
    });
var argv = optimist.argv;

function validEnvironment(val) {
    var Environments = "production development".split(" ");
    for (var i in Environments)
        if (Environments[i] == val) return true;
    return false;
}

if (argv.help) {
    console.log(optimist.help());
    process.exit(0);
}

var PUBLIC_DIR = path.join(__dirname, 
    argv.env == 'production' ? 'build' : 'public'
);
fs.exists("logs", function (exists) {
    if (!exists) fs.mkdir("logs");
});
fs.exists(PUBLIC_DIR, function (exists) {
    if (!exists) {
        console.error(
            "Public directory '%s' does not exist!\n" +
            "Make sure you ran 'make build'", PUBLIC_DIR);
        process.exit(1);
    }
});
app.configure(function() {
    app.set('port', argv.port);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.static(PUBLIC_DIR));
    if (argv.env === 'production') {
        var stream = fs.createWriteStream('logs/access.log', {flags: 'a'});
        app.use(express.logger({ stream: stream }));
    } else {
        app.use(express.logger('dev'));
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(express.errorHandler());
    }
    app.use(express.compress());
    if (argv.cache) {
        console.log("Using web cache.");
        app.use(cache.middleware({
            path: '/',
            expire: ONE_DAY
        }));
    }
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require("less-middleware")({
        src:  PUBLIC_DIR + "/less",
        dest: PUBLIC_DIR + "/css",
        prefix: "/css",
        compress: true,
        optimization: 2
    }));
});

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

app.get('/', function (req, res) {
    routes.index(req, res, { version: irisVersion });
});
