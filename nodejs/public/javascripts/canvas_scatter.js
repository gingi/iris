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


function do_scatter(ctx,study,chr,offset,xsize,ysize,chr_length) {
	$.getJSON("/scatter/GWAS/"+study+"/"+chr+"/"+Math.floor(xsize)+"/"+Math.floor(ysize)+"/"+1+"/"+0+"/"+chr_length+"/"+0+"/"+global_max,
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
				var width = xfactor*(rect[1]-rect[0]);
				var height = yfactor*(rect[3]-rect[2]);
				var x = xfactor*rect[0] + offset;
				var y = ysize - height - yfactor*rect[2];
				if (height < 1) {height=1;}
				if (width < 1) {width = 1;}
				if (height * width < 4) {
					ctx.fillRect(Math.floor(x),Math.floor(y),2,2);
				} else {
					ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(width),Math.ceil(height));
				}
			}
		});
}
