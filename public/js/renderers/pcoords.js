define(["iris", "jquery", "underscore", "text!/data/pcoords.json"],
function (Iris, $, _, ExampleData) {
    var PADDING_TOP = 40;
    var PADDING_BOTTOM = 40;
    var PADDING_SIDES = 20;
    var AXIS_WIDTH = 1;
    var pcoordId = 0;

    /**
      * @class ParallelCoordinatesPlot
      * Parallel Coordinates Plot.
      * 
      * @extends Renderer
      */
    var ParallelCoords = Iris.Renderer.extend({
        about: {
            title: "Parallel Coordinate Plot",
            name: "ParallelCoordinatesPlot",
            author: "Andrew Olson",
        },
        /**
         * @method initialize
         * @inheritdoc Renderer#initialize
         */
        initialize: function (options) {
            this.colorByDensity = true;
            this.containerNode = null;
            this.mincolor = [];
            this.maxcolor = [];
            pcoordId++;
        },
        render: function () {
            var self = this;
            var args = {};
            args = args ? _.clone(args) : {};
            var div = $(self.options.element);
            div.text('');
            this.containerNode = div;
            var canvasHeight = Math.max(div.parent().height(), 250);
            var canvasWidth = Math.max(div.width(), 400);
            div.height(canvasHeight);
            div.width(canvasWidth);
            function createCanvas(args) {
                var canvasId = ['pcrd_cnvs', args.suffix, pcoordId].join("_");
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

            var ranges = this.data.ranges;
            var ysize = ctx.canvas.height - PADDING_TOP - PADDING_BOTTOM;
            var xsize = (ctx.canvas.width - 2 * PADDING_SIDES -
                ranges.length * AXIS_WIDTH) / (ranges.length - 1);

            var offset = PADDING_SIDES;
            self.drawAxis(ctxi, ranges[0], offset, ysize);
            for (var i = 1; i < ranges.length; i++) {
                offset += AXIS_WIDTH;
                self.doPcoords(ctx, ranges[i-1], ranges[i],
                    offset, offset + xsize, ysize, "context");
                self.doPcoords(ctxf, ranges[i-1], ranges[i],
                    offset, offset + xsize, ysize, "focus");
                offset += xsize;
                self.drawAxis(ctxi, ranges[i], offset, ysize);
            }
        },
        exampleData: function () {
            return JSON.parse(ExampleData);
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

        doPcoords: function (ctx, c1_arr, c2_arr, xmin, xmax, ysize, layer) {
            var self = this;    

            var group = this.data.scatter[layer];
            var scatter = _.find(group, function (s) {
                return (s.dim1 == c1_arr[0] && s.dim2 == c2_arr[0]);
            });
            
            if (scatter === undefined) {
                throw new Error("Could not find data for " +
                    c1_arr[0] + "-" + c2_arr[0] + " (" + layer + ")");
            }
            
            // TODO: Make these colors configurable.
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
            for (var i = 1; i < scatter.data.length; i++) {
                if (scatter.data[i - 1][4] === scatter.data[i][4]) {
                    rank[i] = rank[i - 1];
                } else {
                    rank[i] = rank[i - 1] + 1;
                }
            }
            var maxRank = rank[scatter.data.length - 1];
            var f1 = ysize / (c1_arr[2] - c1_arr[1]);
            var f2 = ysize / (c2_arr[2] - c2_arr[1]);
            for (var i = 0; i < scatter.data.length; i++) {
                var rect = scatter.data[i];
                if (self.colorByDensity) {
                    var ratio = rect[4] / scatter.max;
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
        }
    });
    return ParallelCoords;
});
