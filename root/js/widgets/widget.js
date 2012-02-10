/*
 * widget_prototype.js
 *
 * For now, just for documentation purposes, function prototypes that should
 * be implemented by widgets.
 */
function Widget(name) {
    this.name = name;
}

Widget.prototype.render = function(canvasId, args) {
    alert("Dude, this needs to be implemented, and shit.");
};

function register_widget() {}
