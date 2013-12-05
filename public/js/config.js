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
        bootstrap:    {                      deps: ["jquery"] },
        columnfilter: {                      deps: ["datatables"] },
        slider:       {                      deps: ["jquery"] },
        datatables:   {                      deps: ["jquery"] },
        revalidator:  { exports: "window.json" },
        jquery:       { exports: "jQuery" }
    },
})
