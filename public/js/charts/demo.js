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
require(['jquery', 'backbone', 'underscore',
    'charts/bar', 'charts/pie', 'renderers/table',
    'util/dropdown'],
    function ($, Backbone, _, BarChart, PieChart, Table, DropDown) {
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

    var dropdown = new DropDown({ container: "#nav" });
    dropdown.create({
        name: "Genome",
        url: "/data/genome"
    }).fetch();
    
    var ChartView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('sync', this.render);
        },
        dataSpec: function (data) { return data; },
        render: function () {
            $(this.el).empty();
            var chartData = [];
            var chromosomes = this.model.get('chromosomes');
            for (var chr in chromosomes) {
                chartData.push(this.dataPoint(chromosomes, chr));
            }
            var vis = new this.chartType({ element: "#" + this.el.id });
            vis.setData(this.dataSpec(chartData));
            vis.display();
            return this;
        },
    });

    var PieView = ChartView.extend({
        dataPoint: function (chromosomes, chr) { return [chr, chromosomes[chr]] },
        chartType: PieChart
    });
    
    var BarView = ChartView.extend({
        dataPoint: function (chromosomes, chr) { return { x: chr, y: chromosomes[chr] } },
        chartType: BarChart
    });

    var TableView = ChartView.extend({
        dataPoint: function (chromosomes, chr) { return [ chr, chromosomes[chr] ] },
        chartType: Table,
        dataSpec: function (data) {
            return {
                data: data,
                columns: ['Chromosome', 'Length'],
                filter: ['Chromosome']
            }
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
            var view      = new BarView({ model: genome, el: $barchart });
            var piechart  = new PieView({ model: genome, el: $piechart });
            var tableview = new TableView({ model: genome, el: $table });
            genome.fetch();
        },
    });
    var router = new Router;
    Backbone.history.start();
});