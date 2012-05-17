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

    }
};
