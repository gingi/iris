var fs = require('fs');
var optimist = require('optimist');

var network = {};

exports.parse = function (filename) {
	var stream = fs.createReadStream(filename);
	var remainder = null;
	stream.on('data', function (data) {
	});
	stream.on('end', function () { console.log("Finished"); });
};

exports.json = function () {
	return network;
}