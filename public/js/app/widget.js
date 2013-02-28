define(["app/core"], function (Iris) {
    var Widget = Iris.Widget = {
        about: {
            name: "base",
            author: "shanje",
            description: "Widget base class"
        },
        display: function (settings) {
            throw Error(this.about.name + ": display() function not implemented");
        }
    };
    return Widget;
});
