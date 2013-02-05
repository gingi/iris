({
    dir: "../build",
    appDir: "../public",
    baseUrl: "js",
    mainConfigFile: "../public/js/config.js",
    namespace: "datavis",
    wrap: true,
    modules: [
        { name: "network/app" }
    ],
    optimize: "none"
})
