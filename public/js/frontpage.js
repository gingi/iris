require(["jquery", "underscore", "backbone"], function ($, _, Backbone) {
    function li(content) { return $("<li>").append(content); }
    function a(link, text) { return $("<a>", { href: link }).html(text); }
    
    $("#nav")
        .append(li(a("#renderer/manhattan", "Manhattan")))
        .append(li(a("#widget/pcoords", "Pcoords")))
        .append(li(a("#widget/RegulatoryNetwork", "Regulatory Network")))
        .append(li(a("#renderer/forceDirectedGraph", "Force-directed Graph")))
    
    function pair(k, v) {
        var str =
            $("<span>").html("<strong>" + k + "</strong> ")
                .append($("<span>").addClass("muted").text(v)).append("<br/>");
        return str;
    }
    function header(about) {
        return $("<div>").addClass("well")
            .append(pair("Widget", about.title))
            .append(pair("Author", about.author))
            .append(pair("Description", about.description));
    }

    function show(component, fn) {
        $("#content").empty().append(header(component.about));
        require(["util/viewport"], function (Viewport) {
            var viewport = new Viewport({
                parent: $("#content")
            });
            fn(viewport);
        });
    }

    var Router = Backbone.Router.extend({
        routes: {
            "widget/:name"   : "widget",
            "renderer/:name" : "renderer",
            "*action"        : "default"
        },
        widget: function (name) {
            require(["widgets/" + name], function (Widget) {
                var widget = new Widget();
                console.log("Showing %s:", name, widget.about);
                show(widget, function (element) {
                    widget.display(element);
                });
            })
        },
        renderer: function (name) {
            require(["renderers/" + name], function (Renderer) {
                var renderer = new Renderer();
                console.log("Renderer", renderer);
                renderer.setData(renderer.exampleData());
                show(renderer, function (element) {
                    renderer.render({ element: element });
                })
            });
        },
        default: function () {
        }
    });
    
    var router = new Router;
    Backbone.history.start();
});