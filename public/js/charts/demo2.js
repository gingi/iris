requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        underscore: { exports: '_' },
        backbone:   {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        },
        'backbone.localstorage': {
            exports: 'Backbone',
            deps: [ 'backbone' ]
        },
        colorbrewer: { exports: 'colorbrewer' },
        "jquery.dataTables": [ 'jquery' ]
    },
})
require(['jquery', 'backbone', 'underscore', 'charts/bar'],
    function ($, Backbone, _, BarChart) {
        var demo = $("<div>").addClass("viewport").attr("id", "bar")
        .attr("data-title", "Emails to kbase-devel today")
        .height(400).width(400);
        $("#container")
            .append($("<div>").addClass("row")
                .append($("<div>").addClass("span4")
                    .append(demo)));
        var vis = new BarChart("#bar", {});
        vis.setData([
            { x: 'Shiran', y: 3 },
            { x: 'Bob',    y: 5 }
        ]);
        vis.display();
        return this;
});