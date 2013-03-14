/**
  * Parallel Coordinates Plot
  * @module renderers/pcoords
  */
define(["iris", "jquery", "underscore"], function (Iris, $, _) {
    var PADDING_TOP = 40;
    var PADDING_BOTTOM = 40;
    var PADDING_SIDES = 20;
    var AXIS_WIDTH = 1;
    var pcoordId = 0;

    function buildSQL() {
        return "total > 3.0";
    }

    return Iris.Renderer.extend({
        about: {
            title: "Parallel Coordinate Plot",
            name: "pcoords",
            author: "Andrew Olson",
        },
        initialize: function (options) {
            this.colorByDensity = true;
            this.containerNode = null;
            this.mincolor = [];
            this.maxcolor = [];
            pcoordId++;
        },
        render: function (args) {
            var self = this;
            args = args ? _.clone(args) : {};
            var div = $(args.element);
            div.text('');
            this.containerNode = div;
            var canvasHeight = Math.max(div.parent().height(), 250);
            var canvasWidth = Math.max(div.width(), 400);
            div.height(canvasHeight);
            div.width(canvasWidth);
            function createCanvas(args) {
                var canvasId = 'pcoord_canvas_' + args.suffix + '_' + pcoordId;
                var style = [
                    "position:absolute",
                    "left:0",
                    "top:0",
                    "z-index:" + args.z,
                    "width:" + canvasWidth + 'px',
                    "height:" + canvasHeight + 'px'
                ].join(';');
                    div.append('<canvas id="' + canvasId + '"' +
                        ' width="' + canvasWidth + '"' +
                        ' height="' + canvasHeight + '"' +
                        ' style="' + style + '"></canvas>');
                return document.getElementById(canvasId);
            }
            var canvas  = createCanvas({ z: 0, suffix: '' });
            var canvasf = createCanvas({ z: 1, suffix: 'f' });
            var canvasi = createCanvas({ z: 2, suffix: 'i' });
            var ctx = canvas.getContext('2d');
            var ctxf = canvasf.getContext('2d');
            var ctxi = canvasi.getContext('2d');
            ctx.strokeStyle = "black";
            //    ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctxf.strokeStyle = "black";
            ctxf.fillStyle   = "black";
            ctxi.strokeStyle = "black";
            ctxi.fillStyle   = "black";

            // fetch the list of columns in the table
            // and their min and max values
            var table =
                args.hasOwnProperty('table') ? args.table : 'sbi_vs_avec';
            $.getJSON("/pcoords/" + table + "/ranges", function (json) {
                // TODO: add event handlers
                var ysize = ctx.canvas.height - PADDING_TOP - PADDING_BOTTOM;
                var xsize = (ctx.canvas.width - 2 * PADDING_SIDES -
                    json.length * AXIS_WIDTH) / (json.length - 1);

                var offset = PADDING_SIDES;
                self.drawAxis(ctxi, json[0], offset, ysize);
                for (var i = 1; i < json.length; i++) {
                    offset += AXIS_WIDTH;
                    self.doPcoords(ctx, table, json[i-1], json[i],
                        offset, offset + xsize, ysize, "context");
                    self.doPcoords(ctxf, table, json[i-1], json[i],
                        offset, offset + xsize, ysize, "focus");
                    offset += xsize;
                    self.drawAxis(ctxi, json[i], offset, ysize);
                }
            });
        },

        drawAxis: function (ctx, column, offset, ysize) {
            var center = offset + Math.floor(AXIS_WIDTH / 2);
            var top    = PADDING_TOP - 10;
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
        },

        doPcoords: function
            (ctx, table, c1_arr, c2_arr, xmin, xmax, ysize, layer) {
            var self = this;    
            var nbins = Math.floor(ysize / 1);
            var url = "/pcoords/" + table + "/scatter" + "?c1=" + c1_arr[0] + "&c2=" + c2_arr[0] + "&b1=" + nbins + "&b2=" + nbins + "&n1=" + c1_arr[1] + "&n2=" + c2_arr[1] + "&x1=" + c1_arr[2] + "&x2=" + c2_arr[2];
            if (layer === "focus") {
                url += '&w=' + buildSQL();
            }
            // TODO: Make these colors configurable.
            $.getJSON(url, function (json) {
                ctx.fillStyle = "black";
                if (layer === "focus") {
                    //yellow-orange
                    self.maxcolor = [220, 140, 0];
                    self.mincolor = [255, 180, 0];
                } else {
                    // gray
                    self.maxcolor = [10, 10, 10];
                    self.mincolor = [100, 100, 100];
                }
                var rank = [];
                rank[0] = 1;
                for (var i = 1; i < json.data.length; i++) {
                    if (json.data[i - 1][4] === json.data[i][4]) {
                        rank[i] = rank[i - 1];
                    } else {
                        rank[i] = rank[i - 1] + 1;
                    }
                }
                var maxRank = rank[json.data.length - 1];
                var f1 = ysize / (c1_arr[2] - c1_arr[1]);
                var f2 = ysize / (c2_arr[2] - c2_arr[1]);
                for (var i = 0; i < json.data.length; i++) {
                    var rect = json.data[i];
                    if (self.colorByDensity) {
                        var ratio = rect[4] / json.max;
                        ratio = rank[i] / maxRank;
                        var r = self.mincolor[0] +
                            Math.floor(ratio * (self.maxcolor[0] - self.mincolor[0]));
                        var g = self.mincolor[1] +
                            Math.floor(ratio * (self.maxcolor[1] - self.mincolor[1]));
                        var b = self.mincolor[2] +
                            Math.floor(ratio * (self.maxcolor[2] - self.mincolor[2]));
                        ctx.fillStyle =
                            "rgba(" + r + "," + g + "," + b + "," + "0.1)";
                    }
                    ctx.beginPath();
                    ctx.moveTo(xmin,
                        PADDING_TOP + ysize - f1 * (rect[0] - c1_arr[1]));
                    ctx.lineTo(xmin,
                        PADDING_TOP + ysize - f1 * (rect[1] - c1_arr[1]));
                    ctx.lineTo(xmax,
                        PADDING_TOP + ysize - f2 * (rect[3] - c2_arr[1]));
                    ctx.lineTo(xmax,
                        PADDING_TOP + ysize - f2 * (rect[2] - c2_arr[1]));
                    ctx.closePath();
                    ctx.fill();
                }
            });
        }
    });
});
