(function() {
	var schema = {
		properties: {
			data: {
				required: true,
				type: 'array',
				items: {
					type: 'object',
					properties: {
						color: {type: 'object', required: true},
						x: {type: 'number', required: true, minimum : 0, maximum : 1},
						y: {type: 'number', required: false, minimum : 0, maximum : 1},
						width: {type: 'number', required: true, minimum : 0, maximum : 1},
						height: {type: 'number', required: true, minimum : 0, maximum : 1},
					}
				}
			}
		}
	};

    var renderer = {
      about : function () {
          return {
          name: "Animated Bar Chart",
          author: "Jim Thomason",
          version: "1.0",
          requires: ['rectangle.js', 'point.js', 'size.js', 'RGBColor.js'],
          options: {
                'bgColor': 'RGBColor()',
                'color': 'RGBColor()',
                'data': '[]'
            },
          classes: [ ],
          data_format: "list of string" }
        },
      example_data : function () {
          return [
            { color : new RGBColor(255,0,0), x : 0.0, width : 0.1, height : 0.5, },
            { color : new RGBColor(0,255,0), x : 0.1, width : 0.1, height : 0.1, },
            { color : new RGBColor(0,255,0), x : 0.2, width : 0.1, height : 0.3, },
            { color : new RGBColor(255,0,0), x : 0.3, width : 0.1, height : 0.7, },
            { color : new RGBColor(255,0,0), x : 0.4, width : 0.1, height : 0.9, },
            { color : new RGBColor(255,0,0), x : 0.5, width : 0.1, height : 0.85, },
            { color : new RGBColor(255,0,0), x : 0.6, width : 0.1, height : 0.4, },
            { color : new RGBColor(255,0,255), x : 0.7, width : 0.1, height : 0.3, },
            { color : new RGBColor(255,0,0), x : 0.8, width : 0.1, height : 0.0, },
            { color : new RGBColor(255,0,0), x : 0.9, width : 0.1, height : 0.2, },

          ];
        },
        render : function ( settings ) {

            var options =     {
                bgColor         :  new RGBColor(255,255,255),
                color           :  new RGBColor(255,0,0),
                outlineColor    :  new RGBColor(0,0,0),
                width           : 400,
                height          : 400,
                speed           : 40,
                steps           : 50,
                animate         : 1,
                xMin            : 12,
                xMax            : 33,
                yMin            : 0,
                yMax            : 100,
            };

            jQuery.extend (options, settings);

            var target = document.getElementById(options.target);
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
            new Point(
                parseInt(canvas.width) - parseInt(canvas.width) / fraction + 40,
                0
            ),
            new Size(
                parseInt(canvas.width) / fraction - 40,
                parseInt(canvas.height) / fraction - 30
            )
        );

    },

    getXLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        var xbounds = new Rectangle(
            new Point(
                graphBounds.origin.x,
                graphBounds.origin.y + graphBounds.size.height
            ),
            new Size(
                graphBounds.size.width,
                graphBounds.origin.y + graphBounds.size.height
            )
        );

        return xbounds;
    },

    getXGutterBounds : function(canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        var xbounds = new Rectangle(
            new Point(
                graphBounds.origin.x,
                0
            ),
            new Size(
                graphBounds.size.width,
                graphBounds.origin.y
            )
        );

        return xbounds;
    },

    getYLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle (
            new Point(
                0,
                graphBounds.origin.y
            ),
            new Size(
                graphBounds.origin.x,
                graphBounds.size.height
            )
        );

    },

    getYGutterBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle (
            new Point(
                graphBounds.origin.x + graphBounds.size.width,
                graphBounds.origin.y
            ),
            new Size(
                canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                graphBounds.size.height
            )
        );

    },

    getLLCornerLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);
        var xLabelBounds = renderer.getXLabelBounds(canvas);
        var yLabelBounds = renderer.getYLabelBounds(canvas);

        return new Rectangle(
            new Point(yLabelBounds.origin.x, xLabelBounds.origin.y),
            new Size(yLabelBounds.size.width, xLabelBounds.size.height)
        );
    },

    getULCornerLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle(
            new Point(0,0),
            new Size(graphBounds.origin.x, graphBounds.origin.y)
        );
    },

    getURCornerLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle(
            new Point(graphBounds.origin.x + graphBounds.size.width,0),
            new Size(
                canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                graphBounds.origin.y
            )
        );
    },

    getLRCornerLabelBounds : function (canvas) {
        var graphBounds = renderer.getGraphBounds(canvas);

        return new Rectangle(
            new Point(graphBounds.origin.x + graphBounds.size.width,graphBounds.origin.y + graphBounds.size.height),
            new Size(
                canvas.width - (graphBounds.size.width + graphBounds.origin.x),
                canvas.height - (graphBounds.size.height + graphBounds.origin.y)
            )
        );
    },

    renderCanvas : function (canvas,options) {

        var me = arguments.callee;
        if (me.steps == undefined) {
            me.step = 0;
            me.steps = options.steps;
        }

        var ctx = canvas.getContext('2d');
        var initialDraw = true;

        if (ctx) {
            var graphBounds = renderer.getGraphBounds(canvas);

            ctx.fillStyle = options.bgColor.asString();
            ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            ctx.strokeStyle = options.outlineColor.asString();
            ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            if (me.max == undefined) {
                me.max = 0;
                for (var i = 0; i < options.data.length; i++) {
                    if (options.data[i].height > me.max) {
                        me.max = options.data[i].height;
                    }
                }

                me.distance = me.max / me.steps;

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

            renderer.drawGrid(
                canvas,
                {
                    ticks : 10,
                    bounds : renderer.getGraphBounds(canvas),
                    color : new RGBColor(210,210,210),
                }
            );

            for (var i = 0; i < options.data.length; i++) {
                ctx.fillStyle = options.data[i].color.asString();



                if (options.data[i].y == undefined) {
                    options.data[i].y = 0;
                }

                var maxBarHeight = options.data[i].height * graphBounds.size.height;
                var curBarHeight = me.step * me.distance * graphBounds.size.height;
                if (curBarHeight > maxBarHeight) {
                    curBarHeight = maxBarHeight;
                }

                curBarHeight = me.step / me.steps * graphBounds.size.height * options.data[i].height;

                var barRect = new Rectangle(
                    new Point(
                        options.data[i].x * graphBounds.size.width + graphBounds.origin.x,
                        graphBounds.size.height - curBarHeight - graphBounds.size.height * options.data[i].y + graphBounds.origin.y
                    ),
                    new Size(
                        options.data[i].width * graphBounds.size.width,
                        curBarHeight
                    )
                );

                var grad = ctx.createLinearGradient(
                    barRect.origin.x,
                    barRect.origin.y,
                    barRect.origin.x,
                    barRect.origin.y+barRect.size.height
                );
                grad.addColorStop(0,"rgb(" + options.data[i].color.r + ',' + options.data[i].color.g + ',' + options.data[i].color.b + ')');
                grad.addColorStop(1,options.bgColor.asString());
                ctx.fillStyle = grad;


                ctx.fillRect(
                    barRect.origin.x,
                    barRect.origin.y,
                    barRect.size.width,
                    barRect.size.height
                );

                ctx.strokeRect(
                    barRect.origin.x,
                    barRect.origin.y,
                    barRect.size.width,
                    barRect.size.height
                );
            }

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
