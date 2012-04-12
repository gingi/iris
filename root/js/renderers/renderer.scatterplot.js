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
                type: 'string'
            },
            radius: {
                type: 'number'
            },
            data: {
                required: true,
                type: 'array',
                items: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 3,
                    items: {
                        type: 'number'
                    }
                }
            }
        }
    };
    Iris.Renderer.create({
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
            return [[0, 0, 0], [1, 1, 2], [2, 2, 2], [3, 30, 2], [10, 4, 3]];
        },
        render: function(settings) {
            this.options = {
                target: "test",
                width: 400,
                height: 400,
                strokeStyle: "black",
                mincolor: [150, 150, 150],
                maxcolor: [0, 0, 0],
                glyph: 'circle',
                radius: 5,
                data: []
            };
            jQuery.extend(this.options, settings);

            var check = window.json.validate(this.options, schema);
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
            ctx.strokeRect(0, 0, this.options.width, this.options.height);
            var colorRange = [
            this.options.maxcolor[0] - this.options.mincolor[0], this.options.maxcolor[1] - this.options.mincolor[1], this.options.maxcolor[2] - this.options.mincolor[2], ];
            var min = new Array();
            var max = new Array();
            for (var j = 0; j < data[0].length; j++) {
                min[j] = data[0][j];
                max[j] = data[0][j];
            }
            for (var i = 1; i < data.length; i++) {
                for (var j = 0; j < data[i].length; j++) {
                    if (data[i][j] < min[j]) {
                        min[j] = data[i][j];
                    }
                    if (data[i][j] > max[j]) {
                        max[j] = data[i][j];
                    }
                }
            }
            var xrange = max[0] - min[0];
            var yrange = max[1] - min[1];
            var xfactor = this.options.width / xrange;
            var yfactor = this.options.height / yrange;
            for (var i = 0; i < data.length; i++) {
                var x = xfactor * data[i][0];
                var y = this.options.height - yfactor * data[i][1];
                if (data[i].length === 3) {
                    var ratio = (data[i][2] - min[2]) / (max[2] - min[2]);
                    var r = this.options.mincolor[0] + Math.floor(ratio * colorRange[0]);
                    var g = this.options.mincolor[1] + Math.floor(ratio * colorRange[1]);
                    var b = this.options.mincolor[2] + Math.floor(ratio * colorRange[2]);
                    ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
                }
                if (this.options.glyph === 'circle') {
                    ctx.beginPath();
                    ctx.arc(Math.floor(x), Math.floor(y), this.options.radius, 0, 2 * Math.PI, true);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.fillRect(Math.floor(x), Math.floor(y), 2, 2);
                }
            }
        }
    });
}).call(this);
