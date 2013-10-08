define(['jquery', 'd3', 'underscore', 'util/dragbox'],
function (JQ, d3, _, DragBox) {
    var MAX_CELLS = 24000;
    var MIN_CELL_SIZE = 4;
    var MAX_CELL_SIZE = 60;
    var M = { y: 65, x: 70 };

    var defaults = {
        borderWidth: 1,
        colorscheme: 'RdYlBu',
        element: 'body'
    };
    function Heatmap(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var element = JQ(options.element);
        
        var matrix = [], row, columns;
        var maxScore;

        var cellSize = options.cellSize || 5;

        var width, height, minDim;
        
        function maxStrLen(strarr) {
            return _.reduce(strarr, function (m, str) {
                return Math.max(m, str.length)
            }, 0);
        }
        
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
            } else {
                columns = data.columns;
            }
            matrix = data.matrix;
            if (matrix == null) {
                throw new Error("Empty matrix");
            }
            if (matrix.length > MAX_CELLS) {
                throw new Error("Too many cells");
            }
            M.x = Math.max(M.x, 6 * maxStrLen(rows));
            M.y = Math.max(M.y, 6 * maxStrLen(columns));
            maxScore = data.maxScore || 1;
        };
        self.getData = function () {
            return {
                rows: rows,
                columns: columns,
                matrix: matrix
            };
        }
        
        function adjustedDim(arr) {
            return Math.floor(arr.length * (cellSize + options.borderWidth));
        }
        self.render = function () {
            width = element.width();
            height = element.height();
            minDim = Math.min(width, height);
            element.empty();
            element.css("position", "relative");
            cellSize = Math.min(MAX_CELL_SIZE,
                Math.max(MIN_CELL_SIZE,
                    (minDim - Math.min(M.y, M.x) -
                        options.borderWidth * (rows.length+1)) / rows.length)
                );
            var adjWidth  = adjustedDim(columns);
            var adjHeight = adjustedDim(rows);
            var containerId = element.attr('id') + "-container";
            var container = JQ("<div>").attr("id", containerId)
                .css("position", "relative")
                .width(width)
                .height(height);
            element.append(container);

            var svg  = d3.select("#" + containerId).append("svg")
                .attr("width", width)
                .attr("height", height);

            var xLabels = d3.scale.ordinal()
                .domain(columns).rangeBands([0, adjWidth]);
            var yLabels = d3.scale.ordinal()
                .domain(rows).rangeBands([0, adjHeight]);
            var xAxis =d3.svg.axis().scale(xLabels)
                .ticks(columns.length).orient("top");
            var yAxis = d3.svg.axis().scale(yLabels)
                .ticks(rows.length).orient("left");
            
            var plot = svg.append("g")
                .attr("class", options.colorscheme)
                .attr("id", element.attr('id') + "-plotarea")
                .attr("width", adjWidth)
                .attr("height", adjHeight)
                .attr("transform", "translate(" + M.x + "," + M.y +")");

            var yAxisG = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + M.x + "," + M.y + ")")
                .call(yAxis);
            var xAxisG = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + M.x +"," + M.y + ")")
                .call(xAxis).selectAll("text")
                    .attr("transform", function (d, i) {
                        var bbox = this.getBBox();
                        return [
                            "rotate(-90)translate(", bbox.width/2 + 6,
                            ",", bbox.height,")"
                        ].join("")
                    });
            

            var quantize = d3.scale
                .quantile().domain([0, maxScore]).range(d3.range(9));
            var dragbox =
                new DragBox(JQ("#" + element.attr('id') + "-plotarea"));
            dragbox.textHandler(function (x, y, w, h) {
                return [w, h].join(" ");
            })

            for (var i = 0; i < matrix.length; i++) {
                var cell = matrix[i];
                var row = cell[0];
                var col = cell[1];
                plot.append("rect")
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
        }
        return self;
    }
    return Heatmap;
});