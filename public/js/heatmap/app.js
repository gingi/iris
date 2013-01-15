require(['jquery', 'backbone', 'underscore', 'renderers/heatmap'],
function ($, Backbone, _, Heatmap) {
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
    var View = Backbone.View.extend({
        initialize: function () {
            this.render();
        },
        render: function () {
            var NUM_GENES = 10;
            var heatmap = new Heatmap(this.$el);
            heatmap.setData(randomData(NUM_GENES));
            heatmap.render();
        }
    });
    
    $("#container").append(
        $("<div>").attr("id", "heatmap")
            .addClass("datavis").width(600).height(600));
    
    new View({ el: $("#heatmap") });
});