var target = __dirname + '/../../root/js/src/renderer.js';
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname + '/../../root/js',
	nodeRequire: require,
	paths: {
		jquery: require('jquery'),
	},
});

requirejs([target], function (Renderer) {
	module.exports = {
		setUp: function (callback) {
			callback();
		},
		tearDown: function (callback) {
			callback();
		},
		createRenderer: function (test) {
			var renderer = Renderer.extend({
				about: { name: "MyRenderer" },
				render: function () {}
			});
			test.equals(renderer, Renderer.MyRenderer);
			test.done();
		},
		createRendererWithoutAbout: function (test) {
			test.doesNotThrow(function () {
				Renderer.extend({ render: function () {} });
			}, null, "Should be able to create a non-registered Renderer");
			test.done();
		},
	};
});
