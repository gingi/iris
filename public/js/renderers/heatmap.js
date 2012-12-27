define(['jquery', 'd3', 'util/dragbox'], function ($, d3, DragBox) {
    var MAX_CELLS = 6400; // 80 x 80
    var BORDER_WIDTH = 0.5;
	function Heatmap(element, options) {
        var self = this;
        element = $(element);
        options = (options || {});
        
        var matrix = [];
        var rowIndex = {}; var numRows = 0;
        var colIndex = {}; var numCols = 0;

        var cellSize = options.cellSize || 5;

	    var width = element.width();
	    var height = element.height();
        
        self.setData = function (data) {
            if (data == null) return;
            if (!data.hasOwnProperty('matrix')) {
                throw new Error("setData(): Required property 'matrix' not found");
            }
            matrix = data.matrix;
            if (matrix.length > MAX_CELLS) {
                throw new Error("Too many cells");
            }
            matrix.forEach(function (e) {
                if (rowIndex[e[0]] == null) rowIndex[e[0]] = (++numRows - 1);
                if (colIndex[e[1]] == null) colIndex[e[1]] = (++numCols - 1);
            });
        };
        self.render = function () {
            element.css("position", "relative");
            cellSize = Math.max(3,
                Math.floor((element.width() - BORDER_WIDTH * (numRows-2)) / numRows));
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
                var row = rowIndex[cell[0]];
                var col = colIndex[cell[1]];
                svg.append("rect")
                    .attr("width", cellSize).attr("height", cellSize)
                    .attr("x", (cellSize + BORDER_WIDTH) * row)
                    .attr("y", (cellSize + BORDER_WIDTH) * col)
                    .attr("class", "q" + quantize(cell[2]) + "-9");
                svg.append("text")
                    .attr("x", (cellSize + BORDER_WIDTH) * row + 5)
                    .attr("y", (cellSize + BORDER_WIDTH) * col + 5)
                    .attr("font-size", "6pt")
                    .attr("alignment-baseline", "middle")
                    .text([row, col].join(" "));
            }
        }
        return self;
	}
	return Heatmap;
});