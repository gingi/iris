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
require(['jquery', 'backbone', 'underscore', 'g2p/manhattan'],
    function ($, Backbone, _, ManhattanPlot) {
    var Trait = Backbone.Model.extend({
        defaults: { name: "" },
        urlRoot: "/data/trait",
    });
    
    var BP2PX = 2.5e5;
    var vis;
    var $hud;
    function row(tb, key, val) {
        if (!val) return;
        tb.append($("<tr>")
            .append($("<th>").html(key))
            .append($("<td>").html(val))
        );
    }
    function genomePixelWidth(chromosomes) {
        var genomeLength = 0;
        chromosomes.forEach(function (c) { genomeLength += c[1] });
        return Math.floor(genomeLength / BP2PX);
    }
    var ManhattanView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.$el.css("position", "relative")
            $hud = $("#infoBox");
        },
        render: function () {
            var self = this;
            var $oldVis = this.$el.find(".manhattan");
            var $newVis = $("<div>")
                .attr("class", "manhattan")
                .css("width",
                    Math.min(self.$el.width()-80,
                        genomePixelWidth(self.model.get('chromosomes'))))
                .css("height", "400px")
                .css("position", "absolute");
            $newVis.append($("<h4>").text(this.model.id));
            self.$el.append($newVis);
            
            vis = new ManhattanPlot($newVis);
            vis.setData({
                variations:  this.model.get('variations'),
                chromosomes: this.model.get('chromosomes'),
                maxscore:    this.model.get('maxscore')
            });
            vis.display();
            if ($oldVis.length > 0) {
                $oldVis.fadeOut(function () {
                    $newVis.fadeIn();
                    $oldVis.remove();
                 });
            } else {
                $newVis.fadeIn();
            }
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                var tbody = $("<tbody>");
                $hud.empty();
                $hud.append($("<table>").append(tbody));
                row(tbody, "-log(p)<sub><i>max</i></sub>", scoreA.toFixed(2));
                row(tbody, "-log(p)<sub><i>min</i></sub>", scoreB.toFixed(2));
                $.ajax({
                    url: '/data/trait/' + self.model.id + '/genes',
                    dataType: 'json',
                    data: {
                        pmin: Math.pow(10, -scoreA),
                        pmax: Math.pow(10, -scoreB),
                        locations: ranges
                    },
                    success: function (json) {
                        row(tbody, "genes", json.length);
                        $hud.fadeIn();
                    }
                })
            });
            vis.on("pinpoint", function () { $hud.fadeOut(); });
            return this;
        },
    });    

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (traitId) {
            var trait = new Trait;
            traitId = decodeURIComponent(traitId || 'kb|g.22476.trait.3');
            trait.set({id: traitId});
            var mview = new ManhattanView({ model: trait, el: $("#container") });
            trait.fetch({ data: { p: 16 } });
        },
    });
    var router = new Router;
    $("#nav-search button").on("click", function () {
        router.navigate("#" + $("#nav-search input").val(), true);
    });
    Backbone.history.start();
});
