define(['jquery'], function ($) {

    function ManhattanPlot(element, args) {
        var self = this;

        var ctx;
        var ctxi;
        var canvasi;
        var tool = new Object();
        tool.started = false;
        var global_min = 0;
        var globalMax = 0;
        var totalLen = 0;
        var sc = 2;
        var radius = 1.5;
        var circles = true;
        var XGUTTER = 10;
        var colorByDensity = true;
        var chrRange = new Array();
        var scoreA;
        var scoreB;
		var chrNames = [];

        var chromosomes, variations, maxscore, chrXsize;
        self.setData = function (data) {
            chromosomes = data.chromosomes;
            for (var chr in chromosomes) {
                chrNames.push(chr);
            }
            chrNames = chrNames.sort(function (a, b) {
                return chromosomes[b] - chromosomes[a];
            });
            variations  = data.variations;
            maxscore    = 1 - Math.log(data.maxscore);
        };
        self.display = function (args) {
            args = (args || {});
    		var myDiv = $(element);
    		myDiv.append('<div id="' + element.id + '_man">');
    		var div = $(document.getElementById(element.id + "_man"));
            var canvasHeight = Math.max(div.height(), 500);
            var canvasWidth = Math.max(div.width(), 300);
            div.append('<canvas id="' + element.id + '_canvas", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:0;"></canvas>');
            div.append('<canvas id="' + element.id + '_canvasi", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:1;"></canvas>');
            div.height(canvasHeight);

            var canvas = document.getElementById(element.id + "_canvas");
            canvasi = document.getElementById(element.id + "_canvasi");
            ctx = canvas.getContext('2d');
            ctxi = canvasi.getContext('2d');

    		totalLen = 0;
            for (var chr in chromosomes) {
                totalLen += parseInt(chromosomes[chr]);
            }

            globalMax = Math.ceil(maxscore);
            drawManhattan();
        };

    function drawManhattan() {
        ctx.strokeStyle = "black";

        ctxi.strokeStyle = "red";
        ctxi.fillStyle = "rgba(255,0,0,0.3)";

        // add event listeners
        canvasi.addEventListener('mousedown', startDragEvent(), false);
        canvasi.addEventListener('mousemove', moveDragEvent(), false);
        canvasi.addEventListener('mouseup', releaseDragEvent(), false);

        var offset = XGUTTER;
        var ysize = ctx.canvas.height;
        var xstarts = {};
        var colors  = {};
        var xfactor =
            (ctx.canvas.width - (XGUTTER * chrNames.length - 1)) / totalLen;
        var yfactor = ctx.canvas.height / globalMax;
        for (var i = 0; i < chrNames.length; i++) {
            var chr = chrNames[i];
            var xsize = xfactor * chromosomes[chr];
            xstarts[chr] = offset;
            offset += xsize + XGUTTER;
            if (i % 2 === 0) {
                colors[chr] = {
                    min: [150, 150, 150],
                    max: [0, 0, 0]
                };
            } else {
                colors[chr] = {
                    min: [255, 165, 0],
                    max: [255, 15, 0]
                }
            }
        }

        function color(r, cc, c) {
            return cc.min[c] + Math.floor(r * (cc.max[c] - cc.min[c]));
        };
        for (var i = 0; i < variations.length; i++) {
            var chr = variations[i][0];
            var xcoord = parseInt(variations[i][1]);
            var pval   = 1 - Math.log(parseFloat(variations[i][2]));
            var x = xstarts[chr] + (xfactor * xcoord);
            var y = ysize - yfactor * pval;

            var ratio = parseFloat(variations[i][2]) / globalMax;
            var r = color(ratio, colors[chr], 0);
            var g = color(ratio, colors[chr], 1);
            var b = color(ratio, colors[chr], 2);

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";

            if (circles) {
                ctx.beginPath();
                ctx.arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI, true);
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
                console.log([scoreB, scoreA, chrRangeString]);
				renderGO(build_where([scoreB, scoreA, chrRange]));
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