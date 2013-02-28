({
    baseUrl:        "../public/js",
    mainConfigFile: "../public/js/config.js",
    namespace:      "iris",
    name:           "iris",
    create:         true,
    paths: {
        requireLib: "require"
    },
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
        "util/viewport"
    ]
})
