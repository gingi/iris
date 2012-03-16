// widget.js

if (!Iris) {
    var Iris = {};
    Iris.Widget = Widget();
}

function Widget() {
    var widget = function (spec) {
        var defaultFunction = function (f) {
            if (spec && spec[f]) {
                if (typeof spec[f] === 'function') {
                    return spec[f];
                } else {
                    throw "Parameter " + f + " must be a function!";
                }
            } else {
                return function () {
                    throw "Function " + f + "() must be implemented";
                }
            }
        };
        return {
            render: defaultFunction("render"),
            about: defaultFunction("about"),
            getJSON: function (path, callback) {
                var url = Iris.dataURI(path);
                $.ajax({
                    url: url,
                    dataType: 'json',
                    data: [],
                    success: callback,
                    error: function (event, request, settings) {
                        console.warn("AJAX error! ", event, request, settings);
                    }
                });
            }
        };
    };
    var that = {
        create: function (spec) {
            return widget(spec);
        }
    };

    return that;
}
