require(["jquery", "underscore", "backbone", "util/viewport"],
function ($, _, Backbone, Viewport) {
    function li(content) { return $("<li>").append(content); }
    function a(link, text) { return $("<a>", { href: link }).html(text); }
    
    $("#nav")
        .append(li(a("#renderer/manhattan", "Manhattan")))
        .append(li(a("#renderer/pcoords", "Pcoords")))
        .append(li(a("#widget/bubbles", "Bubble Plot")))
        .append(li(a("#renderer/forceDirectedGraph", "Force-directed Graph")))
        // .append(li(a("#widget/hypomethylation", "Conservation vs. Hypomethylation")));

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
            require(["/js/widgets/" + name + ".js"], function (Widget) {
                $("#content").empty();
                var widget = new Widget({ element: $("#content") });
                $("#content").prepend(header(widget.about));
                var exampleData = widget.exampleData();
                if (exampleData !== undefined) {
                    widget.setData(exampleData);
                }
                widget.display();
            });
        },
        renderer: function (name) {
            require(["renderers/" + name], function (Renderer) {
                $("#content").empty();
                var viewport = new Viewport({ parent: $("#content") });
                var renderer = new Renderer({ element: viewport });
                $("#content").prepend(header(renderer.about));
                var exampleData = renderer.exampleData();
                if (exampleData !== undefined) {
                    renderer.setData(exampleData);
                }
                renderer.render();
            });
        },
        default: function () {
            $("#content").empty().append($("#index-template").html())
        }
    });

    var router = new Router();
    Backbone.history.start();
});