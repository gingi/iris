var optimist = require('optimist');
var reader   = require('./line-reader');
var graph    = require('../graph');

function lineParser(network) {
    var parseMode = null;
    var vertexMode = new RegExp(/^\*\s*vertices/i);
    var edgeMode   = new RegExp(/^\*\s*edges/i);
    return function (line) {
        if (vertexMode.test(line)) {
            parseMode = 'vertices';
            return;
        }
        if (edgeMode.test(line)) {
            parseMode = 'edges';
            return;
        }
        var tokens = line.split(/\s+/);
        if (tokens.length == 0) return;
        if (parseMode == 'vertices') {
            network.createNode(tokens[0]).attribute('name', tokens[1]);
        } else if (parseMode == 'edges') {
            network.link(tokens[0], tokens[1], { weight: tokens[2] });
        }
    }
}


exports.parse = function (filename, callback) {
    var network = graph.createGraph();
    var stream = reader(filename);
    stream.on('line', lineParser(network));
    stream.on('end', function () {
        callback(network);
    })
};