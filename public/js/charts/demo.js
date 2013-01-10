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
        colorbrewer: { exports: 'colorbrewer' },
        "jquery.dataTables": [ 'jquery' ]
    },
})
require(['jquery', 'backbone', 'underscore', 'charts/bar', 'charts/pie', 'renderers/table'],
    function ($, Backbone, _, BarChart, PieChart, Table) {
    var Genome = Backbone.Model.extend({
        defaults: { name: "" },
        url: function () { return "/data/genome/" + this.id + "/chromosomes"; },
        parse: function (data) {
            var chromosomes = {};
            for (var chr in data) {
                var len = parseInt(data[chr]);
                if (len > 1e6) {
                    chromosomes[chr] = len;
                }
            }
            this.set('chromosomes', chromosomes);
            return data;
        }
    });
    
    var vis;
    var PieView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('sync', this.render);
        },
        render: function () {
            $(this.el).empty();
            var chartData = [];
            var chromosomes = this.model.get('chromosomes');
            for (var chr in chromosomes) {
                chartData.push([ chr, chromosomes[chr] ]);
            }
            vis = new PieChart("#" + this.el.id, {});
            vis.setData(chartData);
            vis.display();
            return this;
        },
    });
    
    var BarView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('sync', this.render);
        },
        render: function () {
            $(this.el).empty();
            var chartData = [];
            var chromosomes = this.model.get('chromosomes');
            for (var chr in chromosomes) {
                chartData.push({ x: chr, y: chromosomes[chr] });
            }
            vis = new BarChart("#" + this.el.id, {});
            vis.setData(chartData);
            vis.display();
            return this;
        }
    });

    var TableView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('sync', this.render);
        },
        render: function () {
            $(this.el).empty();
            var data = [];
            var chromosomes = this.model.get('chromosomes');
            for (var chr in chromosomes) {
                data.push([ chr, chromosomes[chr] ]);
            }
            vis = new Table({ element: this.$el });
            vis.setData({
                data: data,
                columns: ['Chromosome', 'Length']
            });
            vis.display();
            return this;
        }
    });
    
    function div(id) {
        return $("<div>")
            .attr("id", id)
            .addClass("viewport")
            .css("height", "400px")
            .css("width", "400px")
    }

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (genomeId) {
            var $barchart = div("barchart");
            var $piechart = div("piechart");
            var $table    = div("tablesum");
            $("#container").empty()
                .append($barchart)
                .append($piechart)
                .append($table);
            var genome = new Genome;
            genomeId = (genomeId || 'kb|g.22476');
            genome.set({id: genomeId});
            var view = new BarView({ model: genome, el: $barchart });
            var piechart  = new PieView({ model: genome, el: $piechart });
            var tableview = new TableView({ model: genome, el: $table });
            genome.fetch();
        },
    });
    var router = new Router;
    Backbone.history.start();
});