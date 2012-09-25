define(["app/core"], function (Iris) {
    console.log("Defining Iris.Widget");
	var Widget = Iris.Widget = {
		renderers: {},
		target: function (target) {
			widget.targetElement = target;
			return widget;
		},
		view: function () {},
		setup: function (args) { return [] },
		display: function () { throw Error("No renderers defined"); },
    };
    Widget.create = Widget.display;

    return Widget;
});