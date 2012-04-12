// Set of client-side stubs to replicate behavior of client resources.

exports.documentStub = (function () {
    var elements = {};
    var createdElements = [];
    var stub = {};
    stub.setElement = function (id, elem) {
        elements[id] = elem;
    };
    stub.clearElements = function () {
        for (var elt in elements) {
            delete elements[elt];
        }
        elements = {};
    };
    stub.findElement = function (id) {
        return elements[id]; 
    };
    stub.Element = function Element() {
        var that = { children: [] };
            
        that.appendChild = function (child) {
            that.children.push(child);
        };
            
        that.removeChild = function (child) { };
            
        that.add = that.appendChild;
        return that;
    };
    stub.lastCreatedElement = function () {
        return createdElements[createdElements.length - 1];
    };
    stub.clearDocument = function () {
        stub.clearElements();
        createdElements = [];
    };
    return {
        Stub: stub,
        
        // Stubbed methods
        getElementById: function (id) {
            if (elements[id] == null) {
                elements[id] = stub.Element();
            }
            return elements[id];
        },
        createElement: function (tag) {
            var node = stub.Element();
            createdElements.push(node);
            return node;
        },
    };
})();

exports.jQueryStub = (function () {
    var stub       = {};
    stub.ajaxSetup = function () { };
    stub.ajax      = function () { };
    stub.getJSON   = function () { };
    stub.fn        = {};
    stub.when = stub.then = function () { return stub; };
    return stub;
})();