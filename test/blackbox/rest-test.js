var http = require('http');

var options = {
      host: '127.0.0.1',
      port: 4747,
      path: '/',
      method: 'GET'
};

// global object that allows us to keep track of how many http requests we make,
// and remember which urls failed (not currently used).  It's an object so we can
// add extra debug info in the future if needed
var serviceListURLstatus = {
    requestCounter: 0,
    failList: ''
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
    
    // test which gets the advertised list of services, then confirms that
    // we get a valid JSON response at each listed service URL
    //   todo:   i believe that this test will hang if there is no response
    //   at all from a particular request - so we should add a timeout that
    //   will fail the test
    //
    //   author: msneddon
    testServiceListLinksURLs: function(test) {

	// first try to connect at /service/list level
	options.path = '/service/list';
	var req = http.get(options, function(res) {

	    //once we hear back, make sure we are still good
	    test.equals(res.statusCode,200);
	    res.on('data', function(data) {
		// make sure we got something and there is something in it
		data = JSON.parse(data);
		test.ok(Array.isArray(data));
		test.ok(data.length > 1);
		// go through each of the advertised URLs that we found on the list of services
		for(k=0;k<data.length;k++) {
		    // console.log(k + ':' + data[k].path);
		    // check if the JSON provides a path, I think it should but might not so here's a warning
		    if(data[k].path==undefined) {
			console.log(' -- warning -- path attribute of a service/list JSON is undefined at pos:'+k);
			console.log('               object was: ' + JSON.stringify(data[k])); 
		    } else {
			// if we have a path in the object, then go there and check if we can get a valid 
			// response from the path, as we count the number of requests made
			var local_options = options;
			local_options.path = data[k].path;
			serviceListURLstatus.requestCounter++;
			//console.log('remembering the number of responses to be: ' + serviceListURLstatus.requestCounter);
			( function(path2service) {
			    var local_req = http.get(local_options, function(local_res) {
				test.equals(local_res.statusCode,200);
				local_res.on('data', function(data2) {
				    serviceListURLstatus.requestCounter--;
				    //console.log('response from request, waiting for ' + serviceListURLstatus.requestCounter + ' more responses');
				    try {
					data = JSON.parse(data2);
					console.log(' ** success ** retrieved JSON from ' + path2service);
				    } catch (e) {			    
					// we failed the test if we can't parse the data as a JSON
					console.log(' ** fail ** cannot retrieve JSON from ' + path2service);
					test.ok(false);
				    }
				    // if this was the last thing we are waiting for, then finish up the test
				    if(serviceListURLstatus.requestCounter==0) { test.done(); }
				});
			    });
			}) (data[k].path);
		    }
		}

	    });
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
