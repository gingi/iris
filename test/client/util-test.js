var target    = __dirname + '/../../root/js/src/util.js';
var requirejs = require('requirejs');

requirejs([target], function (Util) {
	var testHash = { a: 9, b: 3, c: 27 };

	module.exports = {
		eachTest: function (test) {
			var array = [ 1, 2, 3 ];
			var outArray = [];
			Util.each(array, function (item) {
				outArray.push(item);
			});
			test.deepEqual(array, outArray);
			test.done();
		},
		
		keysTest: function (test) {
			var keys = Util.keys(testHash);
			test.deepEqual(['a', 'b', 'c'], keys);
			test.done();
		},
		
		valuesTest: function (test) {
			var vals = Util.values(testHash);
			test.deepEqual([9, 3, 27], vals);
			test.done();
		},
		
		extendTest: function (test) {
			var obj = {
				n: 12,
				fn: function () { return this.n * 5 },
			};
			test.equals(60, obj.fn());
			var obj2 = Util.extend({ n: 7 }, obj);
			test.equals(35, obj2.fn(),
				"Expected the returned object to be extended");

			Util.extend(obj2, { fn2: function () { return 365 } });
			test.equals(365, obj2.fn2(),
				"Expected the input object to be extended in a void context");
				
			test.equals(60, obj.fn(),
				"Expected the original object to remain unchanged");
			test.done();
		},
	};
});