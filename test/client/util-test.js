var target    = __dirname + '/../../root/js/src/util.js';
var requirejs = require('requirejs');

var testHash = { a: 9, b: 3, c: 27 };

requirejs([target], function (Util) {
	module.exports = {
		each: function (test) {
			var array = [ 1, 2, 3 ];
			var outArray = [];
			Util.each(array, function (item) {
				outArray.push(item);
			});
			test.deepEqual(array, outArray);
			test.done();
		},
		
		keys: function (test) {
			var keys = Util.keys(testHash);
			test.deepEqual(['a', 'b', 'c'], keys);
			test.done();
		},
		
		values: function (test) {
			var vals = Util.values(testHash);
			test.deepEqual([9, 3, 27], vals);
			test.done();
		},
		
		extend: function (test) {
			var obj = {
				n: 12,
				fn: function () { return this.n * 5 },
			};
			test.equals(60, obj.fn());
			var obj2 = Util.extend({ n: 7 }, obj);
			test.equals(35, obj2.fn());
			
			Util.extend(obj2, { fn2: function () { return 365 } });
			test.equals(365, obj2.fn2());
			test.done();
		},
	};
});