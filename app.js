/**
 * Module dependencies.
 */

var express  = require('express'),
    routes   = require('./routes'),
    user     = require('./routes/user'),
    http     = require('http'),
    path     = require('path'),
    fs       = require('fs'),
    util     = require('util'),
    gzippo   = require('gzippo'),
    argv     = require('optimist').argv;

var kbase = require('./src/api/kbase');

var NETWORK_API_URL = 'http://140.221.92.181:7064/KBaseNetworksRPC/networks';
var G2P_API_URL     = 'http://140.221.84.160:7068';
var CDM_API_URL     = 'http://140.221.84.160:7032';

var ONE_YEAR = 31557600000;

var RANDOM_NEIGHBORHOOD_NODES = 20;

var NetworksAPI = require('./src/api/networks');
var G2PAPI      = require('./src/api/g2p');
var CDMI        = require('./src/api/cdmi');

var app = express();

if (argv.fake) {
    console.log("Starting in fake API mode");
}

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
app.get('/heatmap', routes.heatmap);
app.get('/heatmap-chunking', routes.heatmapChunked);

function rpcErrorHandler(response) {
    return function (err) {
        console.log("Service Error", err);
        response.send(503, {
            error: "Unexpected RPC service error"
        })
    };
}

app.get('/data/trait/:id', function (request, response, next) {
    response.contentType = 'json';
    var pcutoff = request.query.p || 1.0;

    /*
    var api = G2PAPI(G2P_API_URL);
    var cdmi = new CDMI.CDMI_API(CDM_API_URL);
    var variationFetcher = api.traits_to_variations_async;
    var chromosomeFetcher = cdmi.contigs_to_lengths_async;
    */
    if (argv.fake || request.params.id == 'fake') {
        variationFetcher = function (arg1, arg2, callback) {
            var json = require('./data/fake/trait-variations.json');
            callback(json);
        };
        chromosomeFetcher = function (arg1, callback) {
            var json = require('./data/fake/chromosome-lengths.json');
            callback(json);
        };
    }
    /*
    variationFetcher(request.params.id, pcutoff, function (json) {
        var chrs = [];
        var chrInfo = {};
        var chrIndex = {};
        var maxscore = 0;
        var v = [];
        var meta = json[0];
        var trait = {
            id: meta[0][0],
            name: meta[0][4]
        };
        json[1].forEach(function (d) {
            var normalized = -Math.log(parseFloat(d[2]));
            maxscore = Math.max(maxscore, normalized);
            if (chrIndex[d[0]] == null) {
                chrs.push(d[0]);
                chrIndex[d[0]] = { idx: chrs.length - 1, name: d[3] };
            }
            v.push([chrIndex[d[0]].idx, parseInt(d[1]), normalized]);
        });
        if (json.length == 0) {
            response.send(404, {
                error: "No variations for trait " + request.params.id,
            });
            return;
        }
        chromosomeFetcher(chrs, function (lengths) {
            for (var c in lengths) {
                chrs[chrIndex[c].idx] = {
                    id: c,
                    name: chrIndex[c].name,
                    len: parseInt(lengths[c])
                };
            }
            response.send({
                trait: trait,
                maxscore: maxscore,
                variations: v,
                chromosomes: chrs
            });
        }, rpcErrorHandler(response))
    }, rpcErrorHandler(response));
    */
    kbase.getVariations({
        traitId: request.params.id,
        pcutoff: request.params.pcutoff,
        response: response
    });
});

app.get('/data/trait/:id/genes', function (request, response, next) {
    response.contentType = 'json';
    if (argv.fake || request.params.id == 'fake') {
        var locus = 1;
        var genes = [];
        request.query.locations.forEach(function () {
            for (var i = 0; i < 10; i++) {
                genes.push("kb|g.fake.locus." + locus++);
            }
        });
        response.send(genes);
        return;
    }
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
    if (argv.fake) {
        response.send(require('./data/fake/genomes.json'));
        return;
    }
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
        rpcErrorHandler(response)
    );
});

app.get('/data/coexpression', function (request, response, next) {
    response.contentType = 'json';
    var genes = request.query.genes;
    if (!genes || genes.length == 0) {
        response.send([]);
        return;
    }
    var matrix = [];
    for (var i = 0; i < genes.length; i++) {
        for (var j = 0; j < genes.length; j++) {
            if (i != j) {
                matrix.push([i, j, Math.random()]);
            }
        }
    }
    response.send(matrix);
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

app.get('/data/expression', function (request, response, next) {
    var DELIM = "\r\n\r\n";
    response.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
    });
    var NUM_ROWS = 80;
    var NUM_COLS = 80;
    var FAKE_DELAY = 1;
    var matrix = [];
    response.write(JSON.stringify({
        meta: {
            rows: NUM_ROWS,
            cols: NUM_COLS
        }
    }) + DELIM);
    for (var i = 0; i < NUM_ROWS; i++) {
        for (var j = 0; j < NUM_COLS; j++) {
            matrix.push({ i: i, j: j, value: Math.random().toFixed(5) });
        }
    }
    shuffle(matrix, NUM_ROWS * NUM_COLS);
    for (var i = 0; i < matrix.length; i++) {
        var start = (new Date).getTime(), delay;
        do {
            delay = (new Date).getTime();
        } while (delay < start + FAKE_DELAY);
        response.write(JSON.stringify(matrix[i]) + DELIM);
    }
    response.end();
});

function shuffle(arr) {
    for (var i = arr.length - 1; i >= 0; i--) {
        var t = Math.floor(Math.random() * i);
        var tmp = arr[i]; arr[i] = arr[t]; arr[t] = tmp;
    }
}

app.get('/streaming', function (request, response, next) {
    response.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
    });
    var counter = 0;
    setInterval(function () {
        if (++counter < 500) {
            if (counter % 20 === 0) console.log("Writing %d", counter);
            response.write(JSON.stringify({ count: counter }));
            response.write("\n");
        } else {
            response.end();
            clearTimeout(this);
        }
    }, 500);
});
