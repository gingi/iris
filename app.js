/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    path    = require('path'),
    fs      = require('fs');

var NETWORK_API = 'http://140.221.92.222:7064/KBaseNetworksRPC/networks';
var RANDOM_NEIGHBORHOOD_NODES = 20;

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

app.get('/network', function (req, res, next) {
    res.sendfile('public/network.html');
});

app.get('/data/network/random', function (request, response, next) {
    response.contentType = 'json';
    var nNodes = request.query.nodes || 20;
    var nEdges = request.query.edges || 50;
    var nClusters = request.query.clusters || 3;
    var network = randomNetwork(nNodes, nEdges, nClusters);
    response.send(network);
});

app.get('/data/gene/:id/neighbors', function (request, response, next) {
    response.contentType = 'json';
    var rootId = RANDOM_NEIGHBORHOOD_NODES + 1;
    var neighborhood = randomNetwork(
        RANDOM_NEIGHBORHOOD_NODES,
        RANDOM_NEIGHBORHOOD_NODES + 5,
        1
    );
    neighborhood.nodes.push({id: rootId, name: request.params.id});
    for (var i in neighborhood.nodes) {
        neighborhood.edges.push({
            source: rootId,
            target: neighborhood.nodes[i].id,
            weight: Math.random()
        })
    }
    response.send(neighborhood);
});

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

function randomNetwork(nNodes, nEdges, nClusters) {
    var nodes = [], edges = [];
    var nodeIndex = 0;
    var clusterMasters = [];
    for (var c = 0; c < nClusters; c++) {
        var groupName = "group" + Math.ceil(Math.random() * 30);
        for (var i = 0; i < nNodes; i++) {
            nodes.push({
                id: nodeIndex, name: 'Node' + (Math.ceil(Math.random() * 1000) + 1),
                group: groupName
            });
            nodeIndex++;
        }
        clusterMasters[c]
            = Math.floor(Math.random() * nNodes) + c * nNodes;
        var seen = {};
        for (var i = 0; i < nEdges; i++) {
            var s, t;
            while (true) {
                s = Math.floor(Math.random() * nNodes);
                t = Math.floor(Math.random() * nNodes);
                if (s == t) continue;
                var key = s * nNodes + t;
                if (seen[key] != 1) {
                    seen[key] = 1;
                    break;
                }
            }
            edges.push({
                source: c * nNodes + s,
                target: c * nNodes + t,
                weight: Math.random()
            });
        }
    }
    for (var i = 0; i < clusterMasters.length; i++) {
        for (var j = i + 1; j < clusterMasters.length; j++) {
            edges.push({
                source: clusterMasters[i],
                target: clusterMasters[j],
                weight: Math.random()
            });
        }
    }
    return { edges: edges, nodes: nodes };
}