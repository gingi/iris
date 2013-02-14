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
    gzippo   = require('gzippo');
    
var kbase = require('./src/api/kbase');

var ONE_YEAR = 31557600000;
var ONE_DAY  = 86400;

var RANDOM_NEIGHBORHOOD_NODES = 20;
var MAX_ITEMS = 300;

var defaultEnv = process.env.NODE_ENV || "development";
var optimist = require('optimist')
    .usage("Run the datavis app\nUsage: $0 [options]")
    .boolean(["fake", "debug", "cache"])
    .default("port",  3000)
    .default("env",   defaultEnv)
    .describe("fake",  "Serve only fake data, not from the API")
    .describe("cache", "Use a cache for API endpoints")
    .describe("debug", "Show debug statements")
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

var app = express();

if (argv.fake) {
    console.log("Starting in fake API mode");
}
if (argv.debug) {
    console.log("Debug mode");
    kbase.debug = true;
}
var cacheMode = argv.cache == true;

var PUBLIC_DIR = path.join(__dirname, 
    argv.env == 'production' ? 'build' : 'public'
);
kbase.env = argv.env;
fs.exists("logs", function (exists) {
    if (!exists) fs.mkdirSync("logs");
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
    if ('production' == argv.env) {
        var stream = fs.createWriteStream('logs/access.log', {flags: 'a'});
        app.use(express.logger({ stream: stream }));
    } else {
        app.use(express.logger('dev'));
        app.use(express.cookieParser('your secret here'));
        app.use(express.session());
        app.use(express.errorHandler());
    }
    app.use(gzippo.compress());
    if (cacheMode) {
        console.log("Using web cache.");
        var cache = require('web-cache');
        app.use(cache.middleware({
            path: '/data',
            exclude: [ /trait\/.*\/genes/ ],
            expire: ONE_DAY
        }));
    }
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('less-middleware')({
        src: PUBLIC_DIR
    }));
});

http.createServer(app)
    .listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});

app.get('/', routes.index);

app.get('/network',          routes.network);
app.get('/g2p',              routes.g2p);
app.get('/charts',           routes.charts);
app.get('/heatmap',          routes.heatmap);
app.get('/heatmap-chunking', routes.heatmapChunked);

app.get('/data/trait/:id', function (request, response, next) {
    var args = {
        traitId:  request.params.id,
        pcutoff:  request.query.p,
        response: response
    };
    if (argv.fake || request.params.id == 'fake') {
        args.variationFetcher = function (arg1, arg2, processJSON) {
            var json = require('./data/fake/trait-variations.json');
            processJSON(json);
        };
        args.contigFetcher = function (arg1, processJSON) {
            var json = require('./data/fake/chromosome-lengths.json');
            processJSON(json);
        };
    }
    kbase.getVariations(args);
});

app.get('/data/trait/:id/genes', function (request, response, next) {
    if (argv.fake || request.params.id == 'fake') {
        var locus = 1;
        var genes = [];
        request.query.locations.forEach(function () {
            for (var i = 0; i < 10; i++) {
                genes.push(["kb|g.fake.locus." + locus++,
                    "GeneName" + locus]);
            }
        });
        response.send(genes);
        return;
    }
    kbase.getTraitGenes({
        traitId:  request.params.id,
        pmin:     request.query.pmin,
        pmax:     request.query.pmax,
        loci:     request.query.locations,
        response: response,
        callback: function (data) {
            if (data.length > MAX_ITEMS) {
                data = data.slice(0, MAX_ITEMS);
                response.send(206, data);
            } else {
                response.send(200, data);
            }
        }
    });
});

app.get('/data/genome/:id/chromosomes', function (request, response, next) {
    kbase.getContigLengths({
       response: response,
       genomeId: request.params.id 
    });
});

app.get('/data/genome/:id', function (request, response, next) {
    kbase.getGenomeInfo({
        response: response,
        genomeId: request.params.id
    });
})

app.get('/data/genome', function (request, response, next) {
    if (argv.fake) {
        response.send(require('./data/fake/genomes.json'));
        return;
    }
    kbase.getGenomes({
        response: response,
        haveTrait: request.query.haveTrait
    });
})

app.get('/data/genome/:id/experiments', function (request, response, next) {
    kbase.getExperiments({
        response: response,
        genomeId: request.params.id
    });
});

