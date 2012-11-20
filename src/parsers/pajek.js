var optimist = require('optimist');
var reader   = require('./line-reader');
var graph    = require('../graph');

var network = null;

exports.parse = function (filename) {
    network = graph.createGraph();
	return network;
};