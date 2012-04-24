var iris      = require('./service-base.js');
var app       = iris.app;

var CDMI_JS  = iris.IRIS_HOME + '/root/js/cdmi.js';
var CDMI_URL = "http://bio-data-1.mcs.anl.gov/services/cdmi_api";
var cdmi = require(CDMI_JS);
cdmi.setXhr(require('xmlhttprequest').XMLHttpRequest);
var api = new cdmi.CDMI_API(CDMI_URL);
var eapi = new cdmi.CDMI_EntityAPI(CDMI_URL);

var kbaseSpecies = {
    'athaliana': 'kb|g.3899'
};

function getSpecies(name) {
    return kbaseSpecies[name.toLowerCase()];
}

function getChromosomes(speciesName) {
    var kbid = getSpecies(speciesName);
    var contigs = api.genomes_to_contigs([kbid])[kbid];
    var chrs = eapi.get_entity_Contig(contigs, ['source_id']);
    var output = {};
    var lengths = api.contigs_to_lengths(contigs);
    for (var i in chrs) {
        var chrname = chrs[i]['source_id'];
        chrname = chrname.replace(/^.*\:/,'').replace(/^Chr/,'');
        output[chrname] = parseInt(lengths[i]);
    }
    return output;
}

app.get('/species/:species/chromosomes', function (req, res) {
    res.json(getChromosomes(req.params.species));
});

iris.startService();