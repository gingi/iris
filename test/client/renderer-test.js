var target = __dirname + '/../../root/js/src/renderer.js';
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname + '/../../root/js',
	nodeRequire: require,
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
				Iris.Renderer.extend({ render: function () {} });
			}, null, "Should be able to create a non-registered Renderer");
			test.done();
		},
		dropDownRenderer: function (test) {
			var renderer = Renderer.DropDown;
			var elem;
	
			documentStub.Stub.clearElements();
			elem = renderer.render();
			test.equal(0, elem.children.length);
			
			documentStub.Stub.clearElements();
			elem = renderer.render([
				{ name: 'a', value: 'x' },
				{ name: 'b', value: 'y' }
			]);
			var children = elem.children;
			test.equal(2, children.length);
			test.equal('a', children[0].text); test.equal('x', children[0].value);
			test.equal('b', children[1].text); test.equal('y', children[1].value);
			test.done();
		}
	};
});
