define(["src/core"], function (Iris) {
	var Widget = Iris.Widget = {
		renderers: {},
		target: function (target) {
			widget.targetElement = target;
			return widget;
		},
		view: function () {},
		create: function (element, args) {
			var widgetInstance = {
				about: about
			};
			Util.extend(widgetInstance, widget);
			widgetInstance.display(element, args);
			return widgetInstance;
		},
		setup: function (args) { return [] },
		display: function () { throw Error("No renderers defined"); },
		extend: Iris.extend
	};

    return Widget;
});