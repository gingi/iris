define(['jquery'], function ($) {

    function ManhattanPlot(element, args) {
        var self = this;

        var ctx;
        var ctxi;
        var canvas, canvasi;
        var tool = new Object();
        tool.started = false;
        var globalMax = 0;
        var totalLen = 0;
        var sc = 2;
        var radius = 2;
        var circles = true;
        var XGUTTER = 10;
        var colorByDensity = true;
        var chrRange = new Array();
        var scoreA;
        var scoreB;
        var PINTENSITY = 5;
        
        
        var chrOrder = [];
        var chrIndex = [];
        var threads = 5;

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
            }
            chrOrder = chrOrder.sort(function (a, b) {
                return chromosomes[b].len - chromosomes[a].len;
            });
            variations  = data.variations;
            maxscore    = 1 - Math.log(data.maxscore);
        };
        self.display = function (args) {
            args = (args || {});
            var $element = $(element);
            var div = $('<div></div>').css("position", "relative");
            $element.append(div);
            var canvasHeight = Math.max($element.height(), 500);
            var canvasWidth = Math.max($element.width(), 300);
            canvas = $("<canvas>")
                .attr("id", element.id + "_canvas")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight)
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", 1);
            canvasi = $("<canvas>")
                .attr("id", element.id + "_canvasi")
                .attr("width", canvasWidth)
                .attr("height", canvasHeight)
                .css("position", "absolute")
                .css("left", 0)
                .css("top", 0)
                .css("z-index", 1);
            div.append(canvas).append(canvasi);
            div.height(canvasHeight);

            ctx = canvas[0].getContext('2d');
            ctxi = canvasi[0].getContext('2d');

    		totalLen = 0;
            for (var c in chromosomes) { totalLen += chromosomes[c].len; }

            globalMax = Math.ceil(maxscore);
            drawManhattan();
        };
        
        function color(r, cc, c) {
            return cc.min[c] + Math.floor(r * (cc.max[c] - cc.min[c]));
        }

        function drawManhattan() {
            ctx.strokeStyle = "black";

            ctxi.strokeStyle = "red";
            ctxi.fillStyle = "rgba(255,0,0,0.3)";

            // add event listeners
            canvasi[0].addEventListener('mousedown', startDragEvent(), false);
            canvasi[0].addEventListener('mousemove', moveDragEvent(), false);
            canvasi[0].addEventListener('mouseup', releaseDragEvent(), false);

            var offset = XGUTTER;
            xfactor =
                (ctx.canvas.width - (XGUTTER * chrIndex.length - 1)) / totalLen;
            yfactor = ctx.canvas.height / globalMax;
            for (var i = 0; i < chrOrder.length; i++) {
                var chr = chrOrder[i];
                chromosomes[chr].offset = offset;
                offset += xfactor * chromosomes[chr].len + XGUTTER;

                if (i % 2 === 0) {
                    chromosomes[chr].color = {
                        min: [150, 150, 150],
                        max: [0, 0, 0]
                    };
                } else {
                    chromosomes[chr].color = {
                        min: [255, 165, 0],
                        max: [255, 15, 0]
                    }
                }
            }
            scatterplot();
        }
        
        function scatterplot() {
            var PI2 = Math.PI * 2;
            for (var i = 0; i < variations.length; i++) {
                var chrN   = variations[i][0];
                var xcoord = variations[i][1];
                var pval   = 1 - Math.log(variations[i][2]);
                var chr    = chromosomes[chrIndex[chrN]];
                var x      = chr.offset + (xfactor * xcoord);
                var y      = ctx.canvas.height - yfactor * pval;

                var ratio = variations[i][2] * PINTENSITY / globalMax;
                var r = color(ratio, chr.color, 0);
                var g = color(ratio, chr.color, 1);
                var b = color(ratio, chr.color, 2);

                ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

                if (circles) {
                    ctx.beginPath();
                    ctx.arc(Math.floor(x), Math.floor(y), radius, 0, PI2, true);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(Math.floor(x), Math.floor(y), sc, sc);
                }
            }            
        }

    function canvasToChr(a, b) {
        chrRange = [];
        var offset = XGUTTER;
        var aChr = 0;
        var bChr = 0;
        var gutters = (chromosomes.length + 1) * XGUTTER;
        var nt2px = (ctxi.canvas.width - gutters) / totalLen;
        var aPos, bPos;
		var chrNames = new Array();
		for (var chr in chromosomes) {
			chrNames.push(chr);
		}
        for (i = 0; i < chrNames.length; i++) {
			var chr = chrNames[i];
            var chrXsize = nt2px * chromosomes[chr];
            if (a >= offset - XGUTTER && a <= offset + chrXsize) {
                aChr = i;
                aPos = Math.floor(chromosomes[chr] * Math.max(a - offset, 0) / chrXsize);
            }
            if (b >= offset && b <= offset + chrXsize + XGUTTER) {
                bChr = i;
                bPos = Math.ceil(chromosomes[chr] * Math.max(b - offset, 0) / chrXsize);
            }
            offset += chrXsize + XGUTTER;
        }
        if (aChr <= bChr) {
            if (aChr === bChr) {
                chrRange[0] = [chrNames[aChr], aPos, bPos];
            } else if (aChr === bChr - 1) {
                chrRange[0] = [chrNames[aChr], aPos, chromosomes[chrNames[aChr]]];
                chrRange[1] = [chrNames[bChr], 0, bPos];
            } else {
                chrRange[0] = [chrNames[aChr], aPos, chromosomes[chrNames[aChr]]];
                for (i = 1; i < bChr - aChr; i++) {
                    chrRange[i] = [chrNames[aChr + i], 0, chromosomes[chrNames[aChr + i]]];
                }
                chrRange[bChr - aChr] = [chrNames[bChr], 0, bPos];
            }
        }
    }

    function canvasToScore(a, b) {
        scoreA = globalMax * (ctxi.canvas.height - a) / ctxi.canvas.height;
        scoreB = globalMax * (ctxi.canvas.height - b) / ctxi.canvas.height;
    }

    function startDragEvent() {
        return function(ev) {
            if (ev.layerX || ev.layerX === 0) {
                ev._x = ev.layerX;
                ev._y = ev.layerY;
            } else if (ev.offsetX || ev.offsetX === 0) {
                ev._x = ev.offsetX;
                ev._y = ev.offsetY;
            }
            tool.started = true;
            tool.x = ev._x;
            tool.y = ev._y;
            ctxi.clearRect(0, 0, ctxi.canvas.width, ctxi.canvas.height);
            ctxi.strokeRect(tool.x, tool.y, 1, 1);
        };
    }

    function moveDragEvent() {
        return function(ev) {
            if (tool.started) {
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
        };
    }

    function releaseDragEvent() {
        return function(ev) {
            if (tool.started) {
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
                // need to convert x, y pixels to intervals on chromosomes and scores
                canvasToChr(x1, x2);
                canvasToScore(y1, y2);
                var chrRangeString = JSON.stringify(chrRange);
                tool.started = false;
//                ctxi.clearRect(0, 0, ctxi.canvas.width, ctxi.canvas.height);
                // console.log([scoreB, scoreA, chrRangeString]);
                // renderGO(build_where([scoreB, scoreA, chrRange]));
            }
        };
    }
	
	function build_where(json) {
		var where = json[0] + ' <= score <= ' + json[1] + ' and (';
		for (var i=0; i < json[2].length; i++) {
			if (i>0) {
				where += ' or ';
			}
			where += '( chr == \'' + json[2][i][0] + '\' and ' + json[2][i][1] + ' <= pos <= ' + json[2][i][2] + ')';
		}
		where += ')';
		return encodeURIComponent(where);
	}
};

    return ManhattanPlot;
});