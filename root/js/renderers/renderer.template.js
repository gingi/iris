(function() {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            data: {
                required: true,
                type: 'array',
                items: {
                    type: 'string'
                }
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
                key: "value",
                target: "test"
            },
            setDefaults: function () {
                // Callback for defaults loaded at render time.
                return {};
            },
            dataFormat: "list of string"
        },
        exampleData: function () {
            return ["A", "B", "C"];
        },
        render: function (options) {

            var target = options.target;
            var opt = options;

            var check = window.json.validate(opt, schema);
            if (!check['valid']) {
                console.log(check['errors']);
                $.error(check['errors']);
            }

            target.innerHTML = "";

            var html = "";
            var data = options.data;
            for (i = 0; i < data.length; i++) {
                html += data[i];
            }
            target.innerHTML = html;
        }
    });
}).call(this);
