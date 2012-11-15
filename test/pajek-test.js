var pajek = require(__dirname + '/../src/parsers/pajek');
var fixture = __dirname + '/fixtures/example.pajek';

exports.testParse = function (test) {
	pajek.parse(fixture);
	test.done();
}