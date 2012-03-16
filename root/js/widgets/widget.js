// widget.js

if (!Iris) {
    var Iris = {};
}
Iris.Widget = Widget();

function Widget() {
    function createWidget(spec) {
        var widgetDiv;
        var defaultFunction = function (f) {
            if (spec && spec[f]) {
                if (typeof spec[f] === 'function') {
                    return spec[f];
                } else {
                    throw "Parameter " + f + " must be a function, not a " +
                         typeof spec[f] + "!";
                }
            } else {
                return function () {
                    throw "Function " + f + "() must be implemented";
                };
            }
        };
        var widget = {};
        widget.display = defaultFunction("display");
        widget.div = function (divId) {
            widget.divId = divId;
            return widget;
        };
        widget.divElement = function () {
            if (!widget.divId) {
                throw "Widget's div is not defined!";
            }
            return document.getElementById(widget.divId);
        };
        widget.getJSON = function (path, callback) {
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
            return widget;
        };
        return widget;
    }
    
    var WidgetSingleton = {};
    
    WidgetSingleton.create = function (spec) {
        if (!spec || !spec.about) {
            throw "'about' callback is missing";
        }
        var widgetName = spec.about()["name"];
        if (!widgetName) {
            throw "Widget name ('name') is a " +
                "required return parameter of 'about'";
        }
        var newWidget = createWidget(spec);
        if (WidgetSingleton[spec.name]) {
            console.log("Warning: Overwriting existing widget [" +
                 widgetName + "]!");
        }
        WidgetSingleton[widgetName] = newWidget;
        return newWidget;
    };

    return WidgetSingleton;
}
