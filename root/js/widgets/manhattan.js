(function () {
    var widget = Iris.Widget.create({
        about: {
            name: "Manhattan",
            author: "Andrew Olson",
            requires: [],
            renderers: {
                default: "scatterplot.js"
            },
        }
    });

    var ctx;
    var ctxi;
    var canvasi;
    var tool = new Object();
    tool.started = false;
    var global_min = 0;
    var globalMax = 0;
    var chrLengths = new Array();
    var totalLen = 0;
    var sc = 2;
    var radius = 2;
    var circles = true;
    var XGUTTER = 10;
    var colorByDensity = true;
    var containerNode;
    var chrRange = new Array();
    var scoreA;
    var scoreB;
    var mincolor = new Array();
    var maxcolor = new Array();

    widget.display = function(args) {
        var div = $("#" + widget.divId);
        div.text('');
        containerNode = div;
        var canvasHeight = Math.max(div.height(), 250);
        var canvasWidth = Math.max(div.width(), 100);
        div.append('<canvas id="' + widget.divId + '_canvas", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:0;"></canvas>');
        div.append('<canvas id="' + widget.divId + '_canvasi", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:1;"></canvas>');
        div.height(canvasHeight);

        // div.parent.height = canvasHeight;
        // div.parent.width = canvasWidth;

        var canvas = document.getElementById(widget.divId + "_canvas");
        canvasi = document.getElementById(widget.divId + "_canvasi");
        ctx = canvas.getContext('2d');
        ctxi = canvasi.getContext('2d');

        var study = (args.hasOwnProperty('study')) ? args['study'] : 3396;
        var species = (args.hasOwnProperty('species')) ? args['species'] : 'at';

        // fetch the list of chromosomes and their lengths
		totalLen = 0;
        widget.getJSON("/species/" + species + "/chromosomes", function(json) {
            for (var i = 0; i < json.length; i++) {
                chrLengths[i] = json[i][1];
                totalLen += json[i][1];
            }
            // fetch the max score for this study
            widget.getJSON("/gwas/" + study + "/maxscore", function(json) {
                globalMax = Math.ceil(json[0][0]);
                drawManhattan(study);
            });
        });
    };

    function drawManhattan(study, cvs) {
        // get the canvas
        ctx.strokeStyle = "black";

        ctxi.strokeStyle = "red";
        ctxi.fillStyle = "rgba(255,0,0,0.3)";

        // add event listeners
        canvasi.addEventListener('mousedown', startDragEvent(), false);
        canvasi.addEventListener('mousemove', moveDragEvent(), false);
        canvasi.addEventListener('mouseup', releaseDragEvent(), false);

        var offset = XGUTTER;
        var ysize = ctx.canvas.height;
        for (var i = 0; i < chrLengths.length; i++) {
            var xsize = (ctx.canvas.width - XGUTTER) * (chrLengths[i] / totalLen) - XGUTTER;
            doScatter(ctx, study, i + 1, offset, xsize, ysize, chrLengths[i]);
            offset += xsize + XGUTTER;
        }
    }

    function canvasToChr(a, b) {
        chrRange = [];
        var offset = XGUTTER;
        var aChr = 0;
        var bChr = 0;
        var gutters = (chrLengths.length + 1) * XGUTTER;
        var nt2px = (ctxi.canvas.width - gutters) / totalLen;
        var aPos, bPos;
        for (i = 0; i < chrLengths.length; i++) {
            var chrXsize = nt2px * chrLengths[i];
            if (a >= offset - XGUTTER && a <= offset + chrXsize) {
                aChr = i + 1;
                aPos = Math.floor(chrLengths[i] * Math.max(a - offset, 0) / chrXsize);
            }
            if (b >= offset && b <= offset + chrXsize + XGUTTER) {
                bChr = i + 1;
                bPos = Math.ceil(chrLengths[i] * Math.max(b - offset, 0) / chrXsize);
            }
            offset += chrXsize + XGUTTER;
        }
        if (aChr <= bChr && aChr > 0) {
            if (aChr === bChr) {
                chrRange[0] = [aChr, aPos, bPos];
            } else if (aChr === bChr - 1) {
                chrRange[0] = [aChr, aPos, chrLengths[aChr - 1]];
                chrRange[1] = [bChr, 0, bPos];
            } else {
                chrRange[0] = [aChr, aPos, chrLengths[aChr - 1]];
                for (i = 1; i < bChr - aChr; i++) {
                    chrRange[i] = [aChr + i, 0, chrLengths[aChr + i - 1]];
                }
                chrRange[bChr - aChr] = [bChr, 0, bPos];
            }
        }
    }

    function canvasToScore(a, b) {
        scoreA = globalMax * (ctxi.canvas.height - a) / ctxi.canvas.height;
        scoreB = globalMax * (ctxi.canvas.height - b) / ctxi.canvas.height;
    }

    function doScatter(ctx, study, chr, offset, xsize, ysize, chrLen) {
        var path = "/gwas/" + study + "/scatter" + "?chr=" + chr + "&b1=" + Math.floor(xsize / sc) + "&b2=" + Math.floor(ysize / sc) + "&x1=" + chrLen + "&x2=" + globalMax;
        widget.getJSON(path, function(json) {
            var xrange = chrLen;
            var yrange = globalMax;
            var xfactor = xsize / xrange;
            var yfactor = ysize / yrange;
            if (chr % 2 === 0) {
                ctx.fillStyle = "darkorange";
                mincolor = [255, 165, 0];
                maxcolor = [255, 0, 0];
            } else {
                ctx.fillStyle = "black";
                mincolor = [150, 150, 150];
                maxcolor = [0, 0, 0];
            }
            for (var i = 0; i < json.data.length; i++) {
                var rect = json.data[i];
                if (rect.length == 3) {
                    // not a rectangle, just a point
                    var x = xfactor * rect[0] + offset;
                    var y = ysize - yfactor * rect[1];

                    if (colorByDensity) {
                        var ratio = rect[2] / json.max;
                        var r = mincolor[0] + Math.floor(ratio * (maxcolor[0] - mincolor[0]));
                        var g = mincolor[1] + Math.floor(ratio * (maxcolor[1] - mincolor[1]));
                        var b = mincolor[2] + Math.floor(ratio * (maxcolor[2] - mincolor[2]));

                        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    }

                    if (circles) {
                        ctx.beginPath();
                        ctx.arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI, true);
                        ctx.closePath();
                        ctx.fill();
                    } else {
                        ctx.fillRect(Math.floor(x), Math.floor(y), sc, sc);
                    }
                } else {
                    var width = xfactor * (rect[1] - rect[0]);
                    var height = sc + yfactor * (rect[3] - rect[2]);
                    x = xfactor * rect[0] + offset;
                    y = ysize - height - yfactor * rect[2];
                    if (height < sc) {
                        height = sc;
                    }
                    if (width < sc) {
                        width = sc;
                    }
                    ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(width), Math.ceil(height));
                }
            }
        });
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
                ctxi.clearRect(0, 0, ctxi.canvas.width, ctxi.canvas.height);
                console.log([scoreB, scoreA, chrRangeString]);
                // getManager().notify(containerNode.id, [scoreB, scoreA, chrRangeString]);
            }
        };
    }
})();