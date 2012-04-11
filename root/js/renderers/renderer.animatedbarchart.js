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
						x: {type: 'number', required: true, minimum : 0, maximum : 1},
						y: {type: 'number', required: false, minimum : 0, maximum : 1},
						width: {type: 'number', required: true, minimum : 0, maximum : 1},
						height: {type: 'number', required: true, minimum : 0, maximum : 1},
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
            me.steps = options.steps;
        }

        var ctx = canvas.getContext('2d');

        if (ctx) {
            var graphBounds = methods.getGraphBounds(canvas);

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

            for (var i = 0; i < options.data.length; i++) {
                ctx.fillStyle = options.data[i].color.asString();



                if (options.data[i].y == undefined) {
                    options.data[i].y = 0;
                }

                var maxBarHeight = options.data[i].height * canvas.height;
                var curBarHeight = me.step * me.distance * canvas.height;
                if (curBarHeight > maxBarHeight) {
                    curBarHeight = maxBarHeight;
                }

                curBarHeight = me.step / me.steps * canvas.height * options.data[i].height;

                var barRect = new Rectangle(
                    new Point(
                        options.data[i].x * canvas.width,
                        canvas.height - curBarHeight - canvas.height * options.data[i].y
                    ),
                    new Size(
                        options.data[i].width * canvas.width,
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

            if (me.step < me.steps) {
                me.step++;
                setTimeout(function() {me(canvas, options) }, options.speed);
            }


        }

    },



  };

  jQuery.fn.RendererAnimatedbarchart = function( method ) {
    if ( methods[method] ) {
      return methods[method](arguments[1]);
    } else {
      jQuery.error( 'Method ' +  method + ' does not exist on jQuery.RendererTemplate' );
    }
  };

})( jQuery );
