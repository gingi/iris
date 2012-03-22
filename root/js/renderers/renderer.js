/* renderer.js
 * 
 * Author: Shiran Pasternak
 *
 * Creation:
 *
 *     Iris.Renderer.create({
 *         about: { name: "Histogram" },
 *         render: function (data) { ... }
 *     });
 *
 * Usage:
 *
 *     Iris.Renderer.Histogram.render('divId', data);
 *
 * Copyright (c) 2012 Ware Lab, Cold Spring Harbor Laboratory
 */

if (!Iris) { var Iris = {}; }
Iris.Renderer = (function () {
    function createRenderer(spec, my) {
        var renderer = {};
        if (spec.render != null && typeof spec.render == 'function') {
            renderer.render = spec.render;
        }
        return renderer;
    }
    
    /* TODO: Singleton pattern also used by Iris.Widget. Extract pattern 
     * into iris.js? 
     */
    var RendererSingleton = {};
    RendererSingleton.create = function (spec) {
        var newRenderer = createRenderer(spec, {});
        if (spec && spec.about) {
            var setting;
            if (typeof spec.about == 'function') {
                setting = function (key) {
                    return spec.about()[key];
                };
            } else if (typeof spec.about == 'object') {
                setting = function (key) {
                    return spec.about[key];
                };
            } else {
                throw "about: Must be a function or an associative array";
            }
            var rendererName = setting("name");
            if (!rendererName) {
                throw "Renderer name ('name') is a " +
                    "required return parameter of 'about'";
            }

            if (RendererSingleton[spec.name]) {
                console.log(
                    "Warning: Overwriting existing renderer [" +
                    rendererName + "]!");
            }
            RendererSingleton[rendererName] = newRenderer;
        }
        return newRenderer;
    };
    return RendererSingleton;
})();

Iris.Renderer.create(function () {
    function option(args) {
        var opt = document.createElement('option');
        opt.value = args.value;
        opt.text = args.name;
        if (args.selected) {
            opt.selected = true;
        }
        return opt;
    }
    return {
        about: { name: "DropDown" },
        render: function (divId, list) {
            var select = document.createElement('select');
            if (list != null) {
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    select.add(option(item), null);
                }
            }
            document.getElementById(divId).appendChild(select);
        }
    };
}());

Iris.Renderer.create(function () {
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;');
        return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    return {
        about: { name: "Syntax" },
        render: function (divId, json) {
            var str = JSON.stringify(json, undefined, 4);
            document.getElementById(divId)
                .appendChild(document.createElement('pre')).innerHTML =
                     syntaxHighlight(str);
        }
    };
}());
