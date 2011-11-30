var ctxi;
tool = new Object();
tool.started = false;
var global_min = 0;
var global_max = 0;
var chr_lengths = new Array();
var total_len = 0;
var sc = 2;
var circles = true;
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

	// resize the interactive layer
	var canvasi = document.getElementById(canvasid+'i');
	ctxi = canvasi.getContext('2d');
	ctxi.canvas.width = ctx.canvas.width;
	ctxi.canvas.height = ctx.canvas.height;
	ctxi.strokeStyle="red";
	ctxi.fillStyle = "rgba(255,0,0,0.3)";

	// add event listeners
	canvasi.addEventListener('mousedown', ev_mousedown, false);
	canvasi.addEventListener('mousemove', ev_mousemove, false);
	canvasi.addEventListener('mouseup',   ev_mouseup, false);
	
	var offset=0;
	var ysize = ctx.canvas.height;
	for(var i=0;i<chr_lengths.length;i++) {
		var xsize = ctx.canvas.width*(chr_lengths[i]/total_len);
		do_scatter(ctx,study,i+1,offset,xsize,ysize,chr_lengths[i]);
		offset += xsize;
	}
}
var chr_range = new Array();
function canvas_to_chr(a,b) {
	chr_range = [];
	var offset=0;
	var a_chr=0;
	var b_chr=0;
	for(var i=0;i<chr_lengths.length;i++) {
		var chr_xsize = ctxi.canvas.width*(chr_lengths[i]/total_len);
		if (a >= offset && a <= offset + chr_xsize) {
			a_chr = i+1;
			a_pos = Math.floor(chr_lengths[i]*(a-offset)/chr_xsize);
		}
		if (b >= offset && b <= offset + chr_xsize) {
			b_chr = i+1;
			b_pos = Math.ceil(chr_lengths[i]*(b-offset)/chr_xsize);
		}
		offset += chr_xsize;
	}
	if (a_chr <= b_chr && a_chr > 0) {
		if (a_chr === b_chr) {
			chr_range[0] = [a_chr,a_pos,b_pos];
		} else if (a_chr === b_chr - 1) {
			chr_range[0] = [a_chr,a_pos,chr_lengths[a_chr-1]];
			chr_range[1] = [b_chr,0,b_pos];
		} else {
			chr_range[0] = [a_chr,a_pos,chr_lengths[a_chr-1]];
			for(var i=1; i < b_chr - a_chr; i++) {
				chr_range[i] = [a_chr+i,0,chr_lengths[a_chr+i-1]];				
			}
			chr_range[b_chr-a_chr] = [b_chr,0,b_pos];
		}
	}
}
var score_a;
var score_b;
function canvas_to_score(a,b) {
	score_a = global_max*(ctxi.canvas.height - a)/ctxi.canvas.height;
	score_b = global_max*(ctxi.canvas.height - b)/ctxi.canvas.height;
}

function do_scatter(ctx,study,chr,offset,xsize,ysize,chr_length) {
	$.getJSON("/scatter/GWAS/"+study+"/"+chr+"/"+Math.floor(xsize/sc)+"/"+Math.floor(ysize/sc)+"/"+0+"/"+chr_length+"/"+0+"/"+global_max,
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
				if (rect.length == 3) {
					// not a rectangle, just a point
					var x = xfactor*rect[0] + offset;
					var y = ysize - yfactor*rect[1];
					if (circles) {
						ctx.beginPath();
						ctx.arc(Math.floor(x),Math.floor(y),sc,0,2*Math.PI,true);
						ctx.closePath();
						ctx.fill();
					} else {
						ctx.fillRect(Math.floor(x),Math.floor(y),sc,sc);
					}
				} else {
					var width = xfactor*(rect[1]-rect[0]);
					var height = sc+yfactor*(rect[3]-rect[2]);
					var x = xfactor*rect[0] + offset;
					var y = ysize - height - yfactor*rect[2];
					if (height < sc) {height=sc;}
					if (width < sc) {width = sc;}
					ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(width),Math.ceil(height));
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
	ctxi.strokeStyle="red";
	ctxi.fillStyle = "rgba(255,0,0,0.3)";

	// add event listeners
	canvasi.addEventListener('mousedown', ev_mousedown, false);
	canvasi.addEventListener('mousemove', ev_mousemove, false);
	canvasi.addEventListener('mouseup',   ev_mouseup, false);


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
				var y = ysize - yfactor*json[i][1];
				if (circles) {
					ctx.beginPath();
					ctx.arc(Math.floor(x),Math.floor(y),sc,0,2*Math.PI,true);
					ctx.closePath();
					ctx.fill();
				} else {
					ctx.fillRect(Math.floor(x-sc/2),Math.floor(y+sc/2),sc,sc);
				}
			}
		});
}

function ev_mousedown (ev) {
	if (ev.layerX || ev.layerX == 0) {
		ev._x = ev.layerX;
		ev._y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		ev._x = ev.offsetX;
		ev._y = ev.offsetY;
	}
	tool.started = true;
	tool.x = ev._x;
	tool.y = ev._y;
	ctxi.clearRect(0,0,ctxi.canvas.width,ctxi.canvas.height);
	ctxi.strokeRect(tool.x,tool.y,1,1);
}
	
function ev_mousemove (ev) {
	if (tool.started) {
		if (ev.layerX || ev.layerX == 0) {
			ev._x = ev.layerX;
			ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) {
			ev._x = ev.offsetX;
			ev._y = ev.offsetY;
		}
		var x = tool.x < ev._x ? tool.x : ev._x;
		var y = tool.y < ev._y ? tool.y : ev._y;
		var width=Math.abs(ev._x - tool.x + 1);
		var height=Math.abs(ev._y - tool.y + 1);
		ctxi.clearRect(0,0,ctxi.canvas.width,ctxi.canvas.height);
		ctxi.fillRect(x,y,width,height);
		ctxi.strokeRect(x, y, width, height);
	}
}
	
function ev_mouseup (ev) {
	if (tool.started) {
		if (ev.layerX || ev.layerX == 0) {
			ev._x = ev.layerX;
			ev._y = ev.layerY;
		} else if (ev.offsetX || ev.offsetX == 0) {
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
		canvas_to_chr(x1,x2);
		canvas_to_score(y1,y2);
		var chr_range_string = JSON.stringify(chr_range);
		alert("selected rectangle (" + x1 + "," + y1 + "," + x2 + "," + y2 + ") - score range=["+score_b+","+score_a+"] chr_range="+chr_range_string);
		tool.started = false;
		ctxi.clearRect(0,0,ctxi.canvas.width,ctxi.canvas.height);
	}
}
