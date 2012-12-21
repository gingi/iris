var vm = require('vm');
var jQuery = require('jquery'); //jQueryStub();
var fs = require('fs');
var sandbox = { jQuery: jQuery, console: console };

requireVanilla(__dirname + '/g2p-api.js');
module.exports = function (url) {
    return new sandbox.Genotype_PhenotypeAPI(url);
}

function requireVanilla(path) {
    var data = fs.readFileSync(path, 'utf8');
    var ret = vm.runInNewContext(data, sandbox, path);
}