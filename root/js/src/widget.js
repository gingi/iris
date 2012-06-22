define(["src/core"], function (Iris) {
	var Widget = Iris.Widget = Iris.extend({
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

    return Widget;
});