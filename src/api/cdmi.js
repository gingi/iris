var vm = require('vm');
var jQuery = require('jquery'); //jQueryStub();
var fs = require('fs');
var sandbox = { jQuery: jQuery, console: console };

requireVanilla(__dirname + '/cdm-api.js');

module.exports = sandbox;

function requireVanilla(path) {
    var data = fs.readFileSync(path, 'utf8');
    var ret = vm.runInNewContext(data, sandbox, path);
}