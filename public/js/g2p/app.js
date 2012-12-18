requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        underscore: { exports: '_' },
        backbone:   {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        }
    },
})
require(['jquery', 'backbone', 'underscore', 'g2p/manhattan', 'util/hud'],
    function ($, Backbone, _, ManhattanPlot, HUD) {
    var Trait = Backbone.Model.extend({
        defaults: { name: "" },
        urlRoot: "/data/trait",
    });
    
    var vis;
    var $hud;
    function row(tb, key, val) {
        if (!val) return;
        tb.append($("<tr>")
            .append($("<th>").html(key))
            .append($("<td>").html(val))
        );
    }
    var AppView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            $hud = $("#infoBox");
        },
        render: function () {
            $("#datavis").empty();
            vis = new ManhattanPlot("#datavis");
            vis.setData({
                variations:  this.model.get('variations'),
                chromosomes: this.model.get('chromosomes'),
                maxscore:    this.model.get('maxscore')
            });
            vis.display();
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                var tbody = $("<tbody>");
                $hud.empty();
                $hud.append($("<table>").append(tbody));
                row(tbody, "P<i>min</i>", scoreA.toFixed(2));
                row(tbody, "P<i>max</i>", scoreB.toFixed(2));
                tbody = $("<tbody>");
                $hud.append($("<table>")
                    .append($("<thead>")
                        .append($("<th>").text("Chromosome"))
                        .append($("<th>").text("Start"))
                        .append($("<th>").text("End"))
                    )
                    .append(tbody));
                ranges.forEach(function (range) {
                    var tr = $("<tr>");
                    range.forEach(function (r) {
                        tr.append($("<td>").text(r));
                    })
                    tbody.append(tr);
                });
                //             ))
                // hud.show("P-values: " + scoreA.toFixed(2) + " " +
                //     scoreB.toFixed(2));
                $hud.fadeIn();
            });
            vis.on("pinpoint", function () { $hud.fadeOut(); });
            return this;
        },
    });    

    var App;
    
    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (traitId) {
            var trait = new Trait;
            traitId = (traitId || 'kb|g.22476.trait.3');
            trait.set({id: traitId});
            App = new AppView({ model: trait });
            trait.fetch({ data: { p: 0.1 } });
        },
    });
    var router = new Router;
    Backbone.history.start();
});