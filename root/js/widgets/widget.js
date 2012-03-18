// widget.js

if (!Iris) {
    var Iris = {};
}
Iris.Widget = Widget();

function Widget() {
    function createWidget(spec) {
        var widget = {};
        
        // Private members
        var widgetDiv;
        
        function defaultFunction(fn) {
            if (spec && spec[fn]) {
                if (typeof spec[fn] === 'function') {
                    return spec[fn];
                } else {
                    throw "Parameter " + fn + " must be a function, not a " +
                         typeof spec[fn] + "!";
                }
            } else {
                return function () {
                    throw "Function " + fn + "() must be implemented";
                };
            }
        }
        
        function setWidgetDiv() {
            widgetDiv = document.getElementById(widget.divId);
        }

        // Protected members
        widget.display = defaultFunction("display");
        widget.div = function (divId) {
            widget.divId = divId;
            setWidgetDiv();
            return widget;
        };
        
        widget.divElement = function () {
            if (!widgetDiv) {
                throw "Widget's div is not defined!";
            }
            return widgetDiv;
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
            throw "'about' parameter is missing";
        }
        var widgetSetting;
        if (typeof spec.about === 'function') {
            widgetSetting = function (key) {
                return spec.about()[key];
            };
        } else if (typeof spec.about === 'object') {
            widgetSetting = function (key) {
                return spec.about[key];
            };
        } else {
            throw "about: Must be either a function or an associative array";
        }
        var widgetName = widgetSetting("name");
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
