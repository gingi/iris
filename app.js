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
    var fetcher, filename;
    if (request.params.network == 'regulome') {
        filename = path.join(__dirname, 'data', request.params.network) + '.json';
        fetcher = function () {
            var json = require(filename);
            var nodeMap = {};
            for (var i in json.nodes) {
                nodeMap[json.nodes[i].id] = i;
            }
            for (var i in json.edges) {
                json.edges[i].source = parseInt(nodeMap[json.edges[i].nodeId1]);
                json.edges[i].target = parseInt(nodeMap[json.edges[i].nodeId2]);
                json.edges[i].weight = 1;
            }
            response.send(json);
        };
    } else {
        var parser = require('./src/parsers/pajek');
        filename = path.join(__dirname, 'test', 'fixtures', request.params.network) + ".pajek";
        fetcher = function () {
            parser.parse(filename, function (network) {
                var json = network.json();
                var nodeMap = {};
                for (var i in json.nodes) {
                    nodeMap[json.nodes[i].id] = i;
                }
                for (var i in json.edges) {
                    json.edges[i].source = parseInt(nodeMap[json.edges[i].source]);
                    json.edges[i].target = parseInt(nodeMap[json.edges[i].target]);
                }
                response.send(json);
            });
        }
    }
    fs.exists(filename, function (exists) {
        if (exists) {
            fetcher();
        } else {
            response.send(404, { error: "Network " + request.params.network + " not found" });
        }
    })
});

http.createServer(app)
    .listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
