(function() {
    Iris.Renderer.extend({
        about: {
            name: "template",
            author: "Tobias Paczian",
            version: "1.0",
            requires: [],
            defaults: {
                fontname: "arial",
				fontsize: "10pt"
            },
            schema: {
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
            }
        },
        exampleData: function () {
            return "Hello World";
        },
        render: function (args) {
            args.target.innerHTML = "<p style='font-name: "+args.fontname+"; font-size: "+args.fontsize+";'>"+args.data+"</p>";
        }
    });
}).call(this);
