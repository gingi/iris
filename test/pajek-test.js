var pajek = require(__dirname + '/../src/parsers/pajek');

exports.realParse = function (test) {
    var fixture = __dirname + '/fixtures/example.pajek';
    var expectedJSON = require(__dirname + '/fixtures/example.pajek.json');
    pajek.parse(fixture, function (network) {
        test.deepEqual(expectedJSON, network.json());
        test.done();        
    });
}

exports.simpleParse = function (test) {
    var fixture = __dirname + '/fixtures/example-small.pajek';
    var expectedJSON = require(__dirname + '/fixtures/example-small.pajek.json');
    pajek.parse(fixture, function (network) {
        test.deepEqual(expectedJSON, network.json());
        test.done();
    });
}
