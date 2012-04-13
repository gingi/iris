(function () {

    var schema = {
        properties: {
            data: {
                required: true,
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        color: {
                            type: 'object',
                            required: true
                        },
                        data: {
                            type: 'array',
                            required: true,
                            items: {
                                type: 'array',
                                required: true,
                                items: {
                                    type: 'number',
                                    minimum: 0,
                                    maximum: 1,
                                    required: true,
                                },
                                minItems: 2,
                                maxItems: 2,
                            }
                        },
                    }
                }
            }
        }
    };

  var renderer = {
        about: {
            name: "animatedlinegraph",
            author: "Jim Thomason",
            version: "1.0",
            requires: ['rectangle.js', 'point.js', 'size.js', 'RGBColor.js'],
            options: {
                bgColor: 'RGBColor()',
                color: 'RGBColor()',
                outlineColor: 'RGBColor()',
                data: '[]'
            },
            defaults: {
                width           : 400,
                height          : 400,
                speed           : 50,
                animate         : 1,
                xMin            : 0,
                xMax            : 50,
                yMin            : 0,
                yMax            : 100,
            },
            setDefaults: function () {
                return {
                    bgColor         :  new RGBColor(255,255,255),
                    outlineColor    :  new RGBColor(0,0,0),
                };
            },
            classes: [],
            dataFormat: "list of string"
        },
  exampleData : function () {
      return [
        {
            color : new RGBColor(255,0,0),
            data : [[0,0.60],[0.02,0.43],[0.04,0.30],[0.06,0.20],[0.08,0.12],[0.1,0.07],[0.12,0.04],[0.14,0.03],[0.16,0.04],[0.18,0.06],[0.2,0.10],[0.22,0.14],[0.24,0.19],[0.26,0.24],[0.28,0.31],[0.3,0.37],[0.32,0.43],[0.34,0.49],[0.36,0.56],[0.38,0.61],[0.4,0.67],[0.42,0.72],[0.44,0.76],[0.46,0.80],[0.48,0.83],[0.5,0.86],[0.52,0.87],[0.54,0.88],[0.56,0.88],[0.58,0.88],[0.6,0.87],[0.62,0.85],[0.64,0.82],[0.66,0.79],[0.68,0.75],[0.7,0.71],[0.72,0.67],[0.74,0.62],[0.76,0.58],[0.78,0.53],[0.8,0.49],[0.82,0.45],[0.84,0.42],[0.86,0.39],[0.88,0.37],[0.9,0.37],[0.92,0.38],[0.940000000000001,0.40],[0.960000000000001,0.45],[0.980000000000001,0.51],],
        },
        {
            color : new RGBColor(0,0,255),
            data : [[0,0],[0.02,0.08],[0.04,0.20],[0.06,0.32],[0.08,0.41],[0.1,0.50],[0.12,0.57],[0.14,0.64],[0.16,0.69],[0.18,0.73],[0.2,0.76],[0.22,0.79],[0.24,0.80],[0.26,0.81],[0.28,0.81],[0.3,0.80],[0.32,0.79],[0.34,0.77],[0.36,0.75],[0.38,0.72],[0.4,0.69],[0.42,0.65],[0.44,0.62],[0.46,0.58],[0.48,0.54],[0.5,0.50],[0.52,0.46],[0.54,0.42],[0.56,0.38],[0.58,0.35],[0.6,0.31],[0.62,0.28],[0.64,0.25],[0.66,0.23],[0.68,0.21],[0.7,0.20],[0.72,0.19],[0.74,0.19],[0.76,0.20],[0.78,0.21],[0.8,0.24],[0.82,0.27],[0.84,0.31],[0.86,0.36],[0.88,0.43],[0.9,0.50],[0.92,0.59],[0.940000000000001,0.68],[0.960000000000001,0.80],[0.980000000000001,0.92],],
        },
        {
            color : new RGBColor(255,255,0),
            data : [[0,0.50],[0.02,0.69],[0.04,0.86],[0.06,0.97],[0.08,1.00],[0.1,0.95],[0.12,0.84],[0.14,0.67],[0.16,0.47],[0.18,0.28],[0.2,0.12],[0.22,0.02],[0.24,0.00],[0.26,0.06],[0.28,0.18],[0.3,0.36],[0.32,0.56],[0.34,0.75],[0.36,0.90],[0.38,0.98],[0.4,0.99],[0.42,0.93],[0.44,0.79],[0.46,0.61],[0.48,0.41],[0.5,0.23],[0.52,0.09],[0.54,0.01],[0.56,0.01],[0.58,0.09],[0.6,0.23],[0.62,0.42],[0.64,0.62],[0.66,0.80],[0.68,0.93],[0.7,1.00],[0.72,0.98],[0.74,0.89],[0.76,0.74],[0.78,0.55],[0.8,0.36],[0.82,0.18],[0.84,0.06],[0.86,0.00],[0.88,0.03],[0.9,0.12],[0.92,0.28],[0.940000000000001,0.48],[0.960000000000001,0.67],[0.980000000000001,0.84],],
        },

      ];
    },

  render : function (options) {
        var target = options.target;
        var opt = options;

		var check = window.json.validate(opt, schema);
		if (!check['valid']) {
			console.log(check['errors']);
			$.error( check['errors'] );
		}


        target.innerHTML = "";
        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        target.appendChild(canvas);

        renderer.renderCanvas(canvas,options);

    },

    getGraphBounds : function (canvas, fraction) {
        if (! fraction) {
            fraction = 1;
        }

        return new Rectangle(
            new Point( parseInt(canvas.width) - parseInt(canvas.width) / fraction + 40, 0),
            new Size(parseInt(canvas.width) / fraction - 40, parseInt(canvas.height) / fraction - 30)
        );

    },

    getXLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        var xbounds = new Rectangle(
            new Point(graphBounds.origin.x, graphBounds.origin.y + graphBounds.size.height),
            new Size(graphBounds.size.width, parseInt(canvas.width) - graphBounds.size.height)
        );

        return xbounds;
    },

    getYLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle (
            new Point(0,0),
            new Size(parseInt(canvas.width) - graphBounds.size.width, graphBounds.size.height)
        );

    },

    getCornerLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);
        var xLabelBounds = renderer.getXLabelBounds(canvas);
        var yLabelBounds = renderer.getYLabelBounds(canvas);

        return new Rectangle(
            new Point(yLabelBounds.origin.x, xLabelBounds.origin.y),
            new Size(yLabelBounds.size.width, xLabelBounds.size.height)
        );
    },

    renderCanvas : function (canvas,options) {


        var ctx = canvas.getContext('2d');

        if (ctx) {
            var graphBounds = renderer.getGraphBounds(canvas);

            var me = arguments.callee;
            var initialDraw = true;
            if (me.steps == undefined) {
                me.step = 0;
                me.steps = 0;
                for (var i = 0; i < options.data.length; i++) {
                    if (options.data[i].data.length > me.steps) {
                        me.steps = options.data[i].data.length;
                    }
                }
                if (! options.animate) {
                    me.step = me.steps;
                }
            }
            else {
                ctx.save();
                ctx.rect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);
                ctx.clip();
                initialDraw = false;
            }


            ctx.fillStyle = options.bgColor.asString();
            ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            ctx.strokeStyle = options.outlineColor.asString();
            ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            renderer.drawGrid(
                canvas,
                {
                    ticks : 10,
                    bounds : renderer.getGraphBounds(canvas),
                    color : new RGBColor(210,210,210),
                }
            );

            for (var i = 0; i < options.data.length; i++) {
                ctx.strokeStyle = options.data[i].color.asString();
                var data = options.data[i].data;

                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowBlur    = 4;
                ctx.shadowColor   = 'rgba(60, 60, 60, 0.8)';

                ctx.beginPath();
                ctx.moveTo(
                    data[0][0] * graphBounds.size.width + graphBounds.origin.x,
                    (1-data[0][1]) * graphBounds.size.height + graphBounds.origin.y
                );

                var step = me.step;
                if (step > data.length) {
                    step = step;
                }

                for (var j = 0; j < step; j++) {
                    ctx.lineTo(
                        data[j][0] * graphBounds.size.width + graphBounds.origin.x,
                        (1-data[j][1]) * graphBounds.size.height + graphBounds.origin.y
                    );
                }
                ctx.stroke();
                ctx.shadowColor = 'rgba(0,0,0,0)';

            };

            if (initialDraw) {
                renderer.drawYScale(
                    canvas, {
                        min : options.yMin,
                        max : options.yMax,
                        ticks : 10,
                        bounds : renderer.getYLabelBounds(canvas)
                    }
                );

                renderer.drawXScale(
                    canvas, {
                        min : options.xMin,
                        max : options.xMax,
                        ticks : 10,
                        bounds : renderer.getXLabelBounds(canvas)
                    }
                );
            }
            else {
                ctx.restore();
            }

            if (me.step < me.steps) {
                me.step++;
                setTimeout(function() {me(canvas, options) }, options.speed);
            }
        }
    },
    drawYScale : function (canvas, options) {

        var ctx = canvas.getContext('2d');

        ctx.save();
        ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
        ctx.clip();


        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.textAlign = 'end';

        var scale = (options.max - options.min) / options.ticks;

        for (var i = 0; i <= options.ticks; i++) {
            var label;
            if (i == 0) {
                ctx.textBaseline = 'bottom';
                label = options.min;
            }
            else if (i == options.ticks) {
                ctx.textBaseline = 'top';
                label = options.max;
            }
            else {
                ctx.textBaseline = 'middle';
                label = options.min + i * scale;
            }

            ctx.fillText(
                label.toFixed(2),
                options.bounds.origin.x + options.bounds.size.width - 5,
                options.bounds.size.height - i / options.ticks * options.bounds.size.height
            );
            if (1) {
                ctx.beginPath();
                ctx.moveTo(
                    options.bounds.origin.x + options.bounds.size.width - 5,
                    options.bounds.size.height - i / options.ticks * options.bounds.size.height
                    );
                ctx.lineTo(
                    options.bounds.origin.x + options.bounds.size.width,
                    options.bounds.size.height - i / options.ticks * options.bounds.size.height
                );
                ctx.stroke();
            }
        }

        ctx.restore();

    },
    drawXScale : function (canvas, options) {

        var ctx = canvas.getContext('2d');

        ctx.save();
        ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
        ctx.clip();

        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.textBaseline = 'top';

        var scale = (options.max - options.min) / options.ticks;

        for (var i = 0; i <= options.ticks; i++) {
            var label;
            if (i == 0) {
                ctx.textAlign = 'start';
                label = options.min;
            }
            else if (i == options.ticks) {
                ctx.textAlign = 'end';
                label = options.max;
            }
            else {
                ctx.textAlign = 'center';
                label = options.min + i * scale;
            }

            ctx.fillText(
                label.toFixed(2),
                options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                options.bounds.origin.y + 5
            );

            if (1) {
                ctx.beginPath();
                ctx.moveTo(
                options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                options.bounds.origin.y + 5
                    );
                ctx.lineTo(
                options.bounds.origin.x + i / options.ticks * options.bounds.size.width,
                options.bounds.origin.y
                );
                ctx.stroke();
            }
        }

        ctx.restore();

    },
    drawGrid : function(canvas, options) {

        var ctx = canvas.getContext('2d');

        ctx.save();
        ctx.rect(options.bounds.origin.x,options.bounds.origin.y,options.bounds.size.width,options.bounds.size.height);
        ctx.clip();

        if (isNaN(options.xTicks)) {
            xGridTicks = options.ticks;
        }
        if (isNaN(options.yTicks)) {
            yGridTicks = options.ticks;
        }

        ctx.strokeStyle = options.color.asString();
        ctx.lineWidth = 1;
        ctx.beginPath();

        if (options.outline) {
            ctx.moveTo(options.bounds.origin.x,options.bounds.origin.y);
            ctx.lineTo(options.bounds.origin.x + options.bounds.size.width,options.bounds.origin.y);
            ctx.lineTo(options.bounds.origin.x + options.bounds.size.width,options.bounds.origin.y + options.bounds.size.height);
            ctx.lineTo(options.bounds.origin.x,options.bounds.origin.y + options.bounds.size.height);
            ctx.lineTo(options.bounds.origin.x,options.bounds.origin.y);
        }

        for (var x = 0; x <= xGridTicks ; x++) {
            ctx.moveTo(x / xGridTicks * options.bounds.size.width + options.bounds.origin.x, options.bounds.origin.y);
            ctx.lineTo(x / xGridTicks * options.bounds.size.width + options.bounds.origin.x, options.bounds.origin.y + options.bounds.size.height);
        }
        for (var y = 0; y <= yGridTicks; y++) {
            ctx.moveTo(options.bounds.origin.x, y / yGridTicks * options.bounds.size.height + options.bounds.origin.y);
            ctx.lineTo(options.bounds.origin.x + options.bounds.size.width, y / yGridTicks * options.bounds.size.height + options.bounds.origin.y);
        }
        ctx.stroke();

        ctx.restore();

    }
  };

  Iris.Renderer.extend(renderer);
}).call(this);
