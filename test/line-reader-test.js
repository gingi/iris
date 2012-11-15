var lineReader = require(__dirname + '/../src/parsers/line-reader');
var fixture    = __dirname + '/fixtures/lines.txt';

exports['read 8 lines'] = function (test) {
	var lines = [];
	var reader = lineReader(fixture, { bufferSize: 7 });
	reader.on('line', function (line) { lines.push(line); });
	reader.on('end', function () {
		test.equal(lines.length, 8);
		test.equal('abcd', lines[0]);
		test.equal('yz',   lines[7]);
		test.done();		
	});
};
