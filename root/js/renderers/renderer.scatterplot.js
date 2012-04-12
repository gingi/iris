(function () {
    var schema = {
        properties: {
            target: {
                type: 'string',
                required: true
            },
            width: {
                type: 'integer',
                required: true
            },
            height: {
                type: 'integer',
                required: true
            },
            strokeStyle: {
                type: "string",
                format: "color",
                required: true
            },
            mincolor: {
                type: 'array',
                items: {
                    type: 'integer'
                }
            },
            maxcolor: {
                type: 'array',
                items: {
                    type: 'integer'
                }
            },
            glyph: {
                enum: ['circle']
            },
            radius: {
                type: 'number'
            },
			axes: {
				type: 'boolean'
			},
			boundingBox: {
				type: 'boolean'
			},
			scale: {
				type: 'array',
				items: {
					enum: ['linear','log']
				}
			},
			xPadding: {
				type: 'integer'
			},
			yPadding: {
				type: 'integer'
			},
			x: { type: 'integer' },
			y: { type: 'integer' },
			colorBy: { type: 'integer' },
			scaleBy: { type: 'integer' },
            data: {
                required: true,
                type: 'array',
                items: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 4,
                    items: {
                        type: 'number'
                    }
                }
            }
        }
    };
    Iris.Renderer.extend({
        about: function() {
            return {
                name: "scatterplot",
                author: "Andrew Olson",
                version: "1.0",
                requires: [],
                options: {
                    'key': 'value',
                    'target': 'test',
                    'data': 'example_data()'
                },
                classes: [],
                data_format: "list of tuples"
            }
        },
        example_data: function() {
			var sampleData = new Array();
			for(var i=0; i< 1000; i++) {
				sampleData[i] = new Array();
				sampleData[i][0] = 2^i;
				sampleData[i][1] = Math.random()*100 - 50;
				sampleData[i][2] = Math.random()*10;
				sampleData[i][3] = Math.floor(Math.random()*21);
			}
			return sampleData;
//            return [[-5, -3, 0], [1, 1, 2], [2, 2, 2], [3, 30, 2], [10, 4, 3]];
        },
        render: function(settings) {
            this.options = {
                target: "test",
                width: 800,
                height: 400,
                strokeStyle: "black",
                minColor: [150, 150, 150],
                maxColor: [0, 0, 0],
                glyph: 'circle',
                minRadius: 1,
				maxRadius: 20,
				xPadding: 10,
				yPadding: 10,
				axes: true,
				boundingBox: true,
				x: 0,
				y: 1,
				colorBy: 2,
				scaleBy: 3,
				scale: ['linear','linear','linear','linear'],
                data: []

            };
            jQuery.extend(this.options, settings);
			var opt = this.options;
            var check = window.json.validate(opt, schema);
            if (!check['valid']) {
                $.error(check['errors']);
            }
            var data = this.options.data;

            var target = document.getElementById(this.options.target);
            var canvas;
            if (target.tagName === "CANVAS") {
                canvas = target;
            } else {
                canvas = document.createElement('canvas');
                target.appendChild(canvas);
            }
            canvas.width = this.options.width;
            canvas.height = this.options.height;
            var ctx = canvas.getContext('2d');
            ctx.strokeStyle = this.options.strokeStyle;
			if (opt.boundingBox) {
				ctx.strokeRect(0, 0, canvas.width, canvas.height);
			}
            var colorRange = [
            	opt.maxColor[0] - opt.minColor[0],
				opt.maxColor[1] - opt.minColor[1],
				opt.maxColor[2] - opt.minColor[2]];
			var axes = new Array();
            for (var j = 0; j < data[0].length; j++) {
				axes[j] = new Object();
				axes[j].min = data[0][j];
				axes[j].max = data[0][j];
            }
            for (var i = 1; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    if (data[i][j] < axes[j].min) {
                        axes[j].min = data[i][j];
                    }
                    if (data[i][j] > axes[j].max) {
                        axes[j].max = data[i][j];
                    }
                }
            }
			if (this.options.axes) {
				// adjust min and max if necessary
				if(0 < axes[opt.x].min) { axes[opt.x].min = 0 }
				if(0 > axes[opt.x].max) { axes[opt.x].max = 0 }
				if(0 < axes[opt.y].min) { axes[opt.y].min = 0 }
				if(0 > axes[opt.y].max) { axes[opt.y].max = 0 }
			}
			for (var i = 0; i<axes.length; i++) {
				axes[i].range = axes[i].max - axes[i].min;
			}
			axes[opt.x].scale = function(value) {
				if (opt.scale[opt.x] === 'linear') {
					return opt.xPadding + (value - axes[opt.x].min) * (opt.width - 2*opt.xPadding) / axes[opt.x].range;
				} else {
					if (value === axes[opt.x].min) {
						return opt.xPadding;
					}
					return opt.xPadding + Math.log(value - axes[opt.x].min) * (opt.width - 2*opt.xPadding) / Math.log(axes[opt.x].range);
				}
			}
			axes[opt.y].scale = function(value) {
				if (opt.scale[opt.y] === 'linear') {
					return opt.yPadding + (axes[opt.y].max - value) * (opt.height - 2*opt.yPadding) / axes[opt.y].range; 
				} else {
					if (value === axes[opt.y].min) {
						return opt.yPadding;
					}
					return opt.yPadding + opt.height - Math.log(value - axes[opt.y].min) * (opt.height - 2*opt.yPadding) / Math.log(axes[opt.y].range); 
				}
			}
			var doColor = false;
			if (opt.colorBy < axes.length && opt.colorBy >= 0) {
				doColor = true;
				axes[opt.colorBy].toRGB = function(value) {
					var ratio = (value - axes[opt.colorBy].min)/axes[opt.colorBy].range;
	                var r = opt.minColor[0] + Math.floor(ratio * colorRange[0]);
	                var g = opt.minColor[1] + Math.floor(ratio * colorRange[1]);
	                var b = opt.minColor[2] + Math.floor(ratio * colorRange[2]);
	                return "rgb(" + r + "," + g + "," + b + ")";
				}
			}
			var doScale = false;
			if (opt.scaleBy < axes.length && opt.scaleBy >= 0) {
				doScale = true;
				axes[opt.scaleBy].radius = function(value) {
					return opt.minRadius + (opt.maxRadius - opt.minRadius) * (value - axes[opt.scaleBy].min) / axes[opt.scaleBy].range; 
				}
			}
            for (var i = 0; i < data.length; i++) {
  			    var x = axes[opt.x].scale(data[i][0]);
  			    var y = axes[opt.y].scale(data[i][1]);
				if (doColor) {
					ctx.fillStyle = axes[opt.colorBy].toRGB(data[i][opt.colorBy]);
				}
				if (this.options.glyph === 'circle') {
					var radius = doScale ? axes[opt.scaleBy].radius(data[i][opt.scaleBy]) : opt.radius;
                    ctx.beginPath();
                    ctx.arc(Math.floor(x), Math.floor(y), radius, 0, 2 * Math.PI, true);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
                }
            }
			if (this.options.axes) {
				ctx.strokeRect(
					Math.floor(axes[0].scale(axes[0].min)),
					Math.floor(axes[1].scale(0)),
					opt.width - 2*opt.xPadding,1);
				ctx.strokeRect(
					Math.floor(axes[0].scale(0)),
					Math.floor(axes[1].scale(axes[1].max)),
					1,opt.height - 2*opt.yPadding);
			}
        }
    });
}).call(this);
