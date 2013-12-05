({
    baseUrl:        "../public/js",
    mainConfigFile: "../public/js/config.js",
    namespace:      "Iris",
    name:           "iris",
    create:         true,
    wrap: {
        start: "(function () {",
        end: [
            "    var wrapper = function (callback) {",
            "        wrapper.require   = Iris.require;",
            "        wrapper.requirejs = Iris.requirejs;",
            "        wrapper.define    = Iris.define;",
            "        Iris.require([",
            "            'iris/root', 'iris/renderer', 'iris/widget',",
            "            'util/viewport', 'charts/bar', 'renderers/table'",
            "        ], function (Root, Renderer, Widget, Viewport) {",
            "             wrapper.Widget   = Widget;",
            "             wrapper.Renderer = Renderer;",
            "             wrapper.Viewport = Viewport;",
            "             wrapper.Root     = Root;",
            "             callback(wrapper);",
            "        });",
            "    };",
            "    window.Iris = wrapper;",
            "    jQuery.noConflict(true);",
            " }());"
        ].join("\n")
    },
    paths: {
        requireLib: "require"
    },
    optimize: "none",
    include: [
        "requireLib",
        "renderers/heatmap",
        "renderers/manhattan",
        "renderers/network",
        "renderers/table",
        "charts/bar",
        "charts/pie",
        "util/dock",
        "util/dragbox",
        "util/dropdown",
        "util/spin",
        "util/progress",
        "util/hud",
        "util/viewport",
        "util/graph",
    ],
    onBuildRead: function (moduleName, path, contents) {
        if (moduleName == "util/spin") {
            return contents.replace(/\bdefine\b/g, "Iris.define");
        }
        return contents;
    }
})
