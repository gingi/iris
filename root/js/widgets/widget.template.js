define(["iris", "renderers/renderer.barchart"], function (Iris) {
    return Iris.Widget.extend({
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
});