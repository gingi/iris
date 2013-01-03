var vm = require('vm');
var jQuery = require('jquery');
var fs = require('fs');
var sandbox = { jQuery: jQuery, console: console };

requireVanilla(__dirname + '/networks-api.js');
module.exports = function (url) {
    return new sandbox.KBaseNetworks(url);
}

function requireVanilla(path) {
    var data = fs.readFileSync(path, 'utf8');
    var ret = vm.runInNewContext(data, sandbox, path);
}