app.get('/data/genome/:id/datasets', function (request, response, next) {
    kbase.getNetworkDatasets({
        response: response,
        genomeId: request.params.id
    });
});

app.get('/data/ontology/:type', function (request, response, next) {
    kbase.getOntology({
        response: response,
        type: request.params.type
    });
});

app.get('/data/ontology/:type/:term/samples',
function (request, response, next) {
    kbase.getOntologyTermSamples({
        response: response,
        type: request.params.type,
        term: request.params.term
    });
});

app.get('/data/ontology/:type/:term/expression', function (req, res, next) {
    kbase.getExpressionData({
        response: res,
        type: req.params.type,
        term: req.params.term,
        genes: req.query.genes ? req.query.genes.split(",") : []
    })
})

app.get('/data/node/:id', function (request, response, next) {
    kbase.getNodeInfo({
        response: response,
        nodeId: request.params.id
    });
});

app.get('/data/node/:id/datasets', function (request, response, next) {
    kbase.getNetworkDatasets({
        response: response,
        nodeId:   request.params.id
    });
});

app.get('/data/experiment/:id/traits', function (request, response, next) {
    kbase.getTraits({
        response:     response,
        experimentId: request.params.id
    });
});

app.get('/data/experiment/:id', function (request, response, next) {
    kbase.getExperiment({
        response: response,
        experimentId: request.params.id
    });
});

