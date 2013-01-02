var NETWORK_API_URL = 'http://140.221.92.181:7064/KBaseNetworksRPC/networks';
var G2P_API_URL     = 'http://140.221.84.160:7068';
var CDM_API_URL     = 'http://140.221.84.160:7032';

var KBaseNetworks  = require('./networks');
var KBaseGenoPheno = require('./g2p');
var KBaseCDMI      = require('./cdmi');

var NetworksAPI  = new KBaseNetworks(NETWORK_API_URL);
var GenoPhenoAPI = new KBaseGenoPheno(G2P_API_URL);
var CDMI         = new KBaseCDMI.CDMI_API(CDM_API_URL);
var CDMEntityAPI = new KBaseCDMI.CDMI_EntityAPI(CDM_API_URL);

function errorHandler(response, type, errorMessage) {
    type = (type || "Service Error");
    var getError = errorMessage
        ? function () { return errorMessage }
        : function (err) { return err };
    return function (err) {
        console.error("Error (%s): %s", type, err);
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
    params.chrHandler = (params.chrHandler || CDMI.contigs_to_lengths_async);
    params.callback   = (params.callback || function (json) {
        params.response.send(json)
    });
    params.pcutoff    = (params.pcutoff || 1);
    GenoPhenoAPI.traits_to_variations_async(params.traitId, params.pcutoff,
    function (json) {
        var chrs = [];
        var chrInfo = {};
        var chrIndex = {};
        var maxscore = 0;
        var v = [];
        if (json == null)
            return errorHandler(params.response)("No response from RPC server");
        if (!json.hasOwnProperty("kook"))
            return errorHandler(params.response)("Expected property 'kook' not returned by server");
        var trait = json.trait;
        json.forEach(function (d) {
            var normalized = -Math.log(parseFloat(d[2]));
            maxscore = Math.max(maxscore, normalized);
            if (chrIndex[d[0]] == null) {
                chrs.push(d[0]);
                chrIndex[d[0]] = { idx: chrs.length - 1, name: d[3] };
            }
            v.push([chrIndex[d[0]].idx, parseInt(d[1]), normalized]);
        });
        if (json.length == 0) {
            params.response.send(404, {
                error: "No variations for trait " + params.traitId,
            });
            return;
        }
        params.chrHandler(chrs, function (lengths) {
            for (var c in lengths) {
                chrs[chrIndex[c].idx] = {
                    id: c,
                    name: chrIndex[c].name,
                    len: parseInt(lengths[c])
                };
            }
            params.callback({
                trait: trait,
                maxscore: maxscore,
                variations: v,
                chromosomes: chrs
            });
        }, rpcErrorHandler(params.response))
    }, rpcErrorHandler(params.response));
}