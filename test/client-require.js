var requirejs = require('requirejs');
var vm        = require('vm');
var fs        = require('fs');
var jsdom     = require('jsdom');

global.document  = jsdom.jsdom("<html><head></head><body></body></html>");
global.window    = global.document.createWindow();
// global.requirejs = requirejs;
// global.define    = requirejs.define;

var BASE_DIR  = __dirname + '/../public/js';
var CONF_FILE = BASE_DIR + '/config.js';

function getAppConfig() {
    var _cfg = {};
    var config = fs.readFileSync(CONF_FILE, 'utf8');
    var context = vm.createContext();
    context.requirejs = {
        config: function (cfg) {
            _cfg = cfg;
        }
    };
    vm.runInContext(config, context, CONF_FILE);
    return _cfg;
}

module.exports = function () {
    var config = getAppConfig();
    config.baseUrl     = BASE_DIR;
    config.nodeRequire = require;
    requirejs.config(config);
    return requirejs;
}