(function() {
    var schema = {
        properties: {
            target: {
                type: 'string',
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
        about: function() {
            return {
                name: "template",
                author: "Tobias Paczian",
                version: "1.0",
                requires: [],
                options: {
                    'key': 'value',
                    'target': 'test',
                    'data': 'exampleData()'
                },
                classes: [],
                data_format: "list of string"
            }
        },
        exampleData: function() {
            return ["A", "B", "C"];
        },
        render: function(settings) {

            var options = {
                key: "value",
                target: "test",
                data: []
            };
            jQuery.extend(options, settings);

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
