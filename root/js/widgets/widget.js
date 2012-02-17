/*
 * widget_prototype.js
 *
 * For now, just for documentation purposes, function prototypes that should
 * be implemented by widgets.
 */
function Widget(name) {
    this.name = name;
    Widget._widgets = {};
}

Widget.prototype.render = function(canvasId, args) {
    alert("Dude, this needs to be implemented, and shit.");
};

Widget.prototype.getManager = function() {
    return this.manager;
};

Widget.prototype.setManager = function(manager) {
    this.manager = manager;
};

Widget.prototype.getJSON = function(path, callback) {
    $.getJSON(DataServiceAPI + path, callback);
};

Widget.createWidget = function(name) {
    return new(Widget._widgets[name]);
};

Widget.registerWidget = function(name, widgetClass) {
    Widget._widgets[name] = widgetClass;
};

