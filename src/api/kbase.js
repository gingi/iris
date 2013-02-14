var vm    = require('vm');
var $     = require('jquery');
var fs    = require('fs');
var path  = require('path');
var async = require('async');
var util  = require('util');

var KBaseAPI    = apiRequire(path.join(__dirname, 'api.js'));
var CONFIG_DIR  = path.join("..", "..", "conf");

var DEBUG_LEVEL = 1;

var PLANT_GENOMES = {
    "Ptrichocarpa.JGI2.0": /^POPTR_/,
    "Athaliana.TAIR10": /^AT\dG\d+/,
}

function apiRequire(path) {
    var sandbox = { $: $, jQuery: $, console: console };
    var data = fs.readFileSync(path, 'utf8');
    var ret = vm.runInNewContext(data, sandbox, path);
    return sandbox;
}

var P_DECIMALS = 5;
var FLANKING_DISTANCE = 1e4;

var APIConfig;

function errorHandler(response, type, errorMessage) {
    type = (type || "Service Error");
    var getError = errorMessage
        ? function () { return errorMessage }
        : function (err) { return err };
    return function (err) {
        console.error("Error (%s):", type, err);
        try {
            response.send(503, {
                error: getError(err)
            });
        } catch (err) {
            console.error("Error sending error response", err);
        }
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
        } else {
            throw new Error("No response object!");
        }
    }
    target.callback = (target.callback || function (json) {
        target.response.contentType = 'json';
        target.response.send(json);
    });
    return target;
}

var jqueryAJAXErrorOverridden = false;
function trapAJAXErrors() {
    if (jqueryAJAXErrorOverridden) return;
    jqueryAJAXErrorOverridden = true;
    var jQueryAjax = $.ajax;
    $.extend({
        ajax: function () {
            var params = arguments[0];
            params.error = function (jqXHR, exception) {
                if (jqXHR.status === 0) {
                    console.error('Not connect.\n Verify Network.');
                } else if (jqXHR.status == 404) {
                    console.error('Requested page not found. [404]');
                } else if (jqXHR.status == 500) {
                    console.error('Internal Server Error [500].');
                    console.error(jqXHR.responseText);
                } else if (exception === 'parsererror') {
                    console.error('Requested JSON parse failed.');
                } else if (exception === 'timeout') {
                    console.error('Time out error.');
                } else if (exception === 'abort') {
                    console.error('Ajax request aborted.');
                } else {
                    console.error('Uncaught Error.\n' + jqXHR.responseText);
                }
            }
            return jQueryAjax.apply(null, arguments).error(function (err) {
                console.log("Bad error thing", err);
                throw new Error(err);
            });
        }
    });
}

var jqueryDebugAJAXRequestsOverridden = false;
var processing = 0;
function debugAJAXRequests() {
    if (jqueryDebugAJAXRequestsOverridden) return;
    jqueryDebugAJAXRequestsOverridden = true;
    var jQueryAjax = $.ajax;
    $.extend({
        ajax: function () {
            var params = arguments[0];
            console.log(
                "[DEBUG] curl -d '%s' '%s'", params.data, params.url);
            var xhr = jQueryAjax.apply(null, arguments);
            if (DEBUG_LEVEL > 1) {
                processing++;
                var timeout = setInterval(function () {
                    if (xhr.state() == "pending") {
                        console.log("[DEBUG] Still waiting (10s): [%s %s]",
                            params.data, params.url);
                    } else {
                        processing--;
                        console.log(
                            "[DEBUG] Clearing timeout [%s %s] State:%s Left:%d",
                            params.data, params.url, xhr.state(), processing);
                        clearTimeout(timeout);
                    }
                }, 10000);
            }
            return xhr;
        }
    });
}

function loadAPIConfig() {
    var serviceFile = path.join(CONFIG_DIR,
        util.format("services.%s.json", exports.env)
    );
    APIConfig = require(serviceFile);
}

function api(key) {
    if (exports.debug) {
        debugAJAXRequests();
    }
    // trapAJAXErrors();
    if (!APIConfig) {
        loadAPIConfig();
    }
    var params = APIConfig[key];
    if (!params.object) {
        var proto = KBaseAPI[params.fn];
        params.object = new proto(params.url);
    }
    return params.object;
}

function log10(val) { return Math.log(val) / Math.LN10; }

var GenomeExperiments = {};
var ExperimentTraits  = {};

