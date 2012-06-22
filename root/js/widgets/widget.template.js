define(["iris"], function (Iris) {
    return Iris.Widget.extend({
        about: {
            name: "template",
            title: "Template Widget",
            author: "Bart Simpson"
        },
        setup: function () {
        	var r1 = Iris.renderer("barchart");
        	var r2 = Iris.renderer("renderer2");
        	r1.addListener(
        },
        display: function (target, args) {
            var renderer = Iris.Renderer.barchart;
            renderer.render({
                target: target,
                data: renderer.exampleData()
            });
        }
    });
});