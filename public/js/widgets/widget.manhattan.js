(function() {
    var widget = Iris.Widget.extend({
        about: {
			title: "Manhattan Plot",
            name: "manhattan",
            author: "Andrew Olson",
            requires: []
        }
    });

	// widget.setup = function () {
	// 	return [ this.loadRenderer('table'), this.loadRenderer('piechart') ];
	// }

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
    var chrRange = new Array();
    var scoreA;
    var scoreB;
    var mincolor = new Array();
    var maxcolor = new Array();

	var goDiv1;
	var goDiv2;
	var study;
	var tooSmall = 0.03;
	var GOWidth;

    widget.display = function(element, args) {
        args = (args || {});
		var myDiv = $(element);
		myDiv.append('<div id="' + element.id + '_man">');
		var div = $(document.getElementById(element.id + "_man"));
        var canvasHeight = Math.max(div.height(), 250);
        var canvasWidth = Math.max(div.parent().width(), 100);
		GOWidth = Math.min(Math.floor(canvasWidth/2), 300);
        div.append('<canvas id="' + element.id + '_canvas", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:0;"></canvas>');
        div.append('<canvas id="' + element.id + '_canvasi", width=' + canvasWidth + ' height=' + canvasHeight + ' style="position:absolute;left:0;top:0;z-index:1;"></canvas>');
        div.height(canvasHeight);

		// myDiv.append('<div id="' + element.id + '_goTable" style="position:absolute;left:0px;top:' + canvasHeight + 'px;z-index:0;">');
		// myDiv.append('<div id="' + element.id + '_goPie" style="position:absolute;left:' + GOWidth + 'px;top:' + canvasHeight + 'px;z-index:0;">');
		myDiv.append('<div id="' + element.id + '_goTable">');
		myDiv.append('<div id="' + element.id + '_goPie">');
		goDiv1 = document.getElementById(element.id + "_goPie");
		goDiv2 = document.getElementById(element.id + "_goTable");
		
        // div.parent.height = canvasHeight;
        // div.parent.width = canvasWidth;

        var canvas = document.getElementById(element.id + "_canvas");
        canvasi = document.getElementById(element.id + "_canvasi");
        ctx = canvas.getContext('2d');
        ctxi = canvasi.getContext('2d');

        study = (args.hasOwnProperty('study')) ? args['study'] : 3396;
        var species = (args.hasOwnProperty('species')) ? args['species'] : 'at';

		renderGO();

        // fetch the list of chromosomes and their lengths
		totalLen = 0;
        widget.getJSON("/species/" + species + "/chromosomes", function (json) {
            for (var chr in json) {
                chrLengths[chr] = json[chr];
                totalLen += parseInt(json[chr]);
            }
            // fetch the max score for this study
            widget.getJSON("/gwas/" + study + "/maxscore", function (json) {
                globalMax = Math.ceil(json[0][0]);
                drawManhattan(study);
            });
        });
    };


	function renderGO(limits) {
		var url = "/gwas/" + study + "/GO";
		if (limits) {
			url += "?w=" + limits;
		}
		widget.getJSON(url, function (json) {
			Iris.Renderer.table.render( { target: goDiv2, width: GOWidth, height: GOWidth, data: {data: json, header: ["GOSlim term", "Genes"]}});
			// combine tiny slices of the pie into an "Other" category
			var sum=0;
			for( var i=0; i<json.length; i++) {
				sum += json[i][1];
			}
			var cutoff = sum*tooSmall;
			var pieData = new Array();
			var other=0;
			for (var i=0; i<json.length; i++) {
				if (json[i][1] < cutoff) {
					other += json[i][1];
				} else {
					pieData.push(json[i]);
				}
			}
			if (other > 0) {
				pieData.push(["Others", other]);
			}
			Iris.Renderer.piechart.render( {target: goDiv1, data: pieData, width: GOWidth, height: GOWidth, radius: Math.floor(GOWidth/2)})
		});
	}

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
        for (var chr in chrLengths) {
            var xsize = (ctx.canvas.width - XGUTTER) * (chrLengths[chr] / totalLen) - XGUTTER;
            doScatter(ctx, study, chr, offset, xsize, ysize, chrLengths[chr]);
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
		var chrNames = new Array();
		for (var chr in chrLengths) {
			chrNames.push(chr);
		}
        for (i = 0; i < chrNames.length; i++) {
			var chr = chrNames[i];
            var chrXsize = nt2px * chrLengths[chr];
            if (a >= offset - XGUTTER && a <= offset + chrXsize) {
                aChr = i;
                aPos = Math.floor(chrLengths[chr] * Math.max(a - offset, 0) / chrXsize);
            }
            if (b >= offset && b <= offset + chrXsize + XGUTTER) {
                bChr = i;
                bPos = Math.ceil(chrLengths[chr] * Math.max(b - offset, 0) / chrXsize);
            }
            offset += chrXsize + XGUTTER;
        }
        if (aChr <= bChr) {
            if (aChr === bChr) {
                chrRange[0] = [chrNames[aChr], aPos, bPos];
            } else if (aChr === bChr - 1) {
                chrRange[0] = [chrNames[aChr], aPos, chrLengths[chrNames[aChr]]];
                chrRange[1] = [chrNames[bChr], 0, bPos];
            } else {
                chrRange[0] = [chrNames[aChr], aPos, chrLengths[chrNames[aChr]]];
                for (i = 1; i < bChr - aChr; i++) {
                    chrRange[i] = [chrNames[aChr + i], 0, chrLengths[chrNames[aChr + i]]];
                }
                chrRange[bChr - aChr] = [chrNames[bChr], 0, bPos];
            }
        }
    }

    function canvasToScore(a, b) {
        scoreA = globalMax * (ctxi.canvas.height - a) / ctxi.canvas.height;
        scoreB = globalMax * (ctxi.canvas.height - b) / ctxi.canvas.height;
    }

    function doScatter(ctx, study, chr, offset, xsize, ysize, chrLen) {
        var path = "/gwas/" + study + "/scatter" + "?chr=" + chr + "&b1=" + Math.floor(xsize / sc) + "&b2=" + Math.floor(ysize / sc) + "&x1=" + chrLen + "&x2=" + globalMax;
        widget.getJSON(path, function (json) {
			if (! json) {
				return;
			}
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
	
})();