/* ADAPTED METHODS */
exports.getVariations = function (params) {
    params = validateParams(params, ['traitId']);
    params.contigFetcher =
        (params.contigFetcher || api('cdmi').contigs_to_lengths);
    params.variationFetcher =
        (params.variationFetcher || api('g2p').traits_to_variations);
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
            var normalized = -log10(parseFloat(variation[2])).toFixed(5);
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
            if (!trait.experiment) {
                trait.experiment = ExperimentTraits[trait.id];
            }
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
    if (Object.prototype.toString.call(params.loci) !== '[object Array]') {
        return errorHandler(params.response)
            ("'loci' argument must be an array");
    }
    api('g2p').selected_locations_to_genes(
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
    api('cdmiEntity').get_relationship_IsComposedOf(
        [params.genomeId], ['id'], [], ['id'], function (data) {
        var ids = [];
        data.forEach(function (c) { ids.push(c[2].id); });
        api('cdmi').contigs_to_lengths(ids, function (lengths) {
            params.callback(lengths);
        }, rpcErrorHandler(params.response));
    }, rpcErrorHandler(params.response));
}

exports.getGenomeInfo = function (params) {
    params = validateParams(params, ['genomeId']);
    async.parallel({
        contigs: function (callback) {
            async.waterfall([
                curryAsyncCallback(exports.getContigLengths, params),
                function (contigs, wfCallback) {
                    if (Object.size(contigs) == 0) {
                        return wfCallback(
                            { code: 404, error: "No contigs" }, null
                        );
                    }
                    var ids = [];
                    for (var id in contigs) ids.push(id);
                    api('cdmiEntity').get_entity_Contig(ids, ['source_id'],
                    function (names) {
                        var json = {};
                        for (var id in names) {
                            json[id] = {
                                name: names[id].source_id,
                                length: contigs[id]
                            }
                        }
                        wfCallback(null, json)
                    }, rpcErrorHandler(params.response))
                }
            ], function (err, results) {
                callback(err, results);
            });
        },
        info: function (callback) {
            api('cdmiEntity').get_entity_Genome([params.genomeId],
                "scientific_name contigs pegs rnas dna_size".split(" "),
                function (data) { callback(null, data[params.genomeId]); },
                rpcErrorHandler(params.response)
            )
        }
    }, function (err, results) {
        if (err) {
            if (err.code == 404) {
                return params.response.send(404, {
                    error: "Genome " + params.genomeId + " not found"
                });
            }
            errorHandler(params.response)(err);
        }
        params.callback(results);
    });
}

exports.getGenomes = function (params) {
    params = validateParams(params);
    async.parallel({
        genomes: function (callback) {
            api('cdmiEntity').query_entity_Genome(
                [['domain', '=', 'Eukaryota']],
                ['id', 'scientific_name'], function (json) {
                    var genomes = [];
                    for (var id in json) {
                        var genome = json[id];
                        genomes.push([ genome.id, genome.scientific_name ]);
                    }
                    callback(null, genomes);
                }, rpcErrorHandler(params.response)
            )
        },
        traits: function (callback) {
            if (!params.haveTrait)
                return callback(null, null);
            api('g2p').genomes_with_trait(function (result) {
                callback(null, result);
            }, rpcErrorHandler(params.response));
        }
    }, function (err, results) {
        if (err) {
            return errorHandler(params.response)(err);
        }
        var varGenomes = {};
        if (results.traits) {
            results.traits.forEach(function (id) {
                varGenomes[id] = true;
            });
        }
        var genomes = [];
        if (results.genomes) {
            results.genomes.forEach(function (genome) {
                genomes.push(
                    [ genome[0], genome[1], varGenomes[genome[0]] ? 1 : 0 ] 
                );
            });
        }
        params.callback({ result: genomes });
    });
}

exports.getExperiments = function (params) {
    params = validateParams(params, ['genomeId']);
    api('g2p').get_experiments(
        params.genomeId,
        function (data) {
            data.forEach(function (exp) {
                GenomeExperiments[exp[0]] = params.genomeId;
            });
            params.callback({
                genome: params.genomeId,
                experiments: data
            });
        },
        rpcErrorHandler(params.response)
    );
}

exports.getExperiment = function (params) {
    params = validateParams(params, ['experimentId']);
    api('cdmiEntity').get_entity_PhenotypeExperiment(
        [params.experimentId], ['source_id', 'description', 'metadata'],
        function (data) {
            var metadata = {};
            for (var property in data) {
                metadata[property] = data[property];
            }
            if (!metadata.genome) {
                metadata.genome = GenomeExperiments[params.experimentId];
            }
            params.callback(metadata);
        },
        rpcErrorHandler(params.response)
    );
}

exports.getTraits = function (params) {
    params = validateParams(params, ['experimentId']);
    api('g2p').get_traits(params.experimentId, function (json) {
        json.forEach(function (trait) {
            trait[1] = trait[1].replace(/:.*$/, '');
            ExperimentTraits[trait[0]] = params.experimentId;
        });
        params.callback({
            genome: GenomeExperiments[params.experimentId],
            experiment: params.experimentId,
            traits: json
        });
    }, rpcErrorHandler(params.response));
}

var EdgeTypes = {
    gg: "GENE_GENE",
    gc: "GENE_CLUSTER",
    cc: "CLUSTER_CLUSTER"
}

exports.getNeighborNetwork = function (params) {
    params = validateParams(params, ['nodes', 'datasets']);
    if (params.datasets == null) {
        params.datasets = [
            "kb|netdataset.regprecise.301",
            "kb|netdataset.modelseed.0",
            "kb|netdataset.ppi.7"
        ];
    }
    if (params.rels == null || params.rels.length == 0) {
        params.rels = ['GENE_CLUSTER', 'CLUSTER_CLUSTER', 'GENE_GENE'];
    } else {
        for (var i = 0; i < params.rels.length; i++) {
            params.rels[i] = EdgeTypes[params.rels[i]] || params.rels[i];
        }
    }
    api('network').buildFirstNeighborNetwork(
        params.datasets,
        params.nodes,
        params.rels,
        function (data) {
            params.callback(transformNetwork(data));
        },
        rpcErrorHandler(params.response)
    );
}

exports.getGeneFunctions = function (params) {
    params = validateParams(params, ["genes"]);
    api('cdmi').fids_to_functions(
        params.genes,
        function (data) {
            var functions = {};
            for (var gene in data) {
                if (data[gene] != null) {
                    functions[gene] =
                        data[gene].replace(/\s*\[Source.*$/, '');
                }
            }
            params.callback(functions);
        },
        rpcErrorHandler(params.response)
    );
}

exports.getNodeInfo = function (params) {
    params = validateParams(params, ["nodeId"]);
    for (var genome in PLANT_GENOMES) {
        if (PLANT_GENOMES[genome].test(params.nodeId)) {
            params.nodeId = [genome, params.nodeId].join(":");
            continue;
        }
    }
    api('idserver').external_ids_to_kbase_ids("EnsemblPlant", [params.nodeId],
        function (data) {
            if (!data || !data.hasOwnProperty(params.nodeId)) {
                return params.response.send(404, {
                    error: "Node ID not found"
                });
            }
            var kbid = data[params.nodeId];
            api('cdmiEntity').get_entity_Feature([kbid],
                ["feature_type", "source_id", "sequence_length", "function"],
                params.callback, rpcErrorHandler(params.response)
            )
        }, rpcErrorHandler(params.response)
    );
}

exports.getInternalNetwork = function (params) {
    params = validateParams(params, ["nodes", "datasets"]);
    params.rels =
        params.rels || ["GENE_CLUSTER", "GENE_GENE", "CLUSTER_CLUSTER"];
    api('network').buildInternalNetwork(
        params.datasets,
        params.nodes,
        params.rels,
        function (data) {
            params.callback(transformNetwork(data));
        },
        rpcErrorHandler(params.response)
    );
}

exports.getNetworkDatasets = function (params) {
    params = validateParams(params);
    if (params.nodeId) {
        api('network').entity2Datasets(
            params.nodeId,
            params.callback,
            rpcErrorHandler(params.response)
        );
    } else if (params.genomeId) {
        api('network').taxon2Datasets(
            params.genomeId,
            params.callback,
            rpcErrorHandler(params.response)
        );
    } else {
        errorHandler(params.response)(
            "Either 'geneId' or 'genomeId' need to be specified"
        );
    }
}

exports.getOntology = function (params) {
    params = validateParams(params, ['type']);
    var fn, expAPI = api('expression');
    switch (params.type) {
        case 'plant':       fn = expAPI.get_all_po; break;
        case 'environment': fn = expAPI.get_all_eo; break;
        default:
            errorHandler(params.response)("Unsupported ontology");
            return;
    }
    fn.call(expAPI, params.callback, rpcErrorHandler(params.response));
}

exports.getOntologyTermInfo = function (params) {
    params = validateParams(params, ['type', 'term']);
    var fn, expAPI = api('expression');
    switch (params.type) {
        case 'plant':       fn = expAPI.get_po_descriptions; break;
        case 'environment': fn = expAPI.get_eo_descriptions; break;
        default:
            errorHandler(params.response)("Unsupported ontology");
            return;
    }
    fn.call(expAPI, [params.term],
        params.callback, rpcErrorHandler(params.response)
    );
}

exports.getOntologyTermSamples = function (params) {
    params = validateParams(params, ['type', 'term']);
    var fn, expAPI = api('expression');
    switch (params.type) {
        case 'plant':       fn = expAPI.get_po_sampleidlist; break;
        case 'environment': fn = expAPI.get_eo_sampleidlist; break;
        default:
            errorHandler(params.response)("Unsupported ontology");
            return;
    }
    fn.call(expAPI, [params.term],
        function (data) {
            var result = {};
            for (var term in data) {
                var samples = result[term] = {};
                for (var i = 0; i < data[term].length; i++) {
                    var tokens = data[term][i];
                    var species = tokens[0], sample = tokens[1];
                    if (!samples.hasOwnProperty(species))
                        samples[species] = [];
                    samples[species].push(sample);
                }
            }
            params.callback(result);
        }, rpcErrorHandler(params.response));
}

function genomeNamesForGenes(response, genes, callback) {
    api('cdmi').fids_to_genomes(genes, function (json) {
        var genomes = [];
        var seen = {};
        for (var id in json) {
            var genome = json[id]
            if (!seen.hasOwnProperty(genome)) {
                genomes.push(genome);
                seen[genome] = 1;
            }
        }
        api('cdmiEntity').get_entity_Genome(genomes, 
            ['scientific_name'],
            function (json) {
                var names = [];
                for (var i in json) {
                    var gen = json[i];
                    names.push(gen.scientific_name);
                }
                callback(names);
            }, rpcErrorHandler(response)
        );
    }, rpcErrorHandler(response));
}

exports.getExpressionProfiles = function (params) {
    params = validateParams(params, ['type', 'terms', 'genes']);
    var funcs = {};
    params.terms.forEach(function (term) {
        funcs[term] = curryAsyncCallback(exports.getExpressionData, {
            response: params.response,
            type:     params.type,
            genes:    params.genes,
            term:     term,
            nsamples: 10
        });
    })
    async.parallel(funcs, function (err, results) {
        var errHandler = rpcErrorHandler(params.response);
        if (err) {
            return errHandler(err);
        }
        if (results == {}) {
            return params.callback(results);
        }
        try {
            var genes = [];
            var terms = [];
            var data = [];
            var counter = 0;
            for (var termId in results) {
                var result = results[termId].series;
                data[counter] = [];
                var sums = [];
                if (genes.length == 0)
                    genes = results[termId].genes;
                var termMeta = {};
                for (var id in results[termId].term) {
                    termMeta.id = id;
                    termMeta.name = results[termId].term[id];
                }
                terms.push(termMeta);
                var n = 0;
                for (var sample in result) {
                    if (result[sample].length) {
                        n++;
                        result[sample].forEach(function (value, i) {
                            if (sums[i] == null) sums[i] = 0;
                            sums[i] += parseFloat(value);
                        })
                    }
                }
                sums.forEach(function (sum, i) {
                    data[counter][i] = sum / n;
                });
                counter++;
            }
            params.callback({ genes: genes, terms: terms, data: data });
        } catch (err) {
            return errHandler(err);
        }
    })
}

exports.getExpressionData = function (params) {
    params = validateParams(params, ['type', 'term', 'genes']);
    var expAPI = api('expression');
    async.waterfall([
        function (callback) {
            async.parallel({
                genomes: function (parCallback) {
                    genomeNamesForGenes(params.response, params.genes, function (data) {
                        return parCallback(null, data);
                    });
                },
                samples: curryAsyncCallback(exports.getOntologyTermSamples, params),
                geneNames: curryAsyncCallback(exports.getGeneNames, params),
                termMeta: curryAsyncCallback(exports.getOntologyTermInfo, params)
            }, function (err, results) {
                if (err) {
                    console.error("Error:", err);
                    console(err, results);
                }
                callback(null, results);
            });
        },
        function (results, callback) {
            results.samples = results.samples || {};
            results.genomes = results.genomes || [];
            var samples = results.samples[params.term];
            var genSamples = [];
            results.genomes.forEach(function (g) {
                if (samples[g]) {
                    samples[g].forEach(function (s) {
                        genSamples.push(s);
                    });
                }
            });
            if (params.nsamples && genSamples.length > params.nsamples) {
                genSamples.length = params.nsamples;
            }
            expAPI.get_experiments_by_sampleid_geneid(genSamples,
                params.genes, function (json) {
                    var genes = [];
                    json.genes.forEach(function (id) {
                        genes.push({ id: id, name: results.geneNames[id] });
                    });
                    callback(null, {
                        genes: genes,
                        term: results.termMeta,
                        series: json.series
                    });
                },
                rpcErrorHandler(params.response)
            );
        }], function (err, results) {
            params.callback(results);
        }
    );
}

exports.getGeneNames = function (params) {
    params = validateParams(params, ["genes"]);
    api('cdmiEntity').get_entity_Feature(
        params.genes, ['source_id'], function (data) {
            var genes = {};
            for (var id in data) {
                genes[id] = data[id].source_id;
            }
            params.callback(genes)
        },
        rpcErrorHandler(params.response)
    );
}

var GO_DOMAINS = 
    ["biological_process", "molecular_function", "cellular_component"];
var GO_ECS     = ["IEA", "IEP", "ISS"];

function genomeWithCanonicalGenes(params, resultCallback) {
    params = validateParams(params, ['genomeId', 'genes']);
    async.parallel({
        genome: function (asyncCallback) {
            api('cdmiEntity').get_entity_Genome(
                [params.genomeId], ['source_id'], function (genome) {
                var sname = genome[params.genomeId].source_id;
                asyncCallback(null, sname);
            }, rpcErrorHandler(params.response))
        },
        genes: function (asyncCallback) {
            api('cdmiEntity').get_entity_Feature(
                params.genes, ['source_id'], function (genes) {
                    var sourceIds = {};
                    // FIXME: API expects versioned source IDs
                    // (e.g.,'POPTR_0019s05010.1')
                    for (id in genes) {
                        sourceIds[id] = genes[id].source_id + ".1";
                    }
                    asyncCallback(null, sourceIds);
                }, rpcErrorHandler(params.response)
            )
        }
    },
    function (err, result) {
        resultCallback(result.genome, result.genes);
    });
}    

exports.getGOTerms = function (params) {
    params = validateParams(params, ['genes']);
    api('ontology').get_goidlist(params.genes, [], [], function (data) {
        var terms = [];
        var genes = {};
        var termIndex = {};
        var count = 0;
        params.genes.forEach(function (kbid, i) {
            var geneTerms = [];
            genes[kbid] = { };
            for (var term in data[kbid]) {
                var index = termIndex[term];
                if (index == null) {
                    var termData = data[kbid][term][0];
                    termData.term = term;
                    terms.push(termData);
                    index = termIndex[term] = terms.length - 1;
                }
                geneTerms.push(index);
            }
            if (geneTerms.length > 0)
                genes[kbid].terms = geneTerms;
        });
        params.callback({
            genes: genes,
            terms: terms
        })
    }, rpcErrorHandler(params.response));
}

exports.getGOEnrichment = function (params) {
    params = validateParams(params, ['genes']);
    api('ontology').get_go_enrichment(
        params.genes, GO_DOMAINS, GO_ECS, "hypergeometric", "GO",
        params.callback, rpcErrorHandler(params.response)
    );
}

function curryAsyncCallback(fetchCb, params) {
    return function (asyncCallback) {
        var nParams = Object.clone(params);
        nParams.callback = function (result) {
            return asyncCallback(null, result);
        };
        return fetchCb.call(null, nParams);
    };
}

exports.getFunctionalAnnotations = function (params) {
    var params = validateParams(params, ['genes']);
    async.parallel([
        curryAsyncCallback(exports.getGeneFunctions, params),
        curryAsyncCallback(exports.getGOTerms,       params),
        curryAsyncCallback(exports.getGeneNames,     params)
    ], function (err, results) {
        var funcs = results[0], ontology = results[1], names = results[2];
        for (var gene in ontology.genes) {
            ontology.genes[gene].function = funcs[gene];
            ontology.genes[gene].name     = names[gene];
        }
        params.callback(ontology);
    });
}

exports.debug = false;
exports.env   = 'development';

/* Utility functions */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

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
    for (var prop in networkJson) {
        if (!json.hasOwnProperty(prop)) {
            json[prop] = networkJson[prop];
        }
    }
    return json;
}
