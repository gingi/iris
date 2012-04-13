(function () {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            data: {
                type: 'object',
                properties: {
                    data: {
                        required: true,
                        type: 'array',
                        items: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    },
                    header: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    }
                }
            }
        }
    };
    Iris.Renderer.extend({
        about: {
            name: "Table",
            author: "Tobias Paczian",
            version: "1.0",
            requires: ['dataTable.min.js'],
            options: {
                'width': null,
                'height': null,
                'target': 'table_space',
                'data': 'exampleData()'
            },
            dataFormat: "list of list of 2-tuple of float"
        },
        exampleData: function () {
            return {
                data: [
                    ["a1", "b1", "c1"],
                    ["a2", "b2", "c2"],
                    ["a3", "b3", "c3"],
                    ["a4", "b4", "c4"],
                    ["a5", "b5", "c5"]
                ],
                header: ["col A", "col B", "col c"]
            };
        },
        render: function (options) {

/*
            var check = window.json.validate(options, schema);
            if (!check['valid']) {
               console.log(check['errors']);
            }
*/

            var tdata = options.data.data;
            if (typeof(tdata) == 'string') {
                eval("tdata = " + tdata);
            }
            var header = options.data.header;
            if (!options.data.header) {
                header = tdata.shift();
            }
            var target = options.target;
            var defined_width = "";
            if (options.width) {
                defined_width = "width: " + options.width + "px; ";
            }
            var defined_height = "";
            if (options.height) {
                defined_height = "height: " + options.height + "px; ";
            }
            var html = "<table id='widget_data_table' class='display' cellspacing='0' cellpadding='0' border='0' style='" + defined_width + " " + defined_height + "'><thead><tr>";
            for (var l = 0; l < header.length; l++) {
                html += "<th>" + header[l] + "</th>";
            }
            html += "</tr></thead><tbody>";
            for (var l = 0; l < tdata.length; l++) {
                if (tdata[l][0].indexOf('__') > -1) {
                    tdata[l][0] = tdata[l][0].substr(3);
                }
                while (tdata[l].length < header.length) {
                    tdata[l].push("");
                }
                html += "<tr><td>" + tdata[l].join("</td><td>") + "</td></tr>";
            }
            html += "</tbody></table>";
            target.innerHTML = html;

            var oTable = $('#widget_data_table').dataTable();
            oTable.selectedData = [];
            oTable.createDragData = function(data) {
                var drag_data = [];
                for (i = 0; i < data.length; i++) {
                    var row = [];
                    for (h = 0; h < data[i].childNodes.length; h++) {
                        row.push(data[i].childNodes[h].innerHTML);
                    }
                    drag_data.push(row);
                }
                return drag_data;
            }
            oTable[0].onmousedown = function(ev) {
                if (dragEnabled) {
                    ev = ev || window.event;
                    var mpos = mouseCoords(ev);
                    var selectedData = [];
                    var startSelect = ev.target;
                    var startSelectY = mpos.y;
                }
            };
            oTable[0].onmouseup = function(ev) {
                if (dragEnabled) {
                    if (dragData) {
                        make_table(target, header, dragData);
                        startSelect = null;
                        disableDrag();
                    }

                    if (startSelect) {
                        ev = ev || window.event;
                        var mpos = mouseCoords(ev);
                        if (startSelectY < mpos.y) {
                            var cnode = startSelect.parentNode;
                            selectedData.push(cnode);
                            while (cnode != ev.target.parentNode) {
                                cnode = cnode.nextSibling;
                                selectedData.push(cnode);
                            }
                        } else {
                            var cnode = ev.target.parentNode;
                            selectedData.push(cnode);
                            while (cnode != startSelect.parentNode) {
                                cnode = cnode.nextSibling;
                                selectedData.push(cnode);
                            }
                        }
                        dragData = oTable.createDragData(selectedData);
                        startSelect = null;
                    }
                }
            };
        }
    });
}).call(this);
