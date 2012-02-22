var ctxi;
tool = new Object();
tool.started = false;
var PADDING_TOP = 40;
var PADDING_BOTTOM = 40;
var PADDING_SIDES = 20;
var AXIS_WIDTH = 1;
var color_by_density = true;
var containerNode;

var limits = new Object();
function build_sql(limits) {
	return "total > 2.0";
}

function pcoords(canvasid,table) {
	// fetch the list of columns in the table
	// and their min and max values
	$.getJSON("/data/ranges/"+table,
		function(json) {
  		// get the canvas
			var canvas = document.getElementById(canvasid);
			var ctx = canvas.getContext('2d');

			// initialize canvas for context layer
			containerNode = canvas.parentNode.parentNode;
			var canvasHeight = Math.max(containerNode.clientHeight, 250);
			var canvasWidth  = Math.max(containerNode.clientWidth,  400);
  		ctx.canvas.width  = canvasWidth;
  		ctx.canvas.height = canvasHeight;
			ctx.strokeStyle="black";
    	ctx.strokeRect(0,0,ctx.canvas.width,ctx.canvas.height);

			// initialize the focus layer
			var canvasf = document.getElementById(canvasid+'f');
			ctxf = canvasf.getContext('2d');
			ctxf.canvas.width = ctx.canvas.width;
			ctxf.canvas.height = ctx.canvas.height;
			ctxf.strokeStyle="black";
			ctxf.fillStyle = "black";

			// resize the interactive axis layer
			var canvasi = document.getElementById(canvasid+'i');
			ctxi = canvasi.getContext('2d');
			ctxi.canvas.width = ctx.canvas.width;
			ctxi.canvas.height = ctx.canvas.height;
			ctxi.strokeStyle="black";
			ctxi.fillStyle = "black";

			// TODO: add event handlers
	
			var ysize = ctx.canvas.height - PADDING_TOP - PADDING_BOTTOM;
			var xsize = (ctx.canvas.width - 2*PADDING_SIDES - json.length*AXIS_WIDTH)/(json.length - 1);

			var offset=PADDING_SIDES;
			draw_axis(ctxi,json[0],offset,ysize);
			for(var i=1;i<json.length;i++) {
				offset += AXIS_WIDTH;
				do_pcoords(ctx,table,json[i-1],json[i],offset,offset+xsize,ysize,"context");
				do_pcoords(ctxf,table,json[i-1],json[i],offset,offset+xsize,ysize,"focus");
				offset += xsize;
				draw_axis(ctxi,json[i],offset,ysize);
			}
	});
}

function draw_axis(ctx,column,offset,ysize) {
	var center = offset + Math.floor(AXIS_WIDTH/2);
	var top = PADDING_TOP - 10;
	var bottom = top + ysize + 20;
	
	// axis line
	ctx.fillRect(center,top,1,ysize + 20);

	// TODO: some tick marks and labels would be nice

	// Top arrow
	ctx.beginPath();
	ctx.moveTo(center,top);
	ctx.lineTo(center + 4, top + 9);
	ctx.lineTo(center - 3, top + 9);
	ctx.lineTo(center,top);
	ctx.closePath();
	ctx.fill();

	// Bottom arrow
	ctx.beginPath();
	ctx.moveTo(center,bottom);
	ctx.lineTo(center + 4, bottom - 9);
	ctx.lineTo(center - 3, bottom - 9);
	ctx.lineTo(center,bottom);
	ctx.closePath();
	ctx.fill();

	// axis label
	var text = ctx.measureText(column[0]);
	ctx.fillText(column[0],center - text.width/2,top-3);
	ctx.fillText(column[0],center - text.width/2,bottom+10);
}

var mincolor = new Array();
var maxcolor = new Array();
function do_pcoords(ctx,table,c1_arr,c2_arr,xmin,xmax,ysize,layer) {
	var nbins = Math.floor(ysize/1);
	var url = "/data/pcoords/" + table
		+ "?c1=" + c1_arr[0]
		+ "&c2=" + c2_arr[0]
		+ "&b1=" + nbins
		+ "&b2=" + nbins
		+ "&n1=" + c1_arr[1]
		+ "&n2=" + c2_arr[1]
		+ "&x1=" + c1_arr[2]
		+ "&x2=" + c2_arr[2];
	if (layer === "focus") {
		url += '&w=' + build_sql(limits); 
	}
	$.getJSON(url,
		function(json) {
			ctx.fillStyle="black";
			if (layer === "focus") {
				//yellow-orange
				maxcolor = [220,140,0];
				mincolor = [255,180,0];
			} else {
				// gray
				maxcolor = [10,10,10];
				mincolor = [100,100,100];

				// brown
				maxcolor = [120,50,0];
				mincolor = [139,69,19];

				// blue
				maxcolor = [0,50,100];
				mincolor = [0,50,200];
			}
			var rank = new Array();
			rank[0]=1;
			for(var i=1; i<json.data.length; i++) {
				if (json.data[i-1][4] === json.data[i][4]) {
					rank[i] = rank[i-1];
				} else {
					rank[i] = rank[i-1] + 1;
				}
			}
			var max_rank = rank[json.data.length - 1];
			var f1 = ysize/(c1_arr[2]-c1_arr[1]);
			var f2 = ysize/(c2_arr[2]-c2_arr[1]);
			for(var i=0; i<json.data.length; i++) {
				var rect = json.data[i];
				if (color_by_density) {
					var ratio = rect[4]/json.max;
					ratio = rank[i]/max_rank;
					var r = mincolor[0] + Math.floor(ratio*(maxcolor[0]-mincolor[0]));
					var g = mincolor[1] + Math.floor(ratio*(maxcolor[1]-mincolor[1]));
					var b = mincolor[2] + Math.floor(ratio*(maxcolor[2]-mincolor[2]));

					ctx.fillStyle="rgba(" + r + "," + g + "," + b + "," + "0.1)";
				}
				ctx.beginPath();
				ctx.moveTo(xmin,PADDING_TOP + ysize - f1*(rect[0]-c1_arr[1]));
				ctx.lineTo(xmin,PADDING_TOP + ysize - f1*(rect[1]-c1_arr[1]));
				ctx.lineTo(xmax,PADDING_TOP + ysize - f2*(rect[3]-c2_arr[1]));
				ctx.lineTo(xmax,PADDING_TOP + ysize - f2*(rect[2]-c2_arr[1]));
				ctx.closePath();
				ctx.fill();
			}
		});
}

