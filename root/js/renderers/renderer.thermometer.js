(function () {

	var schema = {
		properties: {
			data: {
                value: { type : 'number', minimum : 0, maximum : 1, required : true}
			}
		}
	}

  var renderer = {
        about: function() {
            return {
                name: "thermometer",
                author: "Jim Thomason",
                version: "1.0",
                requires: ['rectangle.js', 'point.js', 'size.js', 'RGBColor.js'],
                options: {
                    'bottomColor': 'RGBColor()',
                    'topColor': 'RGBColor()',
                    'outlineColor': 'RGBColor()',
                    'value' : 'number'
                },
                classes: [],
                data_format: "list of string"
            }
        },
  example_data : function () {
      return [
        {
            value   : 0.10,
            topColor : new RGBColor(255,0,0),
            bottomColor : new RGBColor(255,255,255)
        }
      ];
    },

  render : function ( settings ) {

        var options =     {
            bottomColor         :  new RGBColor(255,255,255),
            outlineColor    :  new RGBColor(0,0,0),
            width           : 10,
            height          : 400,
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

    renderCanvas : function (canvas,options) {


        var ctx = canvas.getContext('2d');

        if (ctx) {

            var grad = ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                canvas.height
            );
            grad.addColorStop(0,options.data[0].topColor.asString());
            grad.addColorStop(1,options.data[0].bottomColor.asString());
            ctx.fillStyle = grad;

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            var invGrad = ctx.createLinearGradient(
                0,
                0,
                canvas.width,
                canvas.height
            );
            invGrad.addColorStop(0,options.data[0].bottomColor.asString());
            invGrad.addColorStop(1,options.data[0].topColor.asString());
            ctx.fillStyle = invGrad;

            if (options.data[0].value > 0.45 && options.data[0].value < 0.55) {
                ctx.fillStyle = '#000';
            }

            ctx.fillRect(
                0,
                (1 - options.data[0].value) * canvas.height,
                canvas.width,
                1
            );
        }
    },
  };

  Iris.Renderer.extend(renderer);
}).call(this);
