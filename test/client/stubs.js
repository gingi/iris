// Set of client-side stubs to replicate behavior of client resources.

exports.documentStub = (function () {
    function Element() {
        var that = { children: [] };
        that.appendChild = function (child) {
            that.children.push(child);
        };
        that.add = that.appendChild;
        return that;
    };
    
    var elements = {};
    return {
        findElement: function (id) {
            return elements[id]; 
        },
        getElementById: function (id) {
            if (elements[id] == null) {
                elements[id] = Element();
            }
            return elements[id];
        },
        createElement: function (id) {
            elements[id] = Element();
            return elements[id];
        },
        clearElements: function () {
            for (var elt in elements) {
                delete elements[elt];
            }
            elements = {};
        }
    };
})();

