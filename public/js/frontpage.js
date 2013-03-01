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
                console.log("Showing %s:", name, Widget.about);
                show(Widget, function (element) {
                    Widget.display(element);
                });
            })
        },
        renderer: function (name) {
            require(["renderers/" + name], function (Renderer) {
                show(Renderer, function (element) {
                    Renderer.render({ element: element });
                })
            });
        },
        default: function () {
            console.log("Default route")
        }
    });
    
    var router = new Router;
    Backbone.history.start();
});