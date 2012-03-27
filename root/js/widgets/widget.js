/* widget.js
 * 
 * Author: Shiran Pasternak
 *
 * Creation:
 *
 *     var widget = Iris.Widget.create({
 *         about: { name: "GeneGODistribution" }
 *     });
 *     widget.view({
 *         div: 'someDivID',
 *         renderer: Iris.Renderer.Histogram,
 *         dataPath: '/some/path'
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
    var layout = [];
        
    // Private members
    var widgetDiv = null;
                
    function setWidgetDiv() {
        widgetDiv = document.getElementById(widget.divId);
    }
    
    // Private utility functions
    function clearNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    
    function setContents(node, content) {
        if (typeof content === 'string') {
            node.innerHTML = content;
        } else if (content != null) {
            node.appendChild(content);
        }
    }

    function processElementRenderer(element) {
        var renderer = element.renderer;
        
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
            element.render = function (divId, data) {
                var transformed = element.transform(data);
                return renderer.render(divId, transformed);
            };
        } else {
            element.render = renderer.render;
        }
        return element;
    }

    // Protected members
    if (spec.display != null) {
        if (typeof spec.display != 'function') {
            throw "Parameter 'display:' must be a function, not a " +
                 typeof spec.display + "!";
        }
        widget.display = spec.display;
    } else {
        widget.display = function () {
            throw "display() is not implemented!";
        };
    }
    
    widget.div = function (divId) {
        widget.divId = divId;
        setWidgetDiv();
        return widget;
    };
    
    var componentDisplayAdded = false;
    widget.view = function (element) {
        layout.push(processElementRenderer(element));
        
        // Dynamically switch to component-based display
        if (componentDisplayAdded == false) {
            widget.display = function (args) {
                var div = widget.divElement();
                clearNode(div);
                jQuery.ajaxSetup({ async: false });
                for (var i = 0; i < layout.length; i++) {
                    var element = layout[i];
                    var node = document.createElement('div');
                    node.id = widget.divId + '-child' + (i+1);
                    div.appendChild(node);
                    if (element.dataPath) {
                        Iris.getJSON(element.dataPath, function (json) {
                           setContents(node, element.render(json));
                        });
                    } else {
                        setContents(node, element.render());
                    }
                }
                jQuery.ajaxSetup({ async: true });
            };
            componentDisplayAdded = true;
        }
        return widget;
    };
        
    widget.divElement = function () {
        if (widgetDiv == null) {
            throw "Widget's div is not defined!";
        }
        return widgetDiv;
    };
        
    widget.getJSON = function (path, callback) {
        Iris.getJSON(path, callback);
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

    var my = {};
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
