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
require(['jquery', 'backbone', 'underscore', 'charts/bar'],
    function ($, Backbone, _, BarChart) {
    var Genome = Backbone.Model.extend({
        defaults: { name: "" },
        url: function () { return "/data/genome/" + this.id + "/chromosomes"; },
        parse: function (data) {
            this.set('chromosomes', data);
        }
    });
    
    var vis;
    var $hud;
    var View = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            $hud = $("#infoBox");
        },
        render: function () {
            $(this.el).empty();
            var chartData = [];
            var chromosomes = this.model.get('chromosomes');
            for (var chr in chromosomes) {
                var len = parseInt(chromosomes[chr]);
                if (len > 1e6)
                    chartData.push({ x: chr, y: len });
            }
            vis = new BarChart("#" + this.el.id, {
                xScale: "ordinal",
                yScale: "exponential",
                yTitle: "Length"
            });
            vis.setData(chartData);
            vis.display();
            return this;
        },
    });    

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (genomeId) {
            var $barchart = $("<div>")
                .attr("id", "chart")
                .css("height", "400px")
                .css("width", "400px");
            $("#container").empty().append($barchart);
            var genome = new Genome;
            genomeId = (genomeId || 'kb|g.22476');
            genome.set({id: genomeId});
            var view = new View({ model: genome, el: $barchart });
            genome.fetch();
        },
    });
    var router = new Router;
    Backbone.history.start();
});