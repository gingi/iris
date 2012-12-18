define(['jquery', 'util/eventemitter'], function ($, EventEmitter) {

    function ManhattanPlot(element, args) {
        var self = this;

        var canvasWidth, canvasHeight;
        var ctx;
        var ctxi;
        var canvas, canvasi;
        var tool = new Object();
        tool.started = false;
        var totalLen = 0;
        var sc = 2;
        var RADIUS = 2;
        var DRAW_DISCS = true;
        var XGUTTER = 10;
        var colorByDensity = true;
        var PINTENSITY = 0.4;
        var RGB_STRING = "rgb({0}, {1}, {2})";
        
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
            var $element = $(element);
            var div = $('<div></div>').css("position", "relative");
            $element.append(div);
            canvasHeight = Math.max($element.height(), 500);
            canvasWidth  = Math.max($element.width(), 300);
            var addCanvas = function (id) {
                var c = $("<canvas>")
                    .attr("id", id)
                    .attr("width", canvasWidth)
                    .attr("height", canvasHeight)
                    .css("position", "absolute")
                    .css("left", 0)
                    .css("top", 0)
                    .css("z-index", 1);
                div.append(c);
                return c;
            };
            canvas  = addCanvas($element.attr("id") + "-canvas");
            canvasi = addCanvas($element.attr("id") + "-canvasi");
            div.height(canvasHeight);

            ctx  = canvas[0].getContext('2d');
            ctxi = canvasi[0].getContext('2d');

            drawManhattan();
        };
        
        
        function color(r, cc, c) {
            return cc.min[c] + Math.floor(r * cc.range[c]);
        }

        function drawManhattan() {
            ctx.strokeStyle = "black";

            ctxi.strokeStyle = "red";
            ctxi.fillStyle = "rgba(255,0,0,0.3)";

            // add event listeners
            canvasi.on('mousedown', startDrag);
            canvasi.on('mousemove', moveDragEvent);
            canvasi.on('mouseup',   releaseDragEvent);

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
                        min: [0, 0, 0],
                        max: [150, 150, 150]
                    };
                } else {
                    chromosomes[chr].color = {
                        min: [255, 0, 0],
                        max: [255, 165, 0]
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
            
            for (var i = 0; i < variations.length; i++) {
                var chrN   = variations[i][0];
                var xcoord = variations[i][1];
                var pval   = variations[i][2];
                var chr    = chromosomes[chrIndex[chrN]];
                var x      = chr.offset + (xfactor * xcoord);
                var y      = canvasHeight - yfactor * pval;

                var ratio = intensity(pval) / normalized;
                var r = color(ratio, chr.color, 0);
                var g = color(ratio, chr.color, 1);
                var b = color(ratio, chr.color, 2);

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

        function startDrag(ev) {
            if (tool.clicked) {
                tool.clicked = false;
                return;
            }
            if (ev.layerX || ev.layerX === 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX === 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }
            tool.clicked = true;
            tool.started = false;
            tool.x = ev._x;
            tool.y = ev._y;
            ctxi.clearRect(0, 0, canvasWidth, canvasHeight);
            ctxi.strokeRect(tool.x, tool.y, 1, 1);
        }

        function moveDragEvent(ev) {
            if (!tool.clicked) return;
            tool.started = true;
            if (ev.layerX || ev.layerX === 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX === 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }
            var x = tool.x < ev._x ? tool.x : ev._x;
            var y = tool.y < ev._y ? tool.y : ev._y;
            var width = Math.abs(ev._x - tool.x + 1);
            var height = Math.abs(ev._y - tool.y + 1);
            ctxi.clearRect(0, 0, ctxi.canvas.width, ctxi.canvas.height);
            ctxi.fillRect(x, y, width, height);
            ctxi.strokeRect(x, y, width, height);
        }

        function releaseDragEvent(ev) {
            if (ev.layerX || ev.layerX === 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX === 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }
            var x1 = tool.x;
            var x2 = ev._x;
            var y1 = tool.y;
            var y2 = ev._y;
            if (tool.x > ev._x) {
                x1 = ev._x;
                x2 = tool.x;
            }
            if (tool.y > ev._y) {
                y1 = ev._y;
                y2 = tool.y;
            }
            if (!tool.started) {
                self.emit("pinpoint", [canvasToScore(y2), canvasToChr(x2, x2)]);
            } else {
                // need to convert x, y pixels to intervals on chromosomes and scores
                var ranges = canvasToChr(x1, x2);
                tool.started = false;
                self.emit("selection", [canvasToScore(y1), canvasToScore(y2), ranges]);
            }
            tool.clicked = false;
        }
    };
    
    $.extend(ManhattanPlot.prototype, EventEmitter);

    return ManhattanPlot;
});