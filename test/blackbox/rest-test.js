var http = require('http');

var options = {
      host: '127.0.0.1',
      port: 4747,
      path: '/',
      method: 'GET'
};


module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    testExample: function (test) {
        test.equals(this.foo, 'bar');
        test.done();
    },

    testBaseURL: function(test) {
        // Change the request options as needed             
        options.port = 4747;
        var req = http.get(options, function(res) {
            test.equals(res.statusCode, 200);
            test.done();
        });
        req.end();        

    },

    testServiceURL: function(test) {
    options.port = 4747;
    options.path = '/service';
    var req = http.get(options, function(res) {
        test.equals(res.statusCode,200);
        test.done();
    });
    req.end();

    },

    testServiceListURL: function(test) {
    options.port = 4747;
    options.path = '/service/list';
    var req = http.get(options, function(res) {
        test.equals(res.statusCode,200);
        test.done();
    });
    req.end();
    },

    testPhenotypes: function(test) {
        options.path = '/phenotypes';
        var req = http.get(options, function(res) {
            test.equals(res.statusCode,200);
            res.on('data', function(data) {
                data = JSON.parse(data);
                // Make sure we return an array
                test.ok(Array.isArray(data));
                // Make sure array has data
                test.ok(data.length > 1);
                // Test for a sample object (this may change later)
                test.ok(data.indexOf('LDV') > -1);
                test.done();
            });

        });
        req.end();
    }

};