app.get('/data/query/ontology', function (request, response, next) {
    if (typeof request.query.genes !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    kbase.getGOTerms({
        response: response,
        genes: request.query.genes
            ? request.query.genes.split(",") : []
    });
});

app.get('/data/query/expression', function (request, response, next) {
    if (typeof request.query.genes !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    if (typeof request.query.terms !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    kbase.getExpressionProfiles({
        response: response,
        genes: request.query.genes
            ? request.query.genes.split(",") : [],
        terms: request.query.terms
            ? request.query.terms.split(",") : [],
        type: request.query.type || 'plant'
    });
})

app.get('/data/query/go-enrichment', function (request, response, next) {
    if (typeof request.query.genes !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    kbase.getGOEnrichment({
        response: response,
        genes: request.query.genes
            ? request.query.genes.split(",") : []
    });
});

app.get('/data/genes/functions', function (request, response, next) {
    if (typeof request.query.genes !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    kbase.getGeneFunctions({
        response: response,
        genes: request.query.genes
            ? request.query.genes.split(",") : []
    });
});

app.get('/data/query/gene-function', function (request, response, next) {
    if (typeof request.query.genes !== 'string') {
        response.send(400, {
            error: "'genes' query parameter must be a string"
        });
        return;
    }
    kbase.getFunctionalAnnotations({
        response: response,
        genes: request.query.genes
            ? request.query.genes.split(",") : []
    })
});

app.get('/data/network/internal', function (request, response, next) {
    kbase.getInternalNetwork({
        response: response,
        datasets: request.query.datasets.split(","),
        nodes:    request.query.nodes.split(","),
        rels:     request.query.rel ? [request.query.rel] : null
    });
});

app.get('/data/network/fake', function (request, response, next) {
    response.contentType = 'json';
    var nNodes = parseInt(request.query.nodes) || 20;
    var nEdges = parseInt(request.query.edges) || 50;
    var nClusters = parseInt(request.query.clusters) || 3;
    var network = randomNetwork(nNodes, nEdges, nClusters);
    response.send(network);
});

function fakeNeighborhood(request, response) {
    response.contentType = 'json';
    var rootId = RANDOM_NEIGHBORHOOD_NODES;
    var neighborhood = randomNetwork(
        RANDOM_NEIGHBORHOOD_NODES,
        RANDOM_NEIGHBORHOOD_NODES + 5,
        1
    );
    neighborhood.nodes.push({
        id:       rootId,
        name:     request.params.id,
        entityId: request.params.id
        
    });
    for (var i in neighborhood.nodes) {
        neighborhood.edges.push({
            source: rootId,
            target: neighborhood.nodes[i].id,
            weight: Math.random()
        })
    }
    response.send(neighborhood);
}

app.get('/data/network/fake/:id/neighbors',
function (request, response, next) {
    fakeNeighborhood(request, response);
});

function splitQueryParam(req, param) {
    return req.query[param] ?
        req.query[param].split(",") : [];
}

app.get('/data/node/:id/neighbors', function (request, response, next) {
    var datasets = splitQueryParam(request, 'datasets');
    if (request.query.datasets == ["fake"]) {
        return fakeNeighborhood(request, response);
    }
    kbase.getNeighborNetwork({
        response: response,
        nodes:    [request.params.id],
        datasets: datasets,
        rels:     splitQueryParam(request, 'rels')
    });
});

app.get('/data/query/network/neighbors', function (request, response, next) {
    var datasets = splitQueryParam(request, "datasets");
    var nodes    = splitQueryParam(request, "nodes");
    var rels     = splitQueryParam(request, "rels");
    kbase.getNeighborNetwork({
        response: response,
        nodes:    nodes,
        datasets: datasets,
        rels:     rels
    });
})

app.get('/data/coexpression', function (request, response, next) {
    response.contentType = 'json';
    var genes = request.query.genes;
    if (!genes || genes.length == 0) {
        response.send([]);
        return;
    }
    genes = genes.split(",")
    var MAX_GENES = 80;
    var numGenes = Math.min(MAX_GENES, genes.length);
    var rGenes = [];
    var matrix = [];
    for (var i = 0; i < numGenes; i++) {
        rGenes.push(genes[i]);
        for (var j = 0; j < numGenes; j++) {
            if (i != j) {
                matrix.push([i, j, Math.random()]);
            }
        }
    }
    response.send({ genes: rGenes, matrix: matrix });
});

Object.clone = function(obj) {
    return Object.create(
        Object.getPrototypeOf(obj), 
        Object.getOwnPropertyNames(obj).reduce(function(memo, name) {
            return (memo[name] =
                Object.getOwnPropertyDescriptor(obj, name)) && memo;
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
        filename =
            path.join(__dirname, 'test', 'fixtures', request.params.network) +
                ".pajek";
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
            response.send(404, {
                error: "Network " + request.params.network + " not found"
            });
        }
    })
});

var Random = new Object();
var randomGroupName = function () {
    if (!Random.clusters) {
        Random.clusters = [];
        Random.clusterStart = 1;
        Random.clusterNum   = 30;
    }
    if (Random.clusters.length == 0) {
        for (var i = 0; i < Random.clusterNum; i++) {
            Random.clusters.push("Group" + (Random.clusterStart + i));
        }
        shuffle(Random.clusters);
        Random.clusterStart += Random.clusterNum;
    }
    return Random.clusters.pop();
}

function randomNetwork(nNodes, nEdges, nClusters) {
    delete Random.clusters;
    var RANDOM_TRIES = 50;
    var nodes = [], edges = [];
    var nodeIndex = 0;
    var clusterMasters = [];
    for (var c = 0; c < nClusters; c++) {
        var groupName = randomGroupName();
        for (var i = 0; i < nNodes; i++) {
            var name = 'Node' + (Math.ceil(Math.random() * 1000) + 1);
            nodes.push({
                id: nodeIndex,
                name: name,
                group: groupName,
                entityId: name
            });
            nodeIndex++;
        }
        clusterMasters[c]
            = Math.floor(Math.random() * nNodes) + c * nNodes;
        var seen = {}, keys = 0;
        for (var i = 0; i < nEdges; i++) {
            var s, t;
            while (keys < nEdges * nEdges) {
                s = Math.floor(Math.random() * nNodes);
                t = Math.floor(Math.random() * nNodes);
                if (s == t) continue;
                var key = s * nNodes * 100 + t;
                if (seen[key] != 1) {
                    seen[key] = 1;
                    break;
                }
                keys++;
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
            response.write(JSON.stringify({ count: counter }));
            response.write("\n");
        } else {
            response.end();
            clearTimeout(this);
        }
    }, 500);
});

(function () {
    var response = { send: console.error };
    kbase.getGenomes({
        response: response,
        callback: function (genomes) {
            genomes.result.forEach(function (genome) {
                kbase.getExperiments({
                    response: response,
                    genomeId: genome[0],
                    callback: function (data) {
                        data.experiments.forEach(function (experiment) {
                            kbase.getTraits({
                                response: response,
                                experimentId: experiment[0],
                                callback: function () { }
                            });
                        });
                    }
                });
            });
        }
    })
})()
