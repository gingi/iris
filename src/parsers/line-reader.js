var fs     = require('fs');
var events = require('events');
var util   = require('util');

function LineReader(filename, options) {
	var self = this;
	options = (options || {});
	var reader = fs.createReadStream(filename, options);
	var remainder = '';
	reader.on('data', function (data) {
		var start = 0;
		for (var i = 0; i < data.length; i++) {
			if (data[i] === 10) {
				self.emit('line', remainder + data.slice(start, i).toString());
				remainder = '';
				start = i + 1;
			}
		}
		if (start < data.length) {
			remainder = data.slice(start);
		}
	});
	reader.on('end', function () {
		self.emit('end');
	});
}

util.inherits(LineReader, events.EventEmitter);

module.exports = function (filename, options) {
	return new LineReader(filename, options);
}
