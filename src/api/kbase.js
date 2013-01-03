var vm     = require('vm');
var jQuery = require('jquery');
var fs     = require('fs');
var path   = require('path');

var P_DECIMALS = 5;
var FLANKING_DISTANCE = 1e4;

var apis = {
    network: {
        url: 'http://140.221.92.181:7064/KBaseNetworksRPC/networks',
        src: "networks-api.js",
        fn:  "KBaseNetworks"
    },
    g2p: {
        url: 'http://140.221.84.160:7068',
        src: "g2p-api.js",
        fn:  "Genotype_PhenotypeAPI"
    },
    cdmi: {
        url: 'http://140.221.84.160:7032',
        src: "cdm-api.js",
        fn:  "CDMI_API"
    },
    cdmiEntity: {
        url: 'http://140.221.84.160:7032',
        src: "cdm-api.js",
        fn:  "CDMI_EntityAPI"        
    },
    ontology:   {
        url: 'http://140.221.84.160:7062',
        src: "ontology-api.js",
        fn:  "Ontology"
    },
    expression: {
        url: 'http://140.221.84.160:7063',
        src: "expression-api.js",
        fn:  "PlantExpression"
    }
}

function errorHandler(response, type, errorMessage) {
    type = (type || "Service Error");
    var getError = errorMessage
        ? function () { return errorMessage }
        : function (err) { return err };
    return function (err) {
        console.error("Error (%s):", type, err);
        response.send(503, {
            error: getError(err)
        });
    }
}

function rpcErrorHandler(response) {
    return errorHandler(response,
        "RPC Service Error",
        "Unexpected RPC service error"
    );
}

function validateParams(target, reqs) {
    target = (target || {});
    reqs   = (reqs || []);
    reqs.push('response');
    try {
        var missing = [];
        for (var i = 0; i < reqs.length; i++) {
            var param = reqs[i];
            if (!target.hasOwnProperty(param) || target[param] == null) {
                missing.push(param);
            }
        }
        if (missing.length > 0) {
            throw "Missing required parameter(s) [" + missing.join(" ") + "]";
        }
    } catch (err) {
        if (target.response) {
            errorHandler(target.response)(err)
        }
    }
    target.callback = (target.callback || function (json) {
        target.response.contentType = 'json';
        target.response.send(json);
    });
    return target;
}

function api(key) {
    var params = apis[key];
    if (!params.object) {
        var proto = apiRequire(path.join(__dirname, params.src), params.fn);
        params.object = new proto(params.url);
    }
    return params.object;
}

var sandboxes = {};
function apiRequire(path, fn) {
    if (!sandboxes[path]) {
        var sandbox = sandboxes[path] = { jQuery: jQuery, console: console };
        var data = fs.readFileSync(path, 'utf8');
        var ret = vm.runInNewContext(data, sandbox, path);
    }
    return sandboxes[path][fn];
}

/* ADAPTED METHODS */

exports.getVariations = function (params) {
    params = validateParams(params, ['traitId']);
    params.contigFetcher =
        (params.contigFetcher || api('cdmi').contigs_to_lengths_async);
    params.variationFetcher =
        (params.variationFetcher || api('g2p').traits_to_variations_async);
    params.pcutoff    = (params.pcutoff || 1);
    params.variationFetcher(params.traitId, params.pcutoff,
    function (json) {
        if (json == null)
            return errorHandler(params.response)("No response from RPC server");
        var v = [];
        var maxscore = 0;
        var trait = json.trait;
        var contigs = json.contigs;
        var contigIds = [];
        if (json.variations.length == 0) {
            params.response.send(404, {
                error: "No variations for trait " + params.traitId,
            });
            return;
        }
        contigs.forEach(function (c) { contigIds.push(c.id) });
        json.variations.forEach(function (variation) {
            var normalized = -Math.log(parseFloat(variation[2])).toFixed(P_DECIMALS);
            v.push([
                variation[0],
                variation[1],
                normalized
            ]);
            maxscore = Math.max(maxscore, normalized);
        });
        params.contigFetcher(contigIds, function (lengths) {
            var outContigs = [];
            contigs.forEach(function (c) {
                outContigs.push({
                    id: c.id,
                    name: c.name,
                    len: parseInt(lengths[c.id])
                })
            });
            trait.name = trait.trait_name;
            params.callback({
                maxscore:   maxscore,
                trait:      trait,
                variations: v,
                contigs:    outContigs
            });
        }, rpcErrorHandler(params.response))
    }, rpcErrorHandler(params.response));
}

exports.getTraitGenes = function (params) {
    params = validateParams(params, ['traitId', 'pmin', 'pmax', 'loci']);
    api('g2p').selected_locations_to_genes_async(
        params.traitId,
        params.pmin,
        params.pmax,
        params.loci,
        FLANKING_DISTANCE,
        params.callback,
        rpcErrorHandler(params.response)
    );
}

exports.getContigLengths = function (params) {
    params = validateParams(params, ['genomeId']);
    api('cdmiEntity').get_relationship_IsComposedOf_async(
        [params.genomeId], ['id'], [], ['id'], function (data) {
        var ids = [];
        data.forEach(function (c) { ids.push(c[2].id); });
        api('cdmi').contigs_to_lengths_async(ids, function (lengths) {
            params.callback(lengths);
        }, rpcErrorHandler(params.response));
    }, rpcErrorHandler(params.response));
}

exports.getGenomes = function (params) {
    params = validateParams(params);
    api('cdmiEntity').all_entities_Genome_async(
        0, 100, ['id', 'scientific_name'], function (json) {
        var genomes = [];
        for (var id in json) {
            var genome = json[id];
            genomes.push([ genome.id, genome.scientific_name ]);
        }
        params.callback(genomes);
    }, rpcErrorHandler(params.response));
}

exports.getExperiments = function (params) {
    params = validateParams(params, ['genomeId']);
    api('g2p').get_experiments_async(params.genomeId, function (json) {
        params.callback(json);
    }, rpcErrorHandler(params.response));
}

exports.getTraits = function (params) {
    params = validateParams(params, ['experimentId']);
    api('g2p').get_traits_async(params.experimentId, function (json) {
        json.forEach(function (trait) {
            trait[1] = trait[1].replace(/:.*$/, '');
        });
        params.callback(json);
    }, rpcErrorHandler(params.response));
}

exports.getNeighborNetwork = function (params) {
    params = validateParams(params, ['nodeId']);
    api('networks').buildFirstNeighborNetwork_async(
        [ "kb|netdataset.regprecise.301",
          "kb|netdataset.modelseed.0",
          "kb|netdataset.ppi.7" ],
        params.nodeId,
        ['GENE_CLUSTER'],
        function (data) {
            params.callback(transformNetwork(data));
        },
        rpcErrorHandler(params.response)
    );
}

/* Utility functions */
Object.clone = function (obj) {
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
