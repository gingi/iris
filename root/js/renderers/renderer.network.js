(function() {
    Iris.Renderer.extend({
        about: {
            name: "network",
            author: "Paul and Jer-Ming",
            version: "1.0",
            requires: ['d3.js'],
            options: {
                'key': 'value',
                'target': 'test',
                'data': 'exampleData()'
            },
            defaults: {
                key: "value",
                target: "test",
                width: 600,
                height: 600,
                data: []
            },
            classes: [],
            dataFormat: "list of string"
        },

        render: render,

        exampleData: function() {
            var nodeSize = 30;

            return {
                types: {
                    compound: {
                        shape: 'circle',
                        attrs: {
                            cx: function(node) {
                                return node.x;
                            },
                            cy: function(node) {
                                return node.y;
                            }
                        },
                        defaults: {
                            r: nodeSize / 2
                        }
                    },
                    enzyme: {
                        shape: 'rect',
                        attrs: {
                            x: function(node) {
                                return node.x - nodeSize;
                            },
                            y: function(node) {
                                return node.y - nodeSize / 2;
                            }
                        },
                        defaults: {
                            width: nodeSize * 2,
                            height: nodeSize
                        }
                    }
                },

                nodes: [{
                    x: 300,
                    y: 100,
                    id: 1,
                    type: 'compound'
                }, {
                    x: 100,
                    y: 500,
                    id: 2,
                    type: 'enzyme'
                }, {
                    x: 500,
                    y: 500,
                    id: 3,
                    type: 'compound'
                }],

                edges: [{
                    source: 1,
                    target: 2,
                    id: '1to2'
                }, {
                    source: 2,
                    target: 3,
                    id: '2to3'
                }, {
                    source: 3,
                    target: 1,
                    id: '3to1'
                }]
            };
        }
    });

    function render(options) {
        var target = options.target;
        target.innerHTML = "";

        var data = options.data;

        var nodeHash = {
            ids: {},
                types: {}
        };

        for (var i = 0; i < data.nodes.length; i++) {
            var node = data.nodes[i];
            nodeHash.ids[node.id] = node;

            if (typeof(nodeHash.types[node.type]) === 'undefined') {
                nodeHash.types[node.type] = [];
            }

            nodeHash.types[node.type].push(node);
        }

        var vis = d3.select(target).append('svg').attr('width', options.width).attr('height', options.height);


        for (var type in data.types) {
            var ret = vis.selectAll(data.types[type].shape).data(nodeHash.types[type]).enter().append(data.types[type].shape);

            for (var attr in data.types[type].attrs) {
                (function(type, attr) {
                    ret.attr(attr, function(d, i) {
                        return data.types[type].attrs[attr](d);
                    });
                })(type, attr);
            }

            for (var def in data.types[type].defaults) {
                var val = data.types[type].defaults[def];
                ret.attr(def, val);
            }

            // TODO: figure out weird 2nd drag jump bug, hack now to fix
            var num = 0;
            ret.call(d3.behavior.drag()
                     .on("dragstart", function(d, i) {num = 0;})
                     .on("drag", function(d, i) {
                         num++;
                         if (num === 2) {
                             return false;
                         }

                         d.x += d3.event.dx;
                         d.y += d3.event.dy;
                         render(settings);
                     }));
        }

        vis.selectAll('line').data(data.edges).enter().append('line').attr('x1', function(d, i) {
            return nodeHash.ids[d.source].x;
        }).attr('x2', function(d, i) {
            return nodeHash.ids[d.target].x;
        }).attr('y1', function(d, i) {
            return nodeHash.ids[d.source].y;
        }).attr('y2', function(d, i) {
            return nodeHash.ids[d.target].y;
        }).style('stroke', 'black');

        vis.selectAll('text').data(data.nodes).enter().append('text').attr('x', function(d, i) {
            return d.x;
        }).attr('y', function(d, i) {
            return d.y;
        }).attr('fill', '#FFFFFF').text(function(d, i) {
            return d.id;
        });
    }
}).call(this);