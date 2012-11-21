var pajek = require(__dirname + '/../src/parsers/pajek');
var fixture = __dirname + '/fixtures/example.pajek';

exports.testParse = function (test) {
	var expectedJSON = require(__dirname + '/fixtures/example.pajek.json');
	pajek.parse(fixture, function (network) {
		test.deepEqual(expectedJSON, network.json());
		test.done();		
	})
}