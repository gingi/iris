var global_min = 0;
var global_max = 0;
var chr_lengths = new Array();
var total_len = 0;
function manhattan_plot(canvasid,study) {
	// fetch the list of chromosomes and their lengths
	$.getJSON("/chromosomes/at",
		function(json1) {
			for(var i=0;i<json1.length;i++) {
				chr_lengths[i] = json1[i][1];
				total_len += json1[i][1];
			}
			// fetch the max score for this study
			$.getJSON("/maxscore/GWAS/"+study,
			function(json2) {
				global_max = Math.ceil(json2[0][0]);
				draw_manhattan(canvasid,study);
			}
		);
	});
}

function draw_manhattan(canvasid,study) {
  // get the canvas
	var canvas = document.getElementById(canvasid);
	var ctx = canvas.getContext('2d');
	ctx.canvas.width = window.innerWidth-20;
	ctx.canvas.height = window.innerHeight - 20;
	ctx.strokeStyle="black";
	ctx.strokeRect(0,0,ctx.canvas.width,ctx.canvas.height);
	var offset=0;
	var ysize = ctx.canvas.height;
	for(var i=0;i<chr_lengths.length;i++) {
		var xsize = ctx.canvas.width*(chr_lengths[i]/total_len);
		do_scatter(ctx,study,i+1,offset,xsize,ysize,chr_lengths[i]);
		offset += xsize;
	}
}


var sc = 2;
function do_scatter(ctx,study,chr,offset,xsize,ysize,chr_length) {
	var minbins=3;
	var fudge = 0.99;
	$.getJSON("/scatter/GWAS/"+study+"/"+chr+"/"+Math.floor(xsize/sc)+"/"+Math.floor(ysize/sc)+"/"+fudge+"/"+0+"/"+chr_length+"/"+0+"/"+global_max+"/"+minbins,
		function(json) {
			var xrange = chr_length;
			var yrange = global_max;
			var xfactor = xsize/xrange;
			var yfactor = ysize/yrange;
			if (chr % 2 === 0) {
				ctx.fillStyle="darkorange";
			} else {
				ctx.fillStyle="black";
			}
			for(var i=0; i<json.data.length; i++) {
				var rect = json.data[i];
				if (rect.length == 2) {
					// not a rectangle, just a point
					var x = xfactor*rect[0] + offset;
					var y = ysize - sc - yfactor*rect[1];
					ctx.fillRect(Math.floor(x),Math.floor(y),sc,sc);
				} else {
					var width = xfactor*(rect[1]-rect[0]);
					var height = sc+yfactor*(rect[3]-rect[2]);
					var x = xfactor*rect[0] + offset;
					var y = ysize - height - yfactor*rect[2];
					if (height < sc) {height=sc;}
					if (width < sc) {width = sc;}
					if (height * width < 0) {
						ctx.fillRect(Math.floor(x),Math.floor(y),sc,sc);
					} else {
						ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(width),Math.ceil(height));
					}
				}
			}
		});
}

function manhattan_plot_dots(canvasid,study) {
	// fetch the list of chromosomes and their lengths
	$.getJSON("/chromosomes/at",
		function(json1) {
			for(var i=0;i<json1.length;i++) {
				chr_lengths[i] = json1[i][1];
				total_len += json1[i][1];
			}
			// fetch the max score for this study
			$.getJSON("/maxscore/GWAS/"+study,
			function(json2) {
				global_max = Math.ceil(json2[0][0]);
				draw_manhattan_dots(canvasid,study);
			}
		);
	});
}
var ctxi;
function draw_manhattan_dots(canvasid,study) {
  // get the canvas
	var canvas = document.getElementById(canvasid);
	var ctx = canvas.getContext('2d');
	ctx.canvas.width = window.innerWidth-20;
	ctx.canvas.height = window.innerHeight - 20;
	ctx.strokeStyle="black";
	ctx.strokeRect(0,0,ctx.canvas.width,ctx.canvas.height);

	// resize the interactive layer
	var canvasi = document.getElementById(canvasid+'i');
	ctxi = canvasi.getContext('2d');
	ctxi.canvas.width = ctx.canvas.width;
	ctxi.canvas.height = ctx.canvas.height;

	tool = new drag_select();

	// add event listeners
	canvasi.addEventListener('mousedown', ev_canvas, false);
	canvasi.addEventListener('mousemove', ev_canvas, false);
	canvasi.addEventListener('mouseup',   ev_canvas, false);


	var offset=0;
	var ysize = ctx.canvas.height;
	for(var i=0;i<chr_lengths.length;i++) {
		var xsize = ctx.canvas.width*(chr_lengths[i]/total_len);
		do_scatter_dots(ctx,study,i+1,offset,xsize,ysize,chr_lengths[i]);
		offset += xsize;
	}
}


function do_scatter_dots(ctx,study,chr,offset,xsize,ysize,chr_length) {
	$.getJSON("/scatter/GWAS/nobinning/"+study+"/"+chr,
		function(json) {
			var xrange = chr_length;
			var yrange = global_max;
			var xfactor = xsize/xrange;
			var yfactor = ysize/yrange;
			if (chr % 2 === 0) {
				ctx.fillStyle="darkorange";
			} else {
				ctx.fillStyle="black";
			}
			for(var i=0; i<json.length; i++) {
				var x = xfactor*json[i][0] + offset;
				var y = ysize - 2 - yfactor*json[i][1];
				ctx.fillRect(Math.floor(x),Math.floor(y),sc,sc);
			}
		});
}

function drag_select () {
	var tool = this;
	this.started = false;
	
	this.mousedown = function (ev) {
		tool.started = true;
		tool.x = ev._x;
		tool.y = ev._y;
		ctxi.clearRect(0,0,ctxi.canvas.width,ctxi.canvas.height);
		ctxi.strokeRect(tool.x,tool.y,1,1);
	};
	
	this.mousemove = function (ev) {
		if (tool.started) {
			var x1 = tool.x;
			var y1 = tool.y;
			var x2 = ev._x;
			var y2 = ev._y;
			if (x2 - x1 > 1) {
				x1++;
				x2--;
				if (y2 - y1 > 1) {
					y1++;
					y2--;
					ctxi.clearRect(x1,y1,x2,y2);
				} else if (y1 - y2 > 1) {
					y1--;
					y2++;
					ctxi.clearRect(x1,y1,x2,y2);
				}
			} else if (x1 - x2 > 1) {
				x1--;
				x2++;
				if (y2 - y1 > 1) {
					y1++;
					y2--;
					ctxi.clearRect(x1,y1,x2,y2);
				} else if (y1 - y2 > 1) {
					y1--;
					y2++;
					ctxi.clearRect(x1,y1,x2,y2);
				}
			}
			ctxi.strokeRect(tool.x, tool.y, ev._x - tool.x + 1, ev._y - tool.y + 1);
		}
	};
	
	this.mouseup = function(ev) {
		if (tool.started) {
			alert("selected rectangle (" + tool.x + "," + tool.y + "," + ev._x + "," + ev._y + ")");
			tool.started = false;
		}
	};
}

function ev_canvas (ev) {
	if (ev.layerX || ev.layerX == 0) {
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}
	var func = drag_select[ev.type];
	if (func) {
		func(ev)
	}
}