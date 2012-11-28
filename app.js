/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    path    = require('path'),
    fs      = require('fs');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(app.router);
    app.use(require('less-middleware')({
        src: __dirname + '/public'
    }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/data/network/:network', function (request, response, next) {
    response.contentType = 'json';
    var parser = require('./src/parsers/pajek');
    var datadir = path.join(__dirname, 'test', 'fixtures');
    var filename = path.join(datadir, request.params.network) + ".pajek";
    fs.exists(filename, function (exists) {
        if (exists) {
            parser.parse(filename, function (network) {
                response.send(network.json());
            })
        } else {
            response.send(404, { error: "Network " + request.params.pajek + " not found" });
        }
    })
});

http.createServer(app)
    .listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
