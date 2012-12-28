define(['jquery', 'd3', 'util/dragbox'], function ($, d3, DragBox) {
    var MAX_CELLS = 6400; // 80 x 80
    var DEFAULT_BORDER_WIDTH = 0.5;
    function requiredProperty(object, property) {
        
    }
	function Heatmap(element, options) {
        var self = this;
        element = $(element);
        options = (options || {});
        options.borderWidth = (options.borderWidth || DEFAULT_BORDER_WIDTH);
        
        var matrix = [];
        var rowIndex = {}; var numRows = 0;
        var colIndex = {}; var numCols = 0;

        var cellSize = options.cellSize || 5;

	    var width = element.width();
	    var height = element.height();
        var minDim = Math.min(width, height);
        
        self.setData = function (data) {
            if (data == null) return;
            function requiredProperty(prop) {
                if (!data.hasOwnProperty(prop)) {
                    throw new Error("setData(): Required property '"
                        + prop + "' not found");
                }
            }
            requiredProperty('matrix');
            requiredProperty('rows');
            rows = data.rows;
            if (!data.hasOwnProperty('columns')) {
                columns = rows;
            }
            matrix = data.matrix;
            if (matrix.length > MAX_CELLS) {
                throw new Error("Too many cells");
            }
        };
        self.render = function () {
            element.css("position", "relative");
            cellSize = Math.max(3,
                (minDim - options.borderWidth * (rows.length+1)) / rows.length);
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
                var row = cell[0];
                var col = cell[1];
                svg.append("rect")
                    .attr("width", cellSize).attr("height", cellSize)
                    .attr("x", options.borderWidth * (row + 1) + cellSize * row)
                    .attr("y", options.borderWidth * (col + 1) + cellSize * col)
                    .attr("class", "q" + quantize(cell[2]) + "-9")
                    .append("title").text(cell[2]);
            }
        }
        return self;
	}
	return Heatmap;
});