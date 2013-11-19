requirejs.config({
    baseUrl: "/js",
    paths: {
        columnfilter: "lib/DataTables/extras/ColumnFilterWidgets",
        datatables:   "lib/jquery.dataTables",
        slider:       "lib/bootstrap-slider",
        jquery:       "lib/jquery",
        d3:           "lib/d3",
        underscore:   "lib/underscore",
        revalidator:  "lib/revalidator",
        backbone:     "lib/backbone",
        "backbone.localstorage": "lib/backbone.localStorage",
        bootstrap:    "lib/bootstrap"
    },
    map: {
        "*":          { jquery: "noconflict" },
        "noconflict": { jquery: "jquery" }
    },
    shim: {
        d3:           { exports: "d3"          },
        underscore:   { exports: "_"           },
        colorbrewer:  { exports: "colorbrewer" },
        backbone:     { exports: "Backbone", deps: ["underscore", "jquery"] },
        bootstrap:    { deps: ["jquery"] },
        columnfilter: { deps: ["datatables"] },
        "backbone.localstorage":
            { exports: "Backbone", deps: ["backbone"] },
        slider:       { deps: ["jquery"] },
        datatables:   { deps: ["jquery"], exports: "jQuery.fn.dataTableExt" },
        revalidator:  { exports: "window.json" }
    }
})
