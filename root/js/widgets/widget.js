/*
 * widget_prototype.js
 *
 * For now, just for documentation purposes, function prototypes that should
 * be implemented by widgets.
 */
function Widget(name) {
    this.name = name;
}
Widget._widgets = {};

Widget.prototype.render = function(divId, args) {
    alert("render() is a virtual method and needs to be implemented.");
};

Widget.prototype.about = function(args) {
    alert("about() is a virtual method and needs to be implemented.");
};

Widget.prototype.getManager = function() {
    return this.manager;
};

Widget.prototype.setManager = function(manager) {
    this.manager = manager;
};

Widget.prototype.getJSON = function(path, callback) {
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
    // $.getJSON(url, function(data) { console.log("Hello???"); callback(data); });
};

Widget.createWidget = function(name) {
    return new(Widget._widgets[name]);
};

Widget.registerWidget = function(name, widgetClass) {
    Widget._widgets[name] = widgetClass;
};

