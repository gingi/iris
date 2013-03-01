var requirejs = require('requirejs');
var vm        = require('vm');
var fs        = require('fs');
var jsdom     = require('jsdom');

global.document  = jsdom.jsdom("<html><body></body></html>");
global.window    = global.document.createWindow();
global.requirejs = requirejs;

var ConfigFile = __dirname + '/../public/js/config.js';

module.exports = function (callback) {
    var sandbox = { requirejs: requirejs };
    var config = fs.readFileSync(ConfigFile, 'utf8');
    vm.runInNewContext(config, sandbox, ConfigFile);
    requirejs.config({ 
        baseUrl: __dirname + '/../public/js',
        nodeRequire: require
    });
    return requirejs;
}