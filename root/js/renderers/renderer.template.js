(function() {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            data: {
                required: true,
                type: 'string',
			}
        }
    };
    Iris.Renderer.extend({
        about: {
            name: "template",
            author: "Tobias Paczian",
            version: "1.0",
            requires: [],
            defaults: {
                fontname: "arial",
				fontsize: "10pt"
            }
        },
        exampleData: function () {
            return "Hello World";
        },
        render: function (options) {

            var target = options.target;
            var opt = options;

            var check = window.json.validate(opt, schema);
            if (!check['valid']) {
                console.log(check['errors']);
                $.error(check['errors']);
            }

            target.innerHTML = "<p style='font-name: "+options.fontname+"; font-size: "+options.fontsize+";'>"+options.data+"</p>";
        }
    });
}).call(this);
