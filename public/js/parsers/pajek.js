var reader   = require('./line-reader');
var Graph    = require('../graph');

function lineParser(network) {
    var parseMode = null;
    var vertexMode = new RegExp(/^\*\s*vertices/i);
    var edgeMode   = new RegExp(/^\*\s*(?:edges|arcs)/i);
    return function (line) {
        line = line.replace(/^\s+|\s+$|["']/g, '');
        if (line == '') return;
        if (vertexMode.test(line)) {
            parseMode = 'vertices';
            return;
        }
        if (edgeMode.test(line)) {
            parseMode = 'edges';
            return;
        }
        var tokens = line.split(/\s+/);
        if (parseMode == 'vertices') {
            network.addNode(tokens[0]).attribute('name', tokens[1]);
        } else if (parseMode == 'edges') {
            network.link(tokens[0], tokens[1], { weight: tokens[2] });
        }
    }
}


exports.parse = function (filename, callback) {
    var network = new Graph();
    var stream = reader(filename);
    stream.on('line', lineParser(network));
    stream.on('end', function () {
        callback(network);
    })
};