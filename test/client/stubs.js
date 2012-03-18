// Set of client-side stubs to replicate behavior of client resources.

exports.documentStub = (function () {
    var elements = {};
    return {
        getElementById: function (id) {
            if (!elements[id]) {
                elements[id] = new Object();
            }
            return elements[id];
        }
    };
})();

