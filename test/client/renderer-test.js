var target = __dirname + '/../../root/js/renderers/renderer.js';
var documentStub;
var Iris;

module.exports = {
    setUp: function (callback) {
        var sandbox = require('nodeunit').utils.sandbox;
        documentStub = require(__dirname + '/stubs.js').documentStub;
        var context = sandbox(target, {
            console: console,
            document: documentStub
        });
        Iris = context.Iris;
        callback();
    },
    tearDown: function (callback) {
        delete Iris.Renderer;
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
    }
};
