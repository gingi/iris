var vm     = require('vm');
var jQuery = require('jquery');
var fs     = require('fs');
var path   = require('path');

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

var KBaseNetworks  = require('./networks');
var KBaseGenoPheno = require('./g2p');
var KBaseCDMI      = require('./cdmi');

var P_DECIMALS = 5;

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
    reqs.push('response');
    reqs.forEach(function (param) {
        if (!target.hasOwnProperty(param)) {
            throw new Error(
                arguments.callee + ": '" + param + "' is a required parameter");
        }
    });
}

exports.getVariations = function (params) {
    params = (params || {});
    validateParams(params, ['traitId']);
    params.contigFetcher =
        (params.contigFetcher || api('cdmi').contigs_to_lengths_async);
    params.variationFetcher =
        (params.variationFetcher || api('g2p').traits_to_variations_async);
    params.callback   = (params.callback || function (json) {
        params.response.send(json)
    });
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