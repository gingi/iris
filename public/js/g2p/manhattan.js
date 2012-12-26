define(['jquery', 'util/eventemitter', 'util/dragbox', 'util/Scale'],
function ($, EventEmitter, DragBox, Scale) {
    function createCanvas(container, options) {
        options = (options || {})
        var canvas = $("<canvas>")
            .attr("width", container.width())
            .attr("height", container.height())
            .css("position", "absolute")
            .css("left", 0)
            .css("top", 0)
            .css("z-index", options.z || 10);
        container.append(canvas);
        return canvas[0].getContext('2d');
    }
    
    function ManhattanPlot(parent) {
        var self = this;
        var $element;
        
        var yAxis = new Scale(),
            xAxis = new Scale();
        var canvasWidth, canvasHeight;
        var ctx;
        var genomeLength = 0;
        var RADIUS = 2;
        var DRAW_DISCS = true;
        var XGUTTER = 10;
        var PINTENSITY = 0.4;
        var YAXIS_WIDTH = 30;
        var XAXIS_HEIGHT = 100;
        
        var chrOrder = [];
        var chrIndex = [];

        var chromosomes, variations, maxscore, chrXsize;

        (function init() {
            parent = $(parent);
            $element = $("<div>").height(parent.height());
            parent.append($element);
        })();
        
        self.setData = function (data) {
            chromosomes = {};
            for (var i = 0; i < data.chromosomes.length; i++) {
                var chr = data.chromosomes[i];
                var name = chr["name"];
                var length = chr["len"];
                chromosomes[name] = { len: length };
                chrIndex.push(name);
                chrOrder.push(name);
                genomeLength += length;
            }
            chrOrder = chrOrder.sort(function (a, b) {
                return chromosomes[b].len - chromosomes[a].len;
            });
            variations  = data.variations;
            maxscore    = data.maxscore;
        };
        
        self.display = function (args) {
            args = (args || {});
            $element.empty();
            var containerHeight = $element.height();
            var containerWidth  = $element.width();
            canvasHeight = containerHeight - XAXIS_HEIGHT;
            canvasWidth  = containerWidth  - YAXIS_WIDTH;
            $element.css("position", "relative")
                .width(containerWidth)
                .height(containerHeight);
            var plotArea =
                $('<div>').css("position", "absolute").css("right", 0);
            plotArea.width(canvasWidth).height(canvasHeight);
            ctx = createCanvas(plotArea);
            $element.append(plotArea);
            setRanges();
            drawAxes();

            var dragbox = new DragBox(plotArea, { z: 10 });
            dragbox.pinpointHandler(function (x, y) {
                self.emit("pinpoint", [canvasToScore(y), canvasToChr(x, x)]);
            });
            dragbox.selectionHandler(function (x1, y1, x2, y2) {
                self.emit("selection", [
                    canvasToScore(y1),
                    canvasToScore(y2),
                    canvasToChr(x1, x2)
                ]);
            });
            drawManhattan();
        };
        
        function setRanges() {
            var yAxisMax = Math.ceil(maxscore) + 1;
            yAxis.domain([0, yAxisMax]);
            yAxis.range([canvasHeight, 0]);
            
            if (genomeLength == 0) {
                throw new Error("setRanges: Chromosome data not set");
            }
            
            xAxis.domain([0, genomeLength]);
            xAxis.range([0, canvasWidth - (chrOrder.length + 1) * XGUTTER]);
        }
        
        
        function drawAxes() {
            var offset = 0;
            var AXIS_COLOR  = '#CCC';
            var axisContext = createCanvas($element, { z: 1 });
            
            function chromosomesAreWide() {
                var shortest = chromosomes[chrOrder.slice(-1)[0]];
                return (xAxis.toRange(shortest.len) > 20);
            }
            axisContext.strokeStyle = AXIS_COLOR;
            axisContext.fillStyle = AXIS_COLOR;
            axisContext.beginPath();
            axisContext.moveTo(YAXIS_WIDTH - offset, 0);
            axisContext.lineTo(YAXIS_WIDTH - offset, canvasHeight + offset);
            axisContext.lineTo($element.width(),     canvasHeight + offset);
            axisContext.stroke();
            axisContext.closePath();
            
            function verticalLabel(text, x, y, options) {
                options = (options || {});
                axisContext.save();
                if (options.callback) {
                    options.callback(axisContext);
                }
                axisContext.translate(x, y);
                axisContext.rotate(-Math.PI/2);
                axisContext.textAlign = options.align || "right";
                axisContext.textBaseline = options.baseline || "middle";
                axisContext.fillText(text, 0, 0);
                axisContext.restore();
            }
            
            var labeler = verticalLabel;
            if (chromosomesAreWide()) {
                labeler = function (text, x, y) {
                    axisContext.save();
                    axisContext.textAlign = "center";
                    axisContext.textBaseline = "top";
                    axisContext.fillText(text, x, y);
                    axisContext.restore();
                };
            }
            
            var labelOffset = YAXIS_WIDTH + XGUTTER;
            chrOrder.forEach(function (name) {
                var chr = chromosomes[name];
                var chrWidth = xAxis.toRange(chr.len);
                var origin = labelOffset + chrWidth / 2;
                labeler(name, origin, canvasHeight + offset + 1);
                labelOffset += chrWidth + XGUTTER;
            });
            
            verticalLabel("Significance", 0, canvasHeight / 2,
                { align: "center", baseline: "top" }
            );
            verticalLabel("-log10(p)", 12, canvasHeight / 2,
                { align: "center", baseline: "top",
                    callback: function (context) {
                        context.font = "italic 6pt sans-serif";
                    }
                }
            );
            axisContext.textAlign = "right";
            axisContext.textBaseline = "top";
            axisContext.fillText(yAxis.domain()[1], YAXIS_WIDTH - 1, 0);
            axisContext.textBaseline = "bottom";
            axisContext.fillText(yAxis.domain()[0], YAXIS_WIDTH - 1, canvasHeight);
        }
        
        function color(r, cc, c) {
            return cc.min[c] + Math.floor(r * cc.range[c]);
        }

        function drawManhattan() {
            var offset = XGUTTER;
            for (var i = 0; i < chrOrder.length; i++) {
                var chr = chrOrder[i];
                var scale = chromosomes[chr].scale = new Scale();
                var lenPx = xAxis.toRange(chromosomes[chr].len);
                scale.domain([0, chromosomes[chr].len]);
                scale.range([offset, offset + lenPx]);
                chromosomes[chr].offset = offset + XGUTTER;
                offset += lenPx + XGUTTER;

                if (i % 2 === 0) {
                    chromosomes[chr].color = {
                        max: [0, 0, 0],
                        min: [150, 150, 150]
                    };
                } else {
                    chromosomes[chr].color = {
                        max: [255, 0, 0],
                        min: [255, 165, 0]
                    }
                }
            }
            for (var chr in chromosomes) {
                var c = chromosomes[chr].color;
                c.range = [];
                for (var i = 0; i < c.max.length; i++) {
                    c.range.push(c.max[i] - c.min[i]);
                }
            }
            scatterplot();
        }
        
        function scatterplot() {
            var PI2 = Math.PI * 2;
            function intensity(v) { return Math.pow(v + 1, PINTENSITY) }
            var normalized = intensity(maxscore);

            // create a 2D histogram
			var histogram = new Object();
			var x2color = new Object();
			var maxTally=1;
			for (var i = 0; i < variations.length; i++) {
				var chrN   = variations[i][0];
				var xcoord = variations[i][1];
				var ycoord = variations[i][2];
				var chr    = chromosomes[chrIndex[chrN]];
				var x      = chr.scale.toRange(xcoord);
				var y      = yAxis.toRange(ycoord);
				var xbin   = 1.5*RADIUS * Math.floor(x/(1.5*RADIUS));
				var ybin   = 1.5*RADIUS * Math.floor(y/(1.5*RADIUS));
				x2color[xbin] = chr.color;
				if (histogram.hasOwnProperty(xbin)) {
					if (histogram[xbin].hasOwnProperty(ybin)) {
						histogram[xbin][ybin]++
					} else {
						histogram[xbin][ybin]=1
					}
				} else {
					histogram[xbin] = new Object();
					histogram[xbin][ybin] = 1;
				}
				if (histogram[xbin][ybin] > maxTally) {
					maxTally = histogram[xbin][ybin];
				}
			}

			for (var x in histogram) {
				var chrcolor = x2color[x];
				for (var y in histogram[x]) {
					var ratio = histogram[x][y]/maxTally;
					var r = color(ratio, chrcolor, 0);
					var g = color(ratio, chrcolor, 1);
					var b = color(ratio, chrcolor, 2);
					
					ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
					
					if (DRAW_DISCS) {
						ctx.beginPath();
						ctx.arc(Math.floor(x), Math.floor(y), RADIUS, 0, PI2, true);
						ctx.closePath();
						ctx.fill();
					} else {
						ctx.fillRect(Math.floor(x), Math.floor(y), sc, sc);
					}
				}
			}
        }

        function canvasToChr(a, b) {
            var ranges = [];
            var offset = XGUTTER;
            var aChr = 0;
            var bChr = 0;
            var gutters = (chrIndex.length + 1) * XGUTTER;
            var nt2px = (canvasWidth - gutters) / genomeLength;
            var aPos, bPos;
            for (i = 0; i < chrOrder.length; i++) {
    			var chr = chrOrder[i];
                var len = chromosomes[chr].len;
                var chrXsize = nt2px * len;
                if (a >= offset - XGUTTER && a <= offset + chrXsize) {
                    aChr = i;
                    aPos = Math.floor(len * Math.max(a - offset, 0) / chrXsize);
                }
                if (b >= offset && b <= offset + chrXsize + XGUTTER) {
                    bChr = i;
                    bPos = Math.ceil(len * Math.max(b - offset, 0) / chrXsize);
                }
                offset += chrXsize + XGUTTER;
            }
            if (aChr <= bChr) {
                if (aChr === bChr) {
                    ranges[0] = [chrOrder[aChr], aPos, bPos];
                } else if (aChr === bChr - 1) {
                    ranges[0] =
                        [chrOrder[aChr], aPos, chromosomes[chrOrder[aChr]].len];
                    ranges[1] = [chrOrder[bChr], 0, bPos];
                } else {
                    ranges[0] =
                        [chrOrder[aChr], aPos, chromosomes[chrOrder[aChr]].len];
                    for (i = 1; i < bChr - aChr; i++) {
                        ranges[i] =
                            [chrOrder[aChr + i], 0, chromosomes[chrOrder[aChr + i]].len];
                    }
                    ranges[bChr - aChr] = [chrOrder[bChr], 0, bPos];
                }
            }
            return ranges;
        }

        function canvasToScore(py) {
            return yAxis.toDomain(py);
        }
    };

    $.extend(ManhattanPlot.prototype, EventEmitter);    
    return ManhattanPlot;
});