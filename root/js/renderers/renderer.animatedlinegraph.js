document.write("<script type=\"text/javascript\" src=\"/js/rectangle.js\"></script>");
document.write("<script type=\"text/javascript\" src=\"/js/point.js\"></script>");
document.write("<script type=\"text/javascript\" src=\"/js/size.js\"></script>");
document.write("<script type=\"text/javascript\" src=\"/js/RGBColor.js\"></script>");


(function( jQuery ) {

	var schema = {
		properties: {
			data: {
				required: true,
				type: 'array',
				items: {
					type: 'object',
					properties: {
						color: {type: 'object', required: true},
						data : {
						    type : 'array',
						    required : true,
						    items : {
						        type : 'array',
						        required : true,
						        items : {
						            type : 'number',
						            minimum : 0,
						            maximum : 1,
						            required : true,
						        },
                                minItems : 2,
                                maxItems : 2,
						    }
						},
					}
				}
			}
		}
	}

  var methods = {
  about : function () {
      return {
      name: "Animated Line Graph",
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

  render : function ( settings ) {

        var options =     {
            bgColor         :  new RGBColor(255,255,255),
            color           :  new RGBColor(255,0,0),
            outlineColor    :  new RGBColor(0,0,0),
            visThreshold    :  0.01,
            width           : 400,
            height          : 400,
            speed           : 50,
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

        methods.renderCanvas(canvas,options);

    },

    getGraphBounds : function (div, fraction) {
        if (! fraction) {
            fraction = 1;
        }

        return new Rectangle(
            new Point( parseInt(div.width) - parseInt(div.width) / fraction, 0),
            new Size(parseInt(div.width) / fraction, parseInt(div.height) / fraction)
        );

    },

    getXLabelBounds : function (div) {
        var graphBounds = getGraphBounds(div);

        return new Rectangle(
            graphBounds.origin,
            new Size(parseInt(div.width) - graphBounds.size.width, parseInt(div.height) - graphBounds.size.height)
        );
    },

    getYLabelBounds : function (div) {
        var graphBounds = getGraphBounds(div);

        return new Rectangle (
            new Point(0,graphBounds.y),
            new Size(parseInt(div.width) - graphBounds.size.width, parseInt(div.height) - graphBounds.size.height)
        );

    },

    getCornerLabelBounds : function (div) {
        var graphBounds = getGraphBounds(div);
        var xLabelBounds = getXLabelBounds(div);
        var yLabelBounds = getYLabelBounds(div);

        return new Rectangle(
            new Point(yLabelBounds.origin.x, xLabelBounds.y),
            new Size(xLabelBounds.size.width, yLabelBounds.size.height)
        );
    },

    renderCanvas : function (canvas,options) {

        var me = arguments.callee;
        if (me.steps == undefined) {
            me.step = 0;
            me.steps = 0;
            for (var i = 0; i < options.data.length; i++) {
                if (options.data[i].data.length > me.steps) {
                    me.steps = options.data[i].data.length;
                }
            }
        }

        var ctx = canvas.getContext('2d');

        if (ctx) {
            var graphBounds = methods.getGraphBounds(canvas);

            ctx.fillStyle = options.bgColor.asString();
            ctx.fillRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            ctx.strokeStyle = options.outlineColor.asString();
            ctx.strokeRect(graphBounds.origin.x,graphBounds.origin.y,graphBounds.size.width,graphBounds.size.height);

            for (var i = 0; i < options.data.length; i++) {
                ctx.strokeStyle = options.data[i].color.asString();
                var data = options.data[i].data;

                ctx.shadowOffsetX = 3;
                ctx.shadowOffsetY = 3;
                ctx.shadowBlur    = 4;
                ctx.shadowColor   = 'rgba(60, 60, 60, 0.8)';

                ctx.beginPath();
                ctx.moveTo(
                    data[0][0] * canvas.width,
                    (1-data[0][1]) * canvas.height
                );

                var step = me.step;
                if (step > data.length) {
                    step = step;
                }

                for (var j = 0; j < step; j++) {
                    ctx.lineTo(
                        data[j][0] * canvas.width,
                        (1-data[j][1]) * canvas.height
                    );
                }
                ctx.stroke();
                ctx.shadowColor = 'rgba(0,0,0,0)';

            };

            if (me.step < me.steps) {
                me.step++;
                setTimeout(function() {me(canvas, options) }, options.speed);
            }


        }

    },



  };

  jQuery.fn.RendererAnimatedlinegraph = function( method ) {
    if ( methods[method] ) {
      return methods[method](arguments[1]);
    } else {
      jQuery.error( 'Method ' +  method + ' does not exist on jQuery.RendererTemplate' );
    }
  };

})( jQuery );
