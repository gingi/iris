/* widget.js
 * 
 * Author: Shiran Pasternak
 *
 * Creation:
 *
 *     Iris.Widget.create({
 *         about: { name: "GeneGODistribution" },
 *         layout: function (theLayout) {
 *              theLayout.append({
 *                  div: 'someDivID',
 *                  renderer: Iris.Renderer.Histogram,
 *                  dataPath: '/some/path'
 *              });
 *         }
 *     });
 *
 * Usage:
 *
 *     Iris.Widget.GeneGODistribution.div('divId').display();
 *
 * Copyright (c) 2012 Ware Lab, Cold Spring Harbor Laboratory
 */

if (!Iris) { var Iris = {}; }
Iris.Widget = (function () {
    
function createWidget(spec, my) {
    var widget = {};
        
    // Private members
    var widgetDiv;
                
    function setWidgetDiv() {
        widgetDiv = document.getElementById(widget.divId);
    }

    function processElementRenderer(element) {
        var renderer = element.renderer;
        if (element.dataPath == null) {
            throw "'dataPath:' is required to render layout.";
        }
        
        // If no renderer, wrap one around the 'render:' callback
        if (renderer == null) {
            if (element.render == null) {
                throw "'renderer:' or 'render:' is required.";
            }
            if (typeof element.render != 'function') {
                throw "'render:' must be a function.";
            }
            renderer = element.renderer = Iris.Renderer.create({
                render: element.render
            });
        } else if (typeof renderer == 'string') {
            var renderModule = Object.create(Iris.Renderer[renderer]);
            if (renderModule == null) {
                throw "Renderer " + renderer +
                    " is not registered with Iris.Renderer";
            }
            element.renderer = renderer = renderModule;
        }
        if (renderer.render == null) {
            throw "Renderer " + renderer +
                " does not have a render() callback.";
            
        }
        if (typeof renderer.render != 'function') {
            throw "Object " + element.renderer + ".render is not a function.";
        }
        if (element.transform) {
            if (typeof element.transform != 'function') {
                throw "transform: must be a function.";
            }
            element.render = function (data) {
                var transformed = element.transform(data);
                return renderer.render(transformed);
            };
        } else {
            element.render = renderer.render;
        }
    }

    function buildDisplayFromLayout() {
        var renderElements = [];
        var widgetLayout = (function () {
            return {
                append: function (element) {
                    processElementRenderer(element);
                    renderElements.push(element);
                }
            };
        })();
        spec.layout(widgetLayout);
        widget.display = function (args) {
            for (var i = 0; i < renderElements.length; i++) {
                var element = renderElements[i];
                element.renderer.div(widget.divId);
                widget.getJSON(element.dataPath, function (json) {
                    element.render(json);
                });
            }
        };
    }

    // Protected members
    if (spec.display == null) {
        if (spec.layout != null && typeof spec.layout == 'function') {
            buildDisplayFromLayout();
        } else {
            widget.display = function (args) {
                var renderer = Iris.Renderer[my.renderer];
                renderer.render(args);
            };
        }
    } else {
        if (typeof spec.display != 'function') {
            throw "Parameter 'display:' must be a function, not a " +
                 typeof spec.display + "!";
        }
        widget.display = spec.display;
    }

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
    if (typeof spec.about == 'function') {
        widgetSetting = function (key) {
            return spec.about()[key];
        };
    } else if (typeof spec.about == 'object') {
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
    var renderers = widgetSetting("renderers");
    var my = {};
    if (renderers) {
        my.renderer = renderers["default"];
    }
    var newWidget = createWidget(spec, my);

    if (WidgetSingleton[spec.name]) {
        console.log(
            "Warning: Overwriting existing widget [" + widgetName + "]!");
    }
    WidgetSingleton[widgetName] = newWidget;
    return newWidget;
};

return WidgetSingleton;

})();
