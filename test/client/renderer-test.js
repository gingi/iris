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
    divCascades: function (test) {
        var element;
        var renderer = Iris.Renderer.create({
            about: { name: "MyRenderer" },
            render: function (data) {
                element = this.divElement();
            }
        });
        renderer.div("someDiv").render();
        
        // Ensure that the div set on the renderer is found by the document.
        test.equals(element, documentStub.getElementById("someDiv"));
        test.done();
    },
    dropDownRenderer: function (test) {
        var renderer = Iris.Renderer.DropDown;
        var children;

        documentStub.clearElements();
        renderer.div("someDiv").render();
        test.equal(0, documentStub.findElement('select').children.length);
        
        documentStub.clearElements();
        renderer.div("someDiv").render({ a: 'x', b: 'y' });
        children = documentStub.findElement('select').children;
        test.equal(2, children.length);
        test.equal('a', children[0].value); test.equal('x', children[0].text);
        test.equal('b', children[1].value); test.equal('y', children[1].text);
        test.done();
    }
};
