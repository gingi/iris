define(['jquery', 'd3', 'util/dragbox'], function ($, d3, DragBox) {
    var MAX_CELLS = 24000;
    var MIN_CELL_SIZE = 3;
    var MAX_CELL_SIZE = 60;
    var DEFAULT_BORDER_WIDTH = 0.5;
	function Heatmap(options) {
        var self = this;
        options = (options || {});
        options.borderWidth = (options.borderWidth || DEFAULT_BORDER_WIDTH);
        options.colorscheme = (options.colorscheme || 'RdYlBu');
        options.maxScore    = options.maxScore || 1;
        var element = $(options.element);
        
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
            if (matrix == null) {
                throw new Error("Empty matrix");
            }
            if (matrix.length > MAX_CELLS) {
                throw new Error("Too many cells");
            }
            if (data.maxScore) options.maxScore = data.maxScore;
        };
        
        function adjustedDim(arr) {
            return Math.floor(arr.length *
                (cellSize + options.borderWidth));
        }
        self.display = function () {
            element.css("position", "relative");
            cellSize = Math.min(MAX_CELL_SIZE,
                Math.max(MIN_CELL_SIZE,
                    (minDim - options.borderWidth * (rows.length+1)) /
                         rows.length)
                );
            var adjWidth  = adjustedDim(columns);
            var adjHeight = adjustedDim(rows);
            var containerId = element.attr('id') + "-container";
            var container = $("<div>").attr("id", containerId)
                .css("position", "relative")
                .width(adjWidth)
                .height(adjHeight);
            element.append(container);
    	    var svg  = d3.select("#" + containerId).append("svg")
    	        .attr("class", options.colorscheme)
    	        .attr("width", adjWidth)
    	        .attr("height", adjHeight);
    	    var quantize = d3.scale
                .quantile().domain([0, options.maxScore]).range(d3.range(9));
            var dragbox = new DragBox(container);
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
            var schemeIndex = 0;
            var schemes = 'RdYlBu Spectral BrBG YlGnBu'.split(" ");
            for (var i in schemes) {
                if (schemes[i] == options.colorscheme) {
                    schemes.splice(i, 1);
                    break;
                }
            }
            schemes.unshift(options.colorscheme);
            // element.append($("<button>")
            //     .addClass("btn btn-mini").text("Change Scheme")
            //     .on('click', function () {
            //         schemeIndex = (schemeIndex + 1) % schemes.length;
            //         svg.attr("class", schemes[schemeIndex]);
            //     }
            // ));
        }
        return self;
	}
	return Heatmap;
});