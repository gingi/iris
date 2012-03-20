var target = __dirname + '/../../root/js/renderers/renderer.js';
var documentStub;
var Iris;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        documentStub = require(__dirname + '/stubs.js').documentStub;
        documentStub.clearElements();
        var context = sandbox(target, {
            console: console,
            document: documentStub
        });
        Iris = context.Iris;
        callback();
    },
    tearDown: function (callback) {
        // delete Iris.Renderer;
        delete Iris;
        callback();
    },
    createRenderer: function (test) {
        var renderer = Iris.Renderer.create({
            about: { name: "MyRenderer" },
            render: function () {}
        });
        test.equals(renderer, Iris.Renderer.MyRenderer);
        test.done();
    },
    createRendererWithoutAbout: function (test) {
        test.doesNotThrow(function () {
            Iris.Renderer.create({ render: function () {} });
        }, null, "Should be able to create a non-registered Renderer");
        test.done();
    },
    dropDownRenderer: function (test) {
        var renderer = Iris.Renderer.DropDown;
        var children;

        documentStub.clearElements();
        renderer.render(documentStub.createElement('someDiv'));
        test.equal(0, documentStub.findElement('select').children.length);
        
        documentStub.clearElements();
        renderer.render(documentStub.createElement('someDiv'), [
            { name: 'a', value: 'x' },
            { name: 'b', value: 'y' }
        ]);
        children = documentStub.findElement('select').children;
        test.equal(2, children.length);
        test.equal('a', children[0].text); test.equal('x', children[0].value);
        test.equal('b', children[1].text); test.equal('y', children[1].value);
        test.done();
    }
};
