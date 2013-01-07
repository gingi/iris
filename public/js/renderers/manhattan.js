define(['jquery', 'util/eventemitter', 'util/dragbox', 'util/scale'],
function ($, EventEmitter, DragBox, Scale) {
    function createCanvas(container, options) {
        options = (options || {});
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
    
    function ManhattanPlot(element, options) {
        var self = this;
        options = (options || {});
        options.filterContig =
            (options.filterContig || function () { return false; });
        var $element = $(element);
        
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
        var XAXIS_HEIGHT = 80;
        
        var ctgOrder = [];
        var ctgIndex = [];

        var contigs, variations, maxscore, ctgXsize;
        
        self.setData = function (data) {
            contigs = {};
            for (var i = 0; i < data.contigs.length; i++) {
                var ctg = data.contigs[i];
                if (options.filterContig(ctg)) {
                    continue;
                }
                var key = ctg.id;
                contigs[key] = ctg;
                ctgIndex.push(key);
                ctgOrder.push(key);
                genomeLength += ctg.len;
            }
            variations  = data.variations;
            maxscore    = data.maxscore;
        };
        
        self.render = function (args) {
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
            dragbox.textHandler(function (x, y, w, h) {
                var pvals = [
                    yAxis.toDomain(y).toFixed(2),
                    yAxis.toDomain(y + h).toFixed(2)
                ].sort();
                return "-log p ["
                    + pvals[0] + " "
                    + pvals[1] + "]"
            });
            dragbox.pinpointHandler(function (x, y) {
                self.emit("pinpoint", [canvasToScore(y), canvasToCtg(x, x)]);
            });
            dragbox.selectionHandler(function (x1, y1, x2, y2) {
                self.emit("selection", [
                    canvasToScore(y1),
                    canvasToScore(y2),
                    canvasToCtg(x1, x2)
                ]);
            });
            drawManhattan();
        };
        
        function setRanges() {
            var yAxisMax = Math.ceil(maxscore) + 1;
            yAxis.domain([0, yAxisMax]);
            yAxis.range([canvasHeight, 0]);
            if (genomeLength == 0) {
                throw new Error("setRanges(): Contig data not set");
            }
            
            xAxis.domain([0, genomeLength]);
            xAxis.range([0, canvasWidth - (ctgOrder.length + 1) * XGUTTER]);
        }
        
        
        function drawAxes() {
            var offset = 0;
            var AXIS_COLOR  = '#CCC';
            var axisContext = createCanvas($element, { z: 1 });
            
            function contigsAreWide() {
                var shortest = contigs[ctgOrder.slice(-1)[0]];
                return (xAxis.toRange(shortest.len) > 50);
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
            
            function horizontalLabeler(text, x, y, options) {
                options = (options || {})
                axisContext.save();
                axisContext.textAlign = "center";
                axisContext.textBaseline = options.baseline || "top";
                axisContext.fillText(text, x, y);
                axisContext.restore();
            }
            
            var horizontalContigs = contigsAreWide();
            var labeler = horizontalContigs
                ? horizontalLabeler : verticalLabel;
            
            var labelOffset = YAXIS_WIDTH + XGUTTER;
            ctgOrder.forEach(function (key) {
                var ctg = contigs[key];
                var ctgWidth = xAxis.toRange(ctg.len);
                var origin = labelOffset + ctgWidth / 2;
                labeler(ctg.name, origin, canvasHeight + offset + 1);
                labelOffset += ctgWidth + XGUTTER;
            });
            horizontalLabeler("Contigs",
                YAXIS_WIDTH + canvasWidth / 2,
                horizontalContigs
                    ? canvasHeight + 40
                    : XAXIS_HEIGHT + canvasHeight - 1,
                { baseline: "bottom" }
            );
            
            verticalLabel("Significance", 0, canvasHeight / 2,
                { align: "center", baseline: "top" }
            );
            verticalLabel("-log p", 12, canvasHeight / 2,
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
            for (var i = 0; i < ctgOrder.length; i++) {
                var ctg = ctgOrder[i];
                var scale = contigs[ctg].scale = new Scale();
                var lenPx = xAxis.toRange(contigs[ctg].len);
                scale.domain([0, contigs[ctg].len]);
                scale.range([offset, offset + lenPx]);
                contigs[ctg].offset = offset + XGUTTER;
                offset += lenPx + XGUTTER;

                if (i % 2 === 0) {
                    contigs[ctg].color = {
                        max: [0, 0, 0],
                        min: [150, 150, 150]
                    };
                } else {
                    contigs[ctg].color = {
                        max: [255, 0, 0],
                        min: [255, 165, 0]
                    }
                }
            }
            for (var ctg in contigs) {
                var c = contigs[ctg].color;
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
				var ctgN   = variations[i][0];
				var xcoord = variations[i][1];
				var ycoord = variations[i][2];
                if (ctgIndex[ctgN] == null) continue;
				var ctg    = contigs[ctgIndex[ctgN]];
				var x      = ctg.scale.toRange(xcoord);
				var y      = yAxis.toRange(ycoord);
				var xbin   = 1.5*RADIUS * Math.floor(x/(1.5*RADIUS));
				var ybin   = 1.5*RADIUS * Math.floor(y/(1.5*RADIUS));
				x2color[xbin] = ctg.color;
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
				var ctgcolor = x2color[x];
				for (var y in histogram[x]) {
					var ratio = histogram[x][y]/maxTally;
					var r = color(ratio, ctgcolor, 0);
					var g = color(ratio, ctgcolor, 1);
					var b = color(ratio, ctgcolor, 2);
					
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

        function canvasToCtg(a, b) {
            var ranges = [];
            var offset = XGUTTER;
            var aCtg = 0;
            var bCtg = 0;
            var gutters = (ctgIndex.length + 1) * XGUTTER;
            var nt2px = (canvasWidth - gutters) / genomeLength;
            var aPos, bPos;
            for (i = 0; i < ctgOrder.length; i++) {
    			var ctg = ctgOrder[i];
                var len = contigs[ctg].len;
                var ctgXsize = nt2px * len;
                if (a >= offset - XGUTTER && a <= offset + ctgXsize) {
                    aCtg = i;
                    aPos = Math.floor(len * Math.max(a - offset, 0) / ctgXsize);
                }
                if (b >= offset && b <= offset + ctgXsize + XGUTTER) {
                    bCtg = i;
                    bPos = Math.ceil(len * Math.max(b - offset, 0) / ctgXsize);
                }
                offset += ctgXsize + XGUTTER;
            }
            if (aCtg <= bCtg) {
                if (aCtg === bCtg) {
                    ranges[0] = [ctgOrder[aCtg], aPos, bPos];
                } else if (aCtg === bCtg - 1) {
                    ranges[0] =
                        [ctgOrder[aCtg], aPos, contigs[ctgOrder[aCtg]].len];
                    ranges[1] = [ctgOrder[bCtg], 0, bPos];
                } else {
                    ranges[0] =
                        [ctgOrder[aCtg], aPos, contigs[ctgOrder[aCtg]].len];
                    for (i = 1; i < bCtg - aCtg; i++) {
                        ranges[i] =
                            [ctgOrder[aCtg + i], 0, contigs[ctgOrder[aCtg + i]].len];
                    }
                    ranges[bCtg - aCtg] = [ctgOrder[bCtg], 0, bPos];
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