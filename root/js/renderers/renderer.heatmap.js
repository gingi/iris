
(function () {
	var schema = {
		properties: {
			data: {
				required: true,
				type: 'array',
				items: {
					type: 'object',
					properties: {
						x: {type: 'number', minimum: 0, maximum: 1, required: true},
						y: {type: 'number', minimum: 0, maximum: 1, required: true},
						width: {type: 'number', minimum: 0, maximum: 1, required: true},
						height: {type: 'number', minimum: 0, maximum: 1, required: true},
						score: {type: 'number', minimum: 0, maximum: 1, required: true}
					}
				}
			}
		}
	}
  var renderer = {
     about : {
      name: "heatmap",
      author: "Jim Thomason",
      version: "1.0",
      requires: ['rectangle.js', 'point.js', 'size.js', 'RGBColor.js'],
      options: {
            bgColor: 'RGBColor()',
            color: 'RGBColor()',
            data: '[]'
        },
        defaults: {
            visThreshold    : 0.01,
            width           : 400,
            height          : 400,
            thermometer     : 1,
        },
        setDefaults: function () {
            return {
                bgColor         :  new RGBColor(255,255,255),
                color           :  new RGBColor(255,0,0),
                outlineColor    :  new RGBColor(0,0,0),
                studies : {
                    alpha : new RGBColor(255,0,0),
                    beta  : new RGBColor(0,255,0),
                    gamma : new RGBColor(0,0,255),
                }
            };
        },
      classes: [ ],
      dataFormat: "list of string"
    },
    exampleData : function () {

        var ret = [];
        var numSquares = 50;
        for (var x = 0.00; x < 1.00; x += 1.00 / numSquares) {
            for (var y = 0.00; y < 1.00; y += 1.00 / numSquares) {
                ret.push(
                    {
                        x : x,
                        y : y,
                        width : 1.00 / numSquares,
                        height : 1.00 / numSquares,
                        score : Math.random(),
                        study : 'alpha',
                    }
                );
            }
        }
        
        ret.push(
            { x : 1 * 1.00 / numSquares, y : 1 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'beta'},
            { x : 2 * 1.00 / numSquares, y : 2 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'beta'},
            { x : 3 * 1.00 / numSquares, y : 3 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'gamma'},
            { x : 4 * 1.00 / numSquares, y : 4 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'gamma'},
            { x : 5 * 1.00 / numSquares, y : 5 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'beta'},
            { x : 5 * 1.00 / numSquares, y : 5 * 1.00 / numSquares, width : 1.00 / numSquares, height : 1.00 / numSquares, score : Math.random(), study : 'gamma'}
        );

        return ret;

    },

  render : function (options) {

        jQuery.get('/js/renderers/renderer.thermometer.js');

        renderer.thermometer = options.thermometer;
        
        if (renderer.thermometer) {
            var seen = {};
            var count = 0;
            for (var i = 0; i < options.data.length; i++) {
                var region = options.data[i];

                if (! seen[region.study]) {
                    seen[region.study] = 1;
                    count++;
                }
            }
            renderer.thermometerCount = count;

        }

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

        if (options.thermometer) {
            canvas.width += 10;
        }

        target.appendChild(canvas);

        renderer.renderCanvas(canvas,options);
    },

    getGraphBounds : function (canvas, fraction) {
        if (! fraction) {
            fraction = 1;
        }

        var thermWidth = 0;
        if (renderer.thermometer != undefined) {
            thermWidth = 10 * renderer.thermometerCount;
        }

        return new Rectangle(
            new Point(
                parseInt(canvas.width) - parseInt(canvas.width) / fraction,
                0
            ),
            new Size(
                parseInt(canvas.width) / fraction /*- 40*/ - thermWidth,
                parseInt(canvas.height) / fraction /*- 30*/
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


    colorForStudy : function (study, options) {
        if (options.studies[study]) {
            return options.studies[study];
        }
        else {
            return options.color;
        }
    },

    renderCanvas : function (canvas,options) {

        var ctx = canvas.getContext('2d');

        if (ctx) {

            var graphBounds = options.bounds;
            if (graphBounds == undefined) {
                graphBounds = renderer.getGraphBounds(canvas);
            }

            ctx.fillStyle = options.bgColor.asString();
            ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            for (var i = 0; i < options.data.length; i++) {
                var region = options.data[i];
                var regionRect = new Rectangle(
                    new Point(
                        region.x * graphBounds.size.width + graphBounds.origin.x,
                        region.y * graphBounds.size.height + graphBounds.origin.y
                    ),
                    new Size(
                        region.width * graphBounds.size.width,
                        region.height * graphBounds.size.height
                    )
                );

                var alphaColor = this.colorForStudy(region.study, options).asStringWithAlpha(region.score);

                if (region.score > options.visThreshold) {
                    ctx.fillStyle = alphaColor;
                    ctx.fillRect(regionRect.origin.x,regionRect.origin.y, regionRect.size.width, regionRect.size.height);
                }

            };

            if (options.thermometer) {
                canvas.addEventListener('mousemove', function(e) { renderer.mousemotion(e, options.data, renderer, canvas, graphBounds, options) }, false);
                canvas.addEventListener('mouseout', function(e) { renderer.mouseout(e, renderer, canvas, options) }, false);
            }

            ctx.strokeStyle = options.outlineColor.asString();
            ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

        }
    },
    mouseout : function(e, renderer, canvas, options) {
        var ctx = canvas.getContext('2d');
        var gutter = renderer.getYGutterBounds(canvas);
        ctx.fillStyle = options.bgColor.asString();
        ctx.fillRect(gutter.origin.x,gutter.origin.y,gutter.size.width,gutter.size.height);
    },
    mousemotion : function (e, data, renderer, canvas, graphBounds, options) {

        var me = arguments.callee;

        var coords = new Point(
            e.offsetX,
            e.offsetY
        );
        if (e.offsetX == undefined || e.offsetY == undefined) {
            coords = new Point(e.layerX, e.layerY);
        }

        var thermOffset = 0;
        var lastRect;
        var needsClear = true;

        for (var i = 0; i < data.length; i++) {
            var region = data[i];
            var regionRect = new Rectangle(
                new Point(
                    region.x * graphBounds.size.width + graphBounds.origin.x,
                    region.y * graphBounds.size.height + graphBounds.origin.y
                ),
                new Size(
                    region.width * graphBounds.size.width,
                    region.height * graphBounds.size.height
                )
            );

            if (regionRect.containsPoint(coords)) {
                if (me.lastRect == undefined || regionRect.asString() != me.lastRect.asString()) {
                    var thermometer = Iris.Renderer.Thermometer;

                    var color = renderer.colorForStudy(region.study, options);

                    lastRect = regionRect;
                    if (thermometer) {
                    
                        var thermBounds = renderer.getYGutterBounds(canvas);
                        
                        if (needsClear) {
                            var ctx = canvas.getContext('2d');
                            ctx.fillStyle = options.bgColor.asString();
                            ctx.fillRect(thermBounds.origin.x,thermBounds.origin.y,thermBounds.size.width,thermBounds.size.height);
                            needsClear = false;
                        }
                        
                        thermBounds.size.width = thermBounds.size.width / renderer.thermometerCount;

                        thermBounds.origin.x += thermBounds.size.width * thermOffset++;
                    
                        thermometer.renderCanvas(
                            canvas,
                            {
                                topColor : color,
                                bottomColor : options.bgColor,
                                bounds : thermBounds,
                                data : [
                                    {
                                        value : region.score,
                                    }
                                ]
                            }
    
                        );
                    }
                }
            }
        }
        
        me.lastRect = lastRect;

    }



  };
    Iris.Renderer.extend(renderer);
}).call(this);
