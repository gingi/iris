
(function () {

	var schema = {
		properties: {
			data: {
                value: { type : 'string'}
			}
		}
	}

  var renderer = {
        about: {
                name: "marquee",
                author: "Jim Thomason",
                version: "1.0",
                requires: ['geometry/rectangle.js', 'geometry/point.js', 'geometry/size.js', 'RGBColor.js',
                    'canvas/led/led7.js', 'canvas/led/led16.js', 'canvas/led/marquee.js'],
                options: {
                    'bottomColor': 'RGBColor()',
                    'topColor': 'RGBColor()',
                    'outlineColor': 'RGBColor()',
                    'value' : 'number'
                },
                classes: [],
                dataFormat: "list of string",
                defaults: {
                    height          : 54,
                    characters      : 15,
                    animate         : 1,
                    speed           : 200,
                },
                setDefaults: function () {
                    return {
                        onColor    :  new RGBColor(255,0,0),
                        offColor   :  new RGBColor(51,0,0),
                        bgColor    :  new RGBColor(0,0,0),
                        origin     :  new Point(0,0),
                        led        : LED16 //or LED7
                    };
                },
                
        },
  exampleData : function () {
      return [
        {
            value   : "This is an unabashed toy with minimal practical use. But it sure looks cool!".toUpperCase(),
        }
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

        renderer.marquee = new Marquee(options);

        target.innerHTML = "";
        var canvas = document.createElement('canvas');
        canvas.width = renderer.marquee.bounds.size.width;
        canvas.height = renderer.marquee.bounds.size.height;
        target.appendChild(canvas);


        renderer.renderCanvas(canvas,options);

    },

    renderCanvas : function (canvas,options) {
        renderer.marquee.setString(options.data[0].value);
        var ctx = canvas.getContext('2d');
        renderer.marquee.draw(ctx);
    },
  };

  Iris.Renderer.extend(renderer);
}).call(this);
