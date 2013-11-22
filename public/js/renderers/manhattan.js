define([
    'jquery',
    'iris',
    'util/dragbox',
    'util/scale',
    'underscore',
    "text!examples/manhattan.json"
],
function ($, Iris, DragBox, Scale, _, ExampleData) {
    function createCanvas(container, options) {
        options = (options || {});
        var canvas = $("<canvas>")
            .attr("width", container.width())
            .attr("height", container.height())
            .css("position", "absolute")
            .css("z-index", options.z || 1);
        container.append(canvas);
        return canvas[0].getContext('2d');
    }

    function color(r, cc, c) { return cc.min[c] - Math.floor(r * cc.range[c]); }

    var PI2          = Math.PI * 2;
    var AXIS_COLOR   = '#CCC';
    var RADIUS       = 2;
    var DRAW_DISCS   = true;
    var XGUTTER      = 10;
    var PINTENSITY   = 0.4;
    var YAXIS_WIDTH  = 30;
    var XAXIS_HEIGHT = 80;
    
    var COLORS = [
        { max: [0, 0, 0],   min: [150, 150, 150], range: [150, 150, 150] },
        { max: [255, 0, 0], min: [255, 165, 0],   range: [0, 165, 0] }
    ];

    /**
     * @class Manhattan
     * Manhattan Plot
     * 
     * @extends Renderer
     */
    var Manhattan = Iris.Renderer.extend({
        about: {
            title: "Manhattan Plot",
            name: "ManhattanPlot",
            author: "Andrew Olson"
        },
        /**
         * @method initialize
         * @inheritdoc Renderer#initialize
         */
        initialize: function (options) {
            options = options || {};
            options.filterContig =
                (options.filterContig || function () { return false; });
            this.$element = $(options.element);

            this.yAxis = new Scale();
            this.xAxis = new Scale();
            this.canvasWidth = null;
            this.canvasHeight = null;
            this.ctx = null;
            this.genomeLength = 0;

            this.ctgOrder = [];
            this.ctgIndex = [];
            this.contigs = null;
            this.variations = null;
            this.maxscore = null;
            this.ctgXsize = null;
            this.options = options;
        },
        setData: function (data) {
            if (data === null || _.isEmpty(data)) return;
            this.contigs = {};
            for (var i = 0; i < data.contigs.length; i++) {
                var ctg = data.contigs[i];
                if (this.options.filterContig(ctg)) {
                    continue;
                }
                var key = ctg.id;
                this.contigs[key] = ctg;
                this.ctgIndex.push(key);
                this.ctgOrder.push(key);
                this.genomeLength += ctg.len;
            }
            this.variations  = data.variations;
            this.maxscore    = data.maxscore;
            if (!this.maxscore) {
                this.maxscore = _.max(_.map(this.variations, function (v) {
                    return v[2];
                }));
            }
        },
        getData: function () {
            return {
                contigs:    this.contigs,
                variations: this.variations,
                maxscore:   this.maxscore
            };
        },
        render: function (args) {
            var self = this;
            args = (args || {});
            self.$element.empty();

            // Fix height/width to prevent resizing artifacts
            self.$element.height(self.$element.height());
            self.$element.width(self.$element.width());

            var containerHeight = self.$element.height();
            var containerWidth  = self.$element.width();
            self.canvasHeight = containerHeight - XAXIS_HEIGHT;
            self.canvasWidth  = containerWidth  - YAXIS_WIDTH;
            self.$element.css("position", "relative");
            self.plotArea =
                $('<div>').css("position", "absolute").css("left", YAXIS_WIDTH);
            self.plotArea.width(self.canvasWidth).height(self.canvasHeight);
            self.ctx = createCanvas(self.plotArea, { z: 5 });
            self.$element.append(self.plotArea);
            self.drawManhattan();
        },
        highlight: function (loci) {
            var self = this;
            var ctx = self.hlCtx;
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            } else {
                ctx = self.hlCtx = createCanvas(self.plotArea, { z: 1 });
            }
            ctx.strokeStyle = "rgba(31,120,180,0.7)";
            ctx.fillStyle = "rgba(166,206,227,0.7)";
            ctx.lineWidth = 0.5;
            loci.forEach(function (locus) {
                if (locus === null) return;
                var ctg = self.contigs[locus.contig];
                var x = ctg.scale.toRange(locus.pos);
                ctx.beginPath();
                ctx.arc(Math.floor(x), 10, RADIUS * 2, 0, PI2, true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            });
        },
        unhighlight: function () {
            var ctx = this.hlCtx;
            if (ctx) {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }
        },
        setRanges: function () {
            var yAxisMax = Math.ceil(this.maxscore) + 1;
            this.yAxis.domain([0, yAxisMax]);
            this.yAxis.range([this.canvasHeight, 0]);
            if (this.genomeLength === 0) {
                throw new Error("setRanges(): Contig data not set");
            }
            
            this.xAxis.domain([0, this.genomeLength]);
            this.xAxis.range([0, this.canvasWidth -
                (this.ctgOrder.length + 1) * XGUTTER]);
        },
        drawAxes: function () {
            var self = this;
            var offset = 0;
            var axisContext = createCanvas(self.$element, { z: 1 });
            
            function contigsAreWide() {
                var shortest = self.contigs[self.ctgOrder.slice(-1)[0]];
                return (self.xAxis.toRange(shortest.len) > 50);
            }
            axisContext.strokeStyle = AXIS_COLOR;
            axisContext.fillStyle = AXIS_COLOR;
            axisContext.beginPath();
            axisContext.moveTo(YAXIS_WIDTH - offset, 0);
            axisContext.lineTo(YAXIS_WIDTH - offset,
                self.canvasHeight + offset);
            axisContext.lineTo(self.$element.width(),    
                self.canvasHeight + offset);
            axisContext.stroke();
            axisContext.closePath();
            function verticalLabel(text, x, y, options) {
                options = (options || {});
                axisContext.save();
                if (options.callback) {
                    options.callback(axisContext);
                }
                axisContext.translate(x, y);
                axisContext.rotate(-Math.PI/2);
                axisContext.textAlign = options.align || "right";
                axisContext.textBaseline = options.baseline || "middle";
                axisContext.fillText(text, 0, 0);
                axisContext.restore();
            }
            function horizontalLabeler(text, x, y, options) {
                options = (options || {});
                axisContext.save();
                axisContext.textAlign = "center";
                axisContext.textBaseline = options.baseline || "top";
                axisContext.fillText(text, x, y);
                axisContext.restore();
            }
            var horizontalContigs = contigsAreWide();
            var labeler = horizontalContigs ? horizontalLabeler : verticalLabel;
            var labelOffset = YAXIS_WIDTH + XGUTTER;
            self.ctgOrder.forEach(function (key) {
                var ctg = self.contigs[key];
                var ctgWidth = self.xAxis.toRange(ctg.len);
                var origin = labelOffset + ctgWidth / 2;
                labeler(ctg.name, origin, self.canvasHeight + offset + 1);
                labelOffset += ctgWidth + XGUTTER;
            });
            horizontalLabeler("Contigs",
                YAXIS_WIDTH + self.canvasWidth / 2,
                horizontalContigs ?
                    self.canvasHeight + 40 :
                    XAXIS_HEIGHT + self.canvasHeight - 1,
                { baseline: "bottom" }
            );
            
            verticalLabel("Significance", 0, self.canvasHeight / 2,
                { align: "center", baseline: "top" }
            );
            verticalLabel("-log p", 12, self.canvasHeight / 2,
                { align: "center", baseline: "top",
                    callback: function (context) {
                        context.font = "italic 6pt sans-serif";
                    }
                }
            );
            axisContext.textAlign = "right";
            axisContext.textBaseline = "top";
            axisContext.fillText(self.yAxis.domain()[1], YAXIS_WIDTH - 1, 0);
            axisContext.textBaseline = "bottom";
            axisContext.fillText(self.yAxis.domain()[0], YAXIS_WIDTH - 1,
                self.canvasHeight);
        },
        drawManhattan: function () {
            var self = this;
            self.setRanges();
            self.drawAxes();

            var dragbox = new DragBox(self.plotArea, { z: 10 });
            dragbox.textHandler(function (x, y, w, h) {
                var pvals = [
                    self.yAxis.toDomain(y).toFixed(2),
                    self.yAxis.toDomain(y + h).toFixed(2)
                ].sort();
                return "-log p [" + pvals[0] + " " + pvals[1] + "]";
            });
            dragbox.pinpointHandler(function (x, y) {
                self.trigger("pinpoint", [
                    self.canvasToScore(y), self.canvasToCtg(x, x)
                ]);
            });
            dragbox.selectionHandler(function (x1, y1, x2, y2) {
                self.trigger("selection", [
                    self.canvasToScore(y1),
                    self.canvasToScore(y2),
                    self.canvasToCtg(x1, x2)
                ]);
            });
            
            var offset = XGUTTER;
            var ctg;
            // Per-contig scales and offsets
            for (var i = 0; i < self.ctgOrder.length; i++) {
                ctg = self.ctgOrder[i];
                var scale = self.contigs[ctg].scale = new Scale();
                var lenPx = self.xAxis.toRange(self.contigs[ctg].len);
                scale.domain([0, self.contigs[ctg].len]);
                scale.range([offset, offset + lenPx]);
                self.contigs[ctg].offset = offset + XGUTTER;
                offset += lenPx + XGUTTER;
            }
            self.scatterplot();
        },
        
        scatterplot: function () {
            function intensity(v) { return Math.pow(v + 1, PINTENSITY); }
            var normalized = intensity(this.maxscore);

            // create a 2D histogram
            var histogram = {};
            var x2color = {};
            var maxTally=1;
            for (var i = 0; i < this.variations.length; i++) {
                var ctgN   = this.variations[i][0];
                var xcoord = this.variations[i][1];
                var ycoord = this.variations[i][2];
                if (this.ctgIndex[ctgN] === null) continue;
                var ctg    = this.contigs[this.ctgIndex[ctgN]];
                var x      = ctg.scale.toRange(xcoord);
                var y      = this.yAxis.toRange(ycoord);
                var xbin   = 1.5*RADIUS * Math.floor(x/(1.5*RADIUS));
                var ybin   = 1.5*RADIUS * Math.floor(y/(1.5*RADIUS));
                x2color[xbin] = COLORS[ctgN % COLORS.length];
                if (histogram.hasOwnProperty(xbin)) {
                    if (histogram[xbin].hasOwnProperty(ybin)) {
                        histogram[xbin][ybin]++;
                    } else {
                        histogram[xbin][ybin]=1;
                    }
                } else {
                    histogram[xbin] = {};
                    histogram[xbin][ybin] = 1;
                }
                if (histogram[xbin][ybin] > maxTally) {
                    maxTally = histogram[xbin][ybin];
                }
            }

            for (var x in histogram) {
                var ctgcolor = x2color[x];
                for (var y in histogram[x]) {
                    var ratio = histogram[x][y]/maxTally;
                    var r = color(ratio, ctgcolor, 0);
                    var g = color(ratio, ctgcolor, 1);
                    var b = color(ratio, ctgcolor, 2);
                    
                    this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                    
                    this.ctx.beginPath();
                    this.ctx.arc(Math.floor(x), Math.floor(y), RADIUS, 0, PI2, true);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        },

        canvasToCtg: function (a, b) {
            // TODO: Major cleanup on Aisle 5!
            var ranges = [];
            var offset = XGUTTER;
            var aCtg = 0;
            var bCtg = 0;
            var gutters = (this.ctgIndex.length + 1) * XGUTTER;
            var nt2px = (this.canvasWidth - gutters) / this.genomeLength;
            var aPos, bPos;
            for (i = 0; i < this.ctgOrder.length; i++) {
                var ctg = this.ctgOrder[i];
                var len = this.contigs[ctg].len;
                var ctgXsize = nt2px * len;
                if (a >= offset - XGUTTER && a <= offset + ctgXsize) {
                    aCtg = i;
                    aPos = Math.floor(len * Math.max(a - offset, 0) / ctgXsize);
                }
                if (b >= offset && b <= offset + ctgXsize + XGUTTER) {
                    bCtg = i;
                    bPos = Math.ceil(len * Math.max(b - offset, 0) / ctgXsize);
                }
                offset += ctgXsize + XGUTTER;
            }
            if (aCtg <= bCtg) {
                if (aCtg === bCtg) {
                    ranges[0] = [this.ctgOrder[aCtg], aPos, bPos];
                } else if (aCtg === bCtg - 1) {
                    ranges[0] =
                        [this.ctgOrder[aCtg], aPos,
                            this.contigs[this.ctgOrder[aCtg]].len];
                    ranges[1] = [this.ctgOrder[bCtg], 0, bPos];
                } else {
                    ranges[0] =
                        [this.ctgOrder[aCtg], aPos,
                            this.contigs[this.ctgOrder[aCtg]].len];
                    for (i = 1; i < bCtg - aCtg; i++) {
                        ranges[i] =
                            [this.ctgOrder[aCtg + i], 0,
                                this.contigs[this.ctgOrder[aCtg + i]].len];
                    }
                    ranges[bCtg - aCtg] = [this.ctgOrder[bCtg], 0, bPos];
                }
            }
            return ranges;
        },
        canvasToScore: function (py) {
            return this.yAxis.toDomain(py);
        }
    });
    Manhattan.prototype.exampleData = function () {
        return JSON.parse(ExampleData);
    };
    return Manhattan;
});