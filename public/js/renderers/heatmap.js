define(['jquery', 'd3', 'util/dragbox'], function ($, d3, DragBox) {
    var MAX_CELLS = 6400; // 80 x 80
	function Heatmap(element, options) {
        var self = this;
        element = $(element);
        options = (options || {});
        
        var matrix = [];
        var rowIndex = {}; var numRows = -1;
        var colIndex = {}; var numCols = -1;

        var cellSize = options.cellSize || 5;

	    var width = element.width();
	    var height = element.height();
        
        self.setData = function (data) {
            matrix = data.matrix;
            if (matrix.length > MAX_CELLS) {
                throw new Error("Too many cells");
            }
            matrix.forEach(function (e) {
                if (!rowIndex[e[0]]) {
                    rowIndex[e[0]] = ++numRows;
                }
                if (!colIndex[e[1]]) {
                    colIndex[e[1]] = ++numCols;
                }
            });
        };
        self.render = function () {
            element.css("position", "relative");
            cellSize = Math.max(3, Math.floor(element.width() / numRows));
    	    var svg  = d3.select("#" + element.attr('id')).append("svg")
    	        .attr("class", "GnBu")
    	        .attr("width", width)
    	        .attr("height", height);
    	    var quantize = d3.scale.quantile().domain([0, 1]).range(d3.range(9));
            var dragbox = new DragBox(element);
            dragbox.textHandler(function (x, y, w, h) {
                return [w, h].join(" ");
            })

            for (var i = 0; i < matrix.length; i++) {
                var cell = matrix[i];
                var row = Math.floor(i / numRows);
                var col = i % numRows;
                svg.append("rect")
                    .attr("width", cellSize).attr("height", cellSize)
                    .attr("x", (cellSize + 0.4) * row)
                    .attr("y", (cellSize + 0.4) * col)
                    .attr("class", "q" + quantize(cell[2]) + "-9");
            }
        }
        return self;
	}
	return Heatmap;
});