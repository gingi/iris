
(function () {

	var schema = {
		properties: {
			data: {
                value: { type : 'number', minimum : 0, maximum : 1, required : true}
			}
		}
	}

  var renderer = {
        about: {
                name: "Thermometer",
                author: "Jim Thomason",
                version: "1.0",
                requires: ['geometry/rectangle.js', 'geometry/point.js', 'geometry/size.js', 'RGBColor.js'],
                options: {
                    'bottomColor': 'RGBColor()',
                    'topColor': 'RGBColor()',
                    'outlineColor': 'RGBColor()',
                    'value' : 'number'
                },
                classes: [],
                dataFormat: "list of string",
                defaults: {
                    width           : 10,
                    height          : 400
                },
                setDefaults: function () {
                    return {
                        topColor        :  new RGBColor(255,0,0),
                        bottomColor     :  new RGBColor(255,255,255),
                        outlineColor    :  new RGBColor(0,0,0),
                    };
                },
                
        },
  exampleData : function () {
      return [
        {
            value   : 0.90,
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


        target.innerHTML = "";
        var canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        target.appendChild(canvas);

        renderer.renderCanvas(canvas,options);

    },

    renderCanvas : function (canvas,options) {


        var ctx = canvas.getContext('2d');

        if (ctx) {

            if (options.bounds == undefined) {
                options.bounds = new Rectangle(new Point(0,0), new Size(canvas.width, canvas.height));
            }

            var grad = ctx.createLinearGradient(
                options.bounds.origin.x,
                options.bounds.origin.y,
                options.bounds.size.width,
                options.bounds.size.height
            );
            grad.addColorStop(0,options.topColor.asString());
            grad.addColorStop(1,options.bottomColor.asString());
            ctx.fillStyle = grad;

            ctx.fillRect(
                options.bounds.origin.x,
                options.bounds.origin.y,
                options.bounds.size.width,
                options.bounds.size.height
            );

            var invGrad = ctx.createLinearGradient(
                options.bounds.origin.x,
                options.bounds.origin.y,
                options.bounds.size.width,
                options.bounds.size.height
            );
            invGrad.addColorStop(0,options.topColor.invert().darkenBy(30).asString());
            invGrad.addColorStop(1,options.bottomColor.invert().darkenBy(30).asString());
            ctx.fillStyle = invGrad;

            if (options.data[0].value > 0.45 && options.data[0].value < 0.55) {
//                ctx.fillStyle = '#000';
            }

            ctx.fillRect(
                options.bounds.origin.x,
                (1 - options.data[0].value) * options.bounds.size.height + options.bounds.origin.y,
                options.bounds.size.width,
                1
            );

            //ctx.strokeStyle = options.outlineColor;
            //ctx.strokeRect(0,0,options.bounds.width,canvas.height);
        }
    },
  };

  Iris.Renderer.extend(renderer);
}).call(this);
