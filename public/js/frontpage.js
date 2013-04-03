require(["jquery", "underscore", "backbone", "util/viewport"],
function ($, _, Backbone, Viewport) {
    function li(content) { return $("<li>").append(content); }
    function a(link, text) { return $("<a>", { href: link }).html(text); }
    
    $("#nav")
        .append(li(a("#renderer/manhattan", "Manhattan")))
        .append(li(a("#renderer/pcoords", "Pcoords")))
        .append(li(a("#widget/RegulatoryNetwork", "Regulatory Network")))
        .append(li(a("#renderer/forceDirectedGraph", "Force-directed Graph")));
    
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

    function show(Component, fn) {
        $("#content").empty();
        var viewport = new Viewport({
            parent: $("#content")
        });
        var component = new Component({ element: viewport });
        $("#content").prepend(header(component.about));
        fn(component);
    }

    var Router = Backbone.Router.extend({
        routes: {
            "widget/:name"   : "widget",
            "renderer/:name" : "renderer",
            "*action"        : "default"
        },
        widget: function (name) {
            require(["widgets/" + name], function (Widget) {
                show(Widget, function (widget) { widget.display(); });
            });
        },
        renderer: function (name) {
            require(["renderers/" + name], function (Renderer) {
                show(Renderer, function (renderer) {
                    var exampleData = renderer.exampleData();
                    if (exampleData) {
                        renderer.setData(exampleData);
                    }
                    renderer.render();
                });
            });
        },
        default: function () {
        }
    });

    var router = new Router();
    Backbone.history.start();
});