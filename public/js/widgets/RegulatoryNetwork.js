define(["app/widget"], function (widget) {
    widget.about = {
		title: "Regulatory Network",
        name: "RegulatoryNetwork",
        author: "Andrew Olson"
    };

	widget.display = function (element, args) {
		args = (args || {});
		var myDiv = $(element);
		myDiv.append('network widget');
    };

	return widget;
});
