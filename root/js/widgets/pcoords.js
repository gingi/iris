function Pcoords() {
    Widget.call(this);
    this.tool = new Object();
    this.tool.started = false;
    this.PADDING_TOP = 40;
    this.PADDING_BOTTOM = 40;
    this.PADDING_SIDES = 20;
    this.AXIS_WIDTH = 1;
    this.color_by_density = true;
    this.containerNode;
    this.limits = new Object();
    this.mincolor = new Array();
    this.maxcolor = new Array();
};
Pcoords.prototype = new Widget();

// Implements widget_prototype.render
Pcoords.prototype.render = function(divId, args) {
    var div = $("#" + divId);
	div.text('');
    this.containerNode = div;
    var canvasHeight = Math.max(div.height(), 250);
    var canvasWidth = Math.max(div.width(), 400);
    div.height(canvasHeight);
    div.width(canvasWidth);
    var createCanvas = function(args) {
        var canvasId = divId + '_canvas' + args['suffix'];
        var style = [
            "position:absolute",
            "left:0",
            "top:0",
            "z-index:" + args['z'],
            "width:" + canvasWidth + 'px',
            "height:" + canvasHeight + 'px'
        ].join(';');
        div.append(
            '<canvas id="' + canvasId + '"'
            + ' width="' + canvasWidth + '"'
            + ' height="' + canvasHeight + '"'
            + ' style="' + style + '"></canvas>'
        );
        return document.getElementById(canvasId);
    };

    var canvas  = createCanvas({ z: 0, suffix: '' });
    var canvasf = createCanvas({ z: 1, suffix: 'f' });
    var canvasi = createCanvas({ z: 2, suffix: 'i' });
    var ctx = canvas.getContext('2d');
    var ctxf = canvasf.getContext('2d');
    var ctxi = canvasi.getContext('2d');
    ctx.strokeStyle = "black";
//    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctxf.strokeStyle = "black";
    ctxf.fillStyle = "black";
    ctxi.strokeStyle = "black";
    ctxi.fillStyle = "black";

    // fetch the list of columns in the table
    // and their min and max values
    var table = (args.hasOwnProperty('table')) ? args['table'] : 'sbi_vs_avec';
	var widget = this;
    this.getJSON("/data/" + table + "/ranges",
    function(json) {
        // TODO: add event handlers
				console.log(ctx.canvas.height, widget.PADDING_TOP, widget.PADDING_BOTTOM);
        var ysize = ctx.canvas.height - widget.PADDING_TOP - widget.PADDING_BOTTOM;
        var xsize = (ctx.canvas.width - 2 * widget.PADDING_SIDES - json.length * widget.AXIS_WIDTH) / (json.length - 1);

        var offset = widget.PADDING_SIDES;
        widget.draw_axis(ctxi, json[0], offset, ysize);
        for (var i = 1; i < json.length; i++) {
            offset += widget.AXIS_WIDTH;
            widget.do_pcoords(ctx, table, json[i - 1], json[i], offset, offset + xsize, ysize, "context");
            widget.do_pcoords(ctxf, table, json[i - 1], json[i], offset, offset + xsize, ysize, "focus");
            offset += xsize;
            widget.draw_axis(ctxi, json[i], offset, ysize);
        }
    });
};

Pcoords.prototype.build_sql = function() {
    return "total > 3.0";
};

Pcoords.prototype.draw_axis = function(ctx, column, offset, ysize) {
    var center = offset + Math.floor(this.AXIS_WIDTH / 2);
    var top = this.PADDING_TOP - 10;
    var bottom = top + ysize + 20;

    // axis line
    ctx.fillRect(center, top, 1, ysize + 20);

    // TODO: some tick marks and labels would be nice
    // Top arrow
    ctx.beginPath();
    ctx.moveTo(center, top);
    ctx.lineTo(center + 4, top + 9);
    ctx.lineTo(center - 3, top + 9);
    ctx.lineTo(center, top);
    ctx.closePath();
    ctx.fill();

    // Bottom arrow
    ctx.beginPath();
    ctx.moveTo(center, bottom);
    ctx.lineTo(center + 4, bottom - 9);
    ctx.lineTo(center - 3, bottom - 9);
    ctx.lineTo(center, bottom);
    ctx.closePath();
    ctx.fill();

    // axis label
    var text = ctx.measureText(column[0]);
    ctx.fillText(column[0], center - text.width / 2, top - 3);
    ctx.fillText(column[0], center - text.width / 2, bottom + 10);
};

Pcoords.prototype.do_pcoords = function(ctx, table, c1_arr, c2_arr, xmin, xmax, ysize, layer) {
    var nbins = Math.floor(ysize / 1);
    var url = "/data/" + table + "/pcoords"
    + "?c1=" + c1_arr[0]
    + "&c2=" + c2_arr[0]
    + "&b1=" + nbins
    + "&b2=" + nbins
    + "&n1=" + c1_arr[1]
    + "&n2=" + c2_arr[1]
    + "&x1=" + c1_arr[2]
    + "&x2=" + c2_arr[2];
    if (layer === "focus") {
        url += '&w=' + this.build_sql();
    }
		var widget = this;
    this.getJSON(url,
    function(json) {
        ctx.fillStyle = "black";
        if (layer === "focus") {
            //yellow-orange
            widget.maxcolor = [220, 140, 0];
            widget.mincolor = [255, 180, 0];
        } else {
            // brown
            widget.maxcolor = [120, 50, 0];
            widget.mincolor = [139, 69, 19];

            // blue
            widget.maxcolor = [0, 50, 100];
            widget.mincolor = [0, 50, 200];

            // gray
            widget.maxcolor = [10, 10, 10];
            widget.mincolor = [100, 100, 100];
        }
        var rank = new Array();
        rank[0] = 1;
        for (var i = 1; i < json.data.length; i++) {
            if (json.data[i - 1][4] === json.data[i][4]) {
                rank[i] = rank[i - 1];
            } else {
                rank[i] = rank[i - 1] + 1;
            }
        }
        var max_rank = rank[json.data.length - 1];
        var f1 = ysize / (c1_arr[2] - c1_arr[1]);
        var f2 = ysize / (c2_arr[2] - c2_arr[1]);
        for (var i = 0; i < json.data.length; i++) {
            var rect = json.data[i];
            if (widget.color_by_density) {
                var ratio = rect[4] / json.max;
                ratio = rank[i] / max_rank;
                var r = widget.mincolor[0] + Math.floor(ratio * (widget.maxcolor[0] - widget.mincolor[0]));
                var g = widget.mincolor[1] + Math.floor(ratio * (widget.maxcolor[1] - widget.mincolor[1]));
                var b = widget.mincolor[2] + Math.floor(ratio * (widget.maxcolor[2] - widget.mincolor[2]));

                ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + "0.1)";
            }
            ctx.beginPath();
            ctx.moveTo(xmin, widget.PADDING_TOP + ysize - f1 * (rect[0] - c1_arr[1]));
            ctx.lineTo(xmin, widget.PADDING_TOP + ysize - f1 * (rect[1] - c1_arr[1]));
            ctx.lineTo(xmax, widget.PADDING_TOP + ysize - f2 * (rect[3] - c2_arr[1]));
            ctx.lineTo(xmax, widget.PADDING_TOP + ysize - f2 * (rect[2] - c2_arr[1]));
            ctx.closePath();
            ctx.fill();
        }
    });
};

Widget.registerWidget('pcoords', Pcoords);
