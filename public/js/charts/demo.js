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

    var dropdownFactory = new DropDown({ container: "#nav" });
    var dropdown = dropdownFactory.create({
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
    
    function div(id) {
        return $("<div>")
            .attr("id", id)
            .addClass("viewport")
            .css("height", "400px")
            .css("width", "400px")
    }

    var charts = {
        barchart: {
            dataPoint: function (chromosomes, chr) { return { x: chr, y: chromosomes[chr] } },
            chartType: BarChart
        },
        piechart: {
            dataPoint: function (chromosomes, chr) { return [chr, chromosomes[chr]] },
            chartType: PieChart
        },
        tablesum: {
            dataPoint: function (chromosomes, chr) { return [ chr, chromosomes[chr] ] },
            chartType: Table,
            dataSpec: function (data) {
                return {
                    data: data,
                    columns: ['Chromosome', 'Length'],
                    filter: ['Chromosome']
                }
            }
        }
    }

    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (genomeId) {
            $("#container").empty();
            var genome = new Genome;
            genomeId = (genomeId || 'kb|g.22476');
            genome.set({id: genomeId});
            dropdown.select(genomeId);
            for (var elementId in charts) {
                var $div = div(elementId);
                $("#container").append($div);
                var View = ChartView.extend(charts[elementId]);
                var view = new View({ model: genome, el: $div });
            }
            genome.fetch();
        },
    });
    
    var router = new Router;
    Backbone.history.start();
});