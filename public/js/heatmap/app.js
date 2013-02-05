require(['jquery', 'backbone', 'underscore', 'renderers/heatmap', 'util/viewport'],
function ($, Backbone, _, Heatmap, Viewport) {
    function randomData(num) {
        var genes = new Array(num);
        var matrix = [];
        for (var i = 0; i < num; i++) {
            genes[i] = 'Gene' + (i+1);
        }
        for (var i = num - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * i);
            var tmp  = genes[j];
            genes[j] = genes[i];
            genes[i] = tmp;
        }
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                if (i != j) {
                    matrix.push([i, j, Math.random()]);
                }
            }
        }
        return { rows: genes, matrix: matrix };
    }
    var RandomHeatmapModel = Backbone.Model.extend({
        initialize: function () {
            var NUM_GENES = 10;
            this.set(randomData(NUM_GENES));
        },
    })
    var View = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('sync', this.render);
        },
        render: function () {
            var heatmap = new Heatmap({ element: this.$el });
            heatmap.setData(this.model.toJSON());
            heatmap.render();
        }
    });
    
    var randomView = new View({
        el: new Viewport({
            parent: $("#datavis"),
            width: 150,
            height: 150,
            title: "Random Heatmap"
        }),
        model: new RandomHeatmapModel,
    });
    randomView.render();
    
    var ExpressionModel = Backbone.Model.extend({
        defaults: {
            term: "PO:0025296",
            genes: "kb|g.3899.locus.2366,kb|g.3899.locus.1892," +
                   "kb|g.3899.locus.2354,kb|g.3899.locus.2549," +
                   "kb|g.3899.locus.2420,kb|g.3899.locus.2253," + 
                   "kb|g.3899.locus.2229".split(","),
        },
        url: function () {
            return "/data/ontology/plant/" + this.get('term') + "/expression"
        },
        parse: function (data) {
            var matrix = [];
            var columns = [];
            var i = 0;
            var maxScore = 0;
            for (var sample in data.series) {
                columns.push(sample);
                var values = data.series[sample];
                for (var j = 0; j < values.length; j++) {
                    var val = parseFloat(values[j]);
                    matrix.push([i, j, val]);
                    maxScore = Math.max(val, maxScore);
                }
                i++;
            }
            this.set('rows', data.genes);
            this.set('columns', columns);
            this.set('matrix', matrix);
            this.set('maxScore', maxScore);
        }
    });
    var expression = new ExpressionModel;
    new View({
        el: new Viewport({
            parent: $("#datavis"),
            title: "Expression Profile"
        }),
        model: expression,
    });
    expression.fetch({ data: { genes: expression.get('genes') }});
});