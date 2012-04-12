(function () {

    Iris.Renderer.extend({
        about: function() {
            return {
                name: "resourceSelector",
                author: "Tobias Paczian",
                version: "1.0",
                requires: [],
                options: {
                    'id': 'resourceSelector',
                    'target': 'layout_east',
                    'data': 'example_data()',
                    'action_button': true,
                    'action_button_name': 'select',
                    'flow': 'example',
                    'flow_target': 'layout_east',
                    'resource': 'metagenome',
                    'resource_provider': 'MG-RAST'
                },
                classes: [],
                data_format: null
            }
        },
        example_data: function() {
            return null;
        },
        render: function(settings) {

            var options = {
                'id': 'resourceSelector',
                'target': 'test',
                'data': 'example_data()',
                'action_button': true,
                'action_button_name': 'select',
                'flow': 'example',
                'flow_target': 'layout_east',
                'resource': 'metagenome',
                'resource_provider': 'MG-RAST'
            };
            jQuery.extend(options, settings);

            var target = document.getElementById(options.target);
            var opt = options;

            target.innerHTML = "";

            get_objects(opt.resource, {
                data_repository: opt.resource_provider
            }, function() {
                var id = opt.id;
                var res = opt.resource;
                var html = "<select id='" + id + "' multiple>";
                var data = dh_DataStore[res];
                for (i in data) {
                    html += "<option value='" + i + "'>" + i + "</option>";
                }
                html += "</select>";
                target.innerHTML = html;

                if (opt.action_button) {
                    var buttonnode = document.createElement('input');
                    buttonnode.setAttribute('type', 'button');
                    buttonnode.setAttribute('value', opt.action_button_name);
                    buttonnode.onclick = function() {
                        load_dataflow(opt.flow, function() {
                            var groupfuncs = ['x'];
                            var viscols = [0, 0, 1, 0, 0, 0, 0, 0, 0];
                            var header = ["Phylum"];
                            var sel = [];
                            for (i = 0; i < document.getElementById(opt.id).options.length; i++) {
                                if (document.getElementById(opt.id).options[i].selected) {
                                    sel.push(document.getElementById(opt.id).options[i].value);
                                    header.push(document.getElementById(opt.id).options[i].value);
                                    viscols.push(1);
                                    groupfuncs.push('sum');
                                }
                            };
                            var flow = get_dataflow(opt.flow);
                            flow.params = {
                                "target": opt.flow_target,
                                "metagenome": sel,
                                "table_header": header,
                                "visible_columns": viscols,
                                "group_functions": groupfuncs
                            };
                            data_flow(flow);
                        });
                    };
                    target.appendChild(buttonnode);
                }

            }, null);
        }
    });
}).call(this);
