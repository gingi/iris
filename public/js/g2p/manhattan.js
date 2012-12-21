define(['jquery', 'util/eventemitter', 'util/dragbox'],
function ($, EventEmitter, DragBox) {

    function ManhattanPlot(parent) {
        var self = this;
        parent = $(parent);
        var $element = $("<div>").height(parent.height());
        parent.append($element);
        var canvasWidth, canvasHeight;
        var ctx;
        var canvas;
        var totalLen = 0;
        var RADIUS = 2;
        var DRAW_DISCS = true;
        var XGUTTER = 10;
        var PINTENSITY = 0.4;
        var YAXIS_WIDTH = 60;
        var XAXIS_HEIGHT = 50;
        
        var chrOrder = [];
        var chrIndex = [];

        var chromosomes, variations, maxscore, chrXsize;
        var xfactor, yfactor; 
        self.setData = function (data) {
            chromosomes = {};
            for (var i = 0; i < data.chromosomes.length; i++) {
                var chr = data.chromosomes[i];
                var name = chr[0];
                var length = chr[1];
                chromosomes[name] = { len: length };
                chrIndex.push(name);
                chrOrder.push(name);
                totalLen += length;
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
            canvasWidth  = containerWidth - YAXIS_WIDTH;
            $element.css("position", "relative")
                .width(containerWidth)
                .height(containerHeight);
            var plotArea =
                $('<div>').css("position", "absolute").css("right", 0);
            var yAxis =
                $('<div>').css("position", "absolute");
            var xAxis =
                $('<div>').css("position", "absolute")
                .css("bottom", 0).css("right", 0);
            plotArea.width(canvasWidth).height(canvasHeight);
            yAxis.width(YAXIS_WIDTH).height(canvasHeight);
            xAxis.width(canvasWidth).height(XAXIS_HEIGHT);
            xAxis.css("background-color", "#FAA");
yAxis.css("background-color", "#FCC");
$element.css('background-color', "#FEE");
            canvas = $("<canvas>")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight)
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", 1)
            plotArea.append(canvas);
            $element.append(yAxis);
            $element.append(plotArea);
            $element.append(xAxis);

            ctx  = canvas[0].getContext('2d');

            var dragbox = new DragBox(plotArea);
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
        
        
        function color(r, cc, c) {
            return cc.min[c] + Math.floor(r * cc.range[c]);
        }

        function drawManhattan() {
            ctx.strokeStyle = "black";
            

            var offset = XGUTTER;
            xfactor =
                (canvasWidth - (XGUTTER * chrIndex.length - 1)) / totalLen;
            yfactor = canvasHeight / maxscore;
            for (var i = 0; i < chrOrder.length; i++) {
                var chr = chrOrder[i];
                chromosomes[chr].offset = offset;
                offset += xfactor * chromosomes[chr].len + XGUTTER;

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
			var max_tally=1;
			for (var i = 0; i < variations.length; i++) {
				var chrN   = variations[i][0];
				var xcoord = variations[i][1];
				var ycoord = variations[i][2];
				var chr    = chromosomes[chrIndex[chrN]];
				var x      = chr.offset + xfactor * xcoord;
				var y      = canvasHeight - yfactor * ycoord;
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
				if (histogram[xbin][ybin] > max_tally) {
					max_tally = histogram[xbin][ybin];
				}
			}

			for (var x in histogram) {
				var chrcolor = x2color[x];
				for (var y in histogram[x]) {
					var ratio = histogram[x][y]/max_tally;
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
            var nt2px = (canvasWidth - gutters) / totalLen;
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
            return maxscore * (canvasHeight - py) / canvasHeight;
        }
    };

    $.extend(ManhattanPlot.prototype, EventEmitter);    
    return ManhattanPlot;
});