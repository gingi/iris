define(["../iris.js", "renderers/renderer.barchart"], function (Iris) {
    console.log("widget.template");
    Iris.Widget.extend({
        about: {
            name: "template",
            title: "Template Widget",
            author: "Bart Simpson"
        },
        display: function(target, args) {
            var renderer = Iris.Renderer.barchart;
            renderer.render({
                target: target,
                data: renderer.exampleData()
            });
        }
    });
    return Iris;
});