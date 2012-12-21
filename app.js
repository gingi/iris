/**
 * Module dependencies.
 */

var express = require('express'),
    routes  = require('./routes'),
    user    = require('./routes/user'),
    http    = require('http'),
    path    = require('path'),
    fs      = require('fs'),
    util    = require('util');
    gzippo  = require('gzippo');

var NETWORK_API_URL = 'http://140.221.92.181:7064/KBaseNetworksRPC/networks';
var G2P_API_URL     = 'http://140.221.84.160:7068';
var CDM_API_URL     = 'http://140.221.84.160:7032';

var ONE_YEAR = 31557600000;

var RANDOM_NEIGHBORHOOD_NODES = 20;

var NetworksAPI = require('./src/api/networks');
var G2PAPI      = require('./src/api/g2p');
var CDMI        = require('./src/api/cdmi');

var app = express();

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(gzippo.compress());
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
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/network', function (req, res, next) {
    res.sendfile('public/network.html');
});

app.get('/g2p', function (req, res, next) {
    res.sendfile('public/g2p.html');
});

app.get('/charts', routes.charts);

function rpcErrorHandler(response) {
    return function (err) {
        console.log("Service Error", err);
        response.send(503, {
            error: "Unexpected RPC service error",
            rpc: err
        })
    };
}

app.get('/data/trait/:id', function (request, response, next) {
    response.contentType = 'json';
    var pcutoff = request.query.p || 1.0;
    var api = G2PAPI(G2P_API_URL);
    var cdmi = new CDMI.CDMI_API(CDM_API_URL);
    api.traits_to_variations_async(request.params.id, pcutoff, function (json) {
        var chrs = [];
        var chrIndex = {};
        var maxscore = 0;
        var v = [];
        json.forEach(function (d) {
            var normalized = -Math.log(parseFloat(d[2]));
            maxscore = Math.max(maxscore, normalized);
            if (chrIndex[d[0]] == null) {
                chrs.push(d[0]);
                chrIndex[d[0]] = chrs.length - 1;
            }
            v.push([chrIndex[d[0]], parseInt(d[1]), normalized]);
        });
        cdmi.contigs_to_lengths_async(chrs, function (lengths) {
            for (var c in lengths) {
                chrs[chrIndex[c]] = [c, parseInt(lengths[c])];
            }
            response.send({
                id: request.params.id,
                maxscore: maxscore,
                variations: v,
                chromosomes: chrs
            });
        }, rpcErrorHandler(response))
    }, rpcErrorHandler(response));
});

app.get('/data/trait/:id/genes', function (request, response, next) {
    response.contentType = 'json';
    var FLANKING_DISTANCE = 10e5;
    var api = G2PAPI(G2P_API_URL);
    api.selected_locations_to_genes_async(
        request.params.id,
        request.query.pmin,
        request.query.pmax,
        request.query.locations,
        FLANKING_DISTANCE,
        function (json) {
            response.send(json);
        },
        rpcErrorHandler(response)
    )
});

app.get('/data/genome/:id/chromosomes', function (request, response, next) {
    response.contentType = 'json';
    var eapi = new CDMI.CDMI_EntityAPI(CDM_API_URL);
    var cdmi = new CDMI.CDMI_API(CDM_API_URL);
    eapi.get_relationship_IsComposedOf_async(
        [request.params.id], ['id'], [], ['id'], function (data) {
        var ids = [];
        data.forEach(function (c) { ids.push(c[2].id); });
        cdmi.contigs_to_lengths_async(ids, function (lengths) {
            response.send(lengths);
        }, rpcErrorHandler(response));
    }, rpcErrorHandler(response));
});

app.get('/data/genome', function (request, response, next) {
    response.contentType = 'json';
    var eapi = new CDMI.CDMI_EntityAPI(CDM_API_URL);
    eapi.all_entities_Genome_async(0, 100, ['id', 'scientific_name'], function (json) {
        var genomes = [];
        for (var id in json) {
            var genome = json[id];
            genomes.push([ genome.id, genome.scientific_name ]);
        }
        response.send(genomes);
    }, rpcErrorHandler(response));
})

app.get('/data/genome/:id/experiments', function (request, response, next) {
    response.contentType = 'json';
    var api = new G2PAPI(G2P_API_URL);
    api.get_experiments_async(request.params.id, function (json) {
        response.send(json);
    }, rpcErrorHandler(response));
});

app.get('/data/experiment/:id/traits', function (request, response, next) {
    response.contentType = 'json';
    var api = new G2PAPI(G2P_API_URL);
    api.get_traits_async(request.params.id, function (json) {
        json.forEach(function (trait) {
            trait[1] = trait[1].replace(/:.*$/, '');
        });
        response.send(json);
    }, rpcErrorHandler(response));
})

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

app.get('/data/gene/:id/network', function (request, response, next) {
    response.contentType = 'json';
    var nodeId = request.params.id == 'sample'
        ? 'kb|g.21765.CDS.543' : request.params.id;
    var api = NetworksAPI(NETWORK_API_URL);
    api.buildFirstNeighborNetwork_async(
        [ "kb|netdataset.regprecise.301",
          "kb|netdataset.modelseed.0",
          "kb|netdataset.ppi.7" ],
        nodeId,
        ['GENE_CLUSTER'],
        function (data) {
            response.send(transformNetwork(data));
        },
        function (err) {
        console.log("Service Error", err);
        response.send(503, {
            error: "Unexpected RPC service error",
            rpc: err
        })
    }
    );
});

Object.clone = function(obj) {
    return Object.create(
        Object.getPrototypeOf(obj), 
        Object.getOwnPropertyNames(obj).reduce(function(memo, name) {
            return (memo[name] = Object.getOwnPropertyDescriptor(obj, name)) && memo;
        }, {})
    );
}
function transformNetwork(networkJson) {
    var json = { nodes: [], edges: [] };
    var nodeMap = {};
    for (var i in networkJson.nodes) {
        var node = Object.clone(networkJson.nodes[i]);
        nodeMap[node.id] = i;
        node.kbid = node.id;
        node.group = node.type;
        node.id = i;
        json.nodes.push(node);
    }
    for (var i in networkJson.edges) {
        var edge = Object.clone(networkJson.edges[i]);
        edge.source = parseInt(nodeMap[edge.nodeId1]);
        edge.target = parseInt(nodeMap[edge.nodeId2]);
        edge.weight = 1;
        json.edges.push(edge);
    }
    return json;
}

app.get('/data/network/:network', function (request, response, next) {
    response.contentType = 'json';
    var fetcher, filename;
    if (request.params.network == 'kbase') {
        filename = path.join(__dirname, 'data', 'regulome') + '.json';
        fetcher = function () {
            var json = require(filename);
            response.send(transformNetwork(json));
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