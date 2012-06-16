define(["src/util"], function (Util) {
	var Widget = {};
    Widget.extend = function (spec) {
        spec = (spec || {});
        var about;
        switch (typeof spec.about) {
            case 'function' : about = spec.about();  break;
            case 'object'   : about = spec.about;    break;
            default         : about = {};            break;
        };

        if (spec.setup && typeof spec.setup !== 'function') {
            throw "setup() must be a function returning a string.";
        }
        
        var widget = Util.extend({}, spec);
        Util.extend(widget, {
            renderers: {},
            target: function (target) {
                widget.targetElement = target;
                return widget;
            },
            create: function (element, args) {
                var widgetInstance = {
                    about: about
                };
                Util.extend(widgetInstance, widget);
				widgetInstance.display(element, args);
                return widgetInstance;
            },
            setup: function (args) { return [] },
            display: function () {},
        });
        Util.extend(widget, Widget);
        if (about.name) {
            Widget[about.name] = widget;
        }
        return widget;
    };
    return Widget;
});