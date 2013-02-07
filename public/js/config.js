requirejs.config({
    baseUrl: "/js",
    paths: {
        columnfilter: "DataTables/extras/ColumnFilterWidgets"
    },
    shim: {
        jquery:      { exports: "$" },
        d3:          { exports: "d3" },
        underscore:  { exports: "_" },
        colorbrewer: { exports: "colorbrewer"},
        backbone:    {
            exports: "Backbone",
            deps: [ "underscore", "jquery" ]
        },
        "backbone.localstorage": {
            exports: "Backbone",
            deps: [ "backbone" ]
        },
        "jquery.dataTables": {
            deps: [ "jquery" ],
            exports: "$",
            init: function ($) {
                console.log("Hello");
                return $.fn.dataTableExt;
            }
        },
        columnfilter: {
            deps: [ "jquery.dataTables" ]
        },
        "util/spin":  { exports: "Spinner" }
    },
})
