(function() {
    var widget = Iris.Widget.create({
        about: {
            name: "Pcoords",
            author: "Andrew Olson",
            requires: [],
            renderers: {
                default: "syntax.js"
            },
        }
    });

    var tool = new Object();
    tool.started = false;
    var PADDING_TOP = 40;
    var PADDING_BOTTOM = 40;
    var PADDING_SIDES = 20;
    var AXIS_WIDTH = 1;
    var colorByDensity = true;
    var containerNode;
    var limits = new Object();
    var mincolor = new Array();
    var maxcolor = new Array();

    widget.display = function (args) {
        var div = $("#" + widget.targetElement);
        div.text('');
        containerNode = div;
        var canvasHeight = Math.max(div.parent().height(), 250);
        var canvasWidth = Math.max(div.width(), 400);
        div.height(canvasHeight);
        div.width(canvasWidth);
        var createCanvas = function(args) {
            var canvasId = widget.targetElement + '_canvas' + args['suffix'];
            var style = [
                "position:absolute",
                "left:0",
                "top:0",
                "z-index:" + args['z'],
                "width:" + canvasWidth + 'px',
                "height:" + canvasHeight + 'px'
            ].join(';');
                div.append('<canvas id="' + canvasId + '"' +
                    ' width="' + canvasWidth + '"' +
                    ' height="' + canvasHeight + '"' +
                    ' style="' + style + '"></canvas>');
            return document.getElementById(canvasId);
        };

        var canvas = createCanvas({
            z: 0,
            suffix: ''
        });
        var canvasf = createCanvas({
            z: 1,
            suffix: 'f'
        });
        var canvasi = createCanvas({
            z: 2,
            suffix: 'i'
        });
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
        var table =
            args.hasOwnProperty('table') ? args['table'] : 'sbi_vs_avec';
        widget.getJSON("/pcoords/" + table + "/ranges", function(json) {
            // TODO: add event handlers
            var ysize = ctx.canvas.height - PADDING_TOP - PADDING_BOTTOM;
            var xsize = (ctx.canvas.width - 2 * PADDING_SIDES -
                json.length * AXIS_WIDTH) / (json.length - 1);

            var offset = PADDING_SIDES;
            drawAxis(ctxi, json[0], offset, ysize);
            for (var i = 1; i < json.length; i++) {
                offset += AXIS_WIDTH;
                doPcoords(ctx, table, json[i-1], json[i],
                    offset, offset + xsize, ysize, "context");
                doPcoords(ctxf, table, json[i-1], json[i],
                    offset, offset + xsize, ysize, "focus");
                offset += xsize;
                drawAxis(ctxi, json[i], offset, ysize);
            }
        });
    };

    function buildSQL() {
        return "total > 3.0";
    };

    function drawAxis(ctx, column, offset, ysize) {
        var center = offset + Math.floor(AXIS_WIDTH / 2);
        var top = PADDING_TOP - 10;
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

    function doPcoords(ctx, table, c1_arr, c2_arr, xmin, xmax, ysize, layer) {
        var nbins = Math.floor(ysize / 1);
        var url = "/pcoords/" + table + "/scatter" + "?c1=" + c1_arr[0] + "&c2=" + c2_arr[0] + "&b1=" + nbins + "&b2=" + nbins + "&n1=" + c1_arr[1] + "&n2=" + c2_arr[1] + "&x1=" + c1_arr[2] + "&x2=" + c2_arr[2];
        if (layer === "focus") {
            url += '&w=' + buildSQL();
        }
        widget.getJSON(url, function(json) {
            ctx.fillStyle = "black";
            if (layer === "focus") {
                //yellow-orange
                maxcolor = [220, 140, 0];
                mincolor = [255, 180, 0];
            } else {
                // brown
                maxcolor = [120, 50, 0];
                mincolor = [139, 69, 19];

                // blue
                maxcolor = [0, 50, 100];
                mincolor = [0, 50, 200];

                // gray
                maxcolor = [10, 10, 10];
                mincolor = [100, 100, 100];
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
                if (colorByDensity) {
                    var ratio = rect[4] / json.max;
                    ratio = rank[i] / max_rank;
                    var r = mincolor[0] +
                        Math.floor(ratio * (maxcolor[0] - mincolor[0]));
                    var g = mincolor[1] +
                        Math.floor(ratio * (maxcolor[1] - mincolor[1]));
                    var b = mincolor[2] +
                        Math.floor(ratio * (maxcolor[2] - mincolor[2]));

                    ctx.fillStyle =
                        "rgba(" + r + "," + g + "," + b + "," + "0.1)";
                }
                ctx.beginPath();
                ctx.moveTo(xmin, PADDING_TOP + ysize - f1 * (rect[0] - c1_arr[1]));
                ctx.lineTo(xmin, PADDING_TOP + ysize - f1 * (rect[1] - c1_arr[1]));
                ctx.lineTo(xmax, PADDING_TOP + ysize - f2 * (rect[3] - c2_arr[1]));
                ctx.lineTo(xmax, PADDING_TOP + ysize - f2 * (rect[2] - c2_arr[1]));
                ctx.closePath();
                ctx.fill();
            }
        });
    };
})();
