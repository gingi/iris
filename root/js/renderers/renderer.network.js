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

        render: function(options) {
            var target = options.target;
            target.innerHTML = "";

            var data = options.data;

            var nodeHash = {
                ids: {},
                types: {}
            };

            // build hashes for node/edge lookup
            for (var i=0; i<data.nodes.length; i++) {
                var node = data.nodes[i];
                nodeHash.ids[node.id] = node;
                node.edges = [];

                if (typeof(nodeHash.types[node.type]) === 'undefined') {
                    nodeHash.types[node.type] = [];
                }

                nodeHash.types[node.type].push(node);
            }

            for (var i=0; i<data.edges.length; i++) {
                var edge = data.edges[i];
                nodeHash.ids[edge.source].edges.push(['s', edge.id]);
                nodeHash.ids[edge.target].edges.push(['t', edge.id]);
            }

            var svg = d3.select(target)
                .append('svg:svg')
                .attr('width', options.width)
                .attr('height', options.height);

            // lines go first so they are on bottom of svg (lower z-index in html lingo)
            svg.selectAll('line')
                .data(data.edges)
                .enter().append('svg:line')
                .attr('id', function(d) {
                    return 'edge_' + d.id;
                })
                .attr('x1', function(d) {
                    return nodeHash.ids[d.source].x;
                }).attr('x2', function(d) {
                    return nodeHash.ids[d.target].x;
                }).attr('y1', function(d) {
                    return nodeHash.ids[d.source].y;
                }).attr('y2', function(d) {
                    return nodeHash.ids[d.target].y;
                }).style('stroke', 'black');

            // TODO: make sure there are nodes for the type
            for (var type in data.types) {
                var info = data.types[type];
                var g = svg.selectAll('none')
                    .data(nodeHash.types[type])
                    .enter().append('svg:g')
                    .attr('transform', function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    })
                    .call(d3.behavior.drag()
                          .origin(Object)
                          .on('drag', drag));

                var shape = g.append('svg:' + info.shape)
                    .attr('id', function(d) {
                        return 'node_' + d.id;
                    });

                for (var attr in info.attrs) {
                    shape.attr(attr, info.attrs[attr]);
                }

                // positioning logic here
                if (info.dx || info.dy) {
                    shape.attr('transform', function(d) {
                        var dx = (typeof info.dx === 'number' ? info.dx : 0);
                        var dy = (typeof info.dy === 'number' ? info.dy : 0);
                        return "translate(" + dx + "," + dy + ")";
                    });
                } else {
                    // try to position based on shape
                    if (info.shape === 'rect') {
                        shape.attr('transform', function(d) {
                            // first ensure width and height
                            var dx = info.attrs.width / 2;
                                var dy = info.attrs.height / 2;
                            return "translate(-" + dx + ",-" + dy + ")";
                        });
                    }
                }

                var text = g.append('svg:text')
                    .attr('text-anchor', 'middle')
                    .attr('pointer-events', 'none')
                    .attr('fill', '#FFFFFF')
                    .attr('opacity', '1')
                    .text(function(d) {
                        return d.id;
                    });
            }

            // prevent text from being selected (probably doesn't work in ie)
            // and set the color (should do this via css eventually)
            $('text').css({
                '-moz-user-select'   : 'none',
                '-khtml-user-select' : 'none',
                '-webkit-user-select': 'none',
                'user-select'        : 'none'
            });

            var padding = 10;
            function drag() {
                d3.select(this)
                    .attr('transform', function(d) {
                        d.x = Math.max(padding, Math.min(options.width  - padding, d3.event.x));
                        d.y = Math.max(padding, Math.min(options.height - padding, d3.event.y));

                        // move the edge
                        for (var i=0; i<d.edges.length; i++) {
                            var edge = d.edges[i];

                            var which = (edge[0] === 's' ? '1' : '2');
                            d3.select($('#edge_' + edge[1])[0])
                                .attr('x' + which, d.x)
                                .attr('y' + which, d.y);
                        }

                        // translate will move the node
                        return "translate(" + d.x + "," + d.y + ")";
                    });
            }
        },

        exampleData: function() {
            return {
                types: {
                    star: {
                        shape: 'polygon',
                        attrs: {
                            points: "30,3 12,54 57,18 3,18 48,54"
                        },
                        dx: -30,
                        dy: -30
                    },
                    rectangle: {
                        shape: 'rect',
                        attrs: {
                            width: 48,
                            height: 30
                        }
                    },
                    ellipse: {
                        shape: 'ellipse',
                        attrs: {
                            rx: 25,
                            ry: 18
                        }
                    }
                },

                nodes: [{ x: 300, y: 100, id: 1, type: 'star'      },
                        { x: 100, y: 500, id: 2, type: 'rectangle' },
                        { x: 500, y: 500, id: 3, type: 'ellipse'   }],

                edges: [{ source: 1, target: 2, id: '1to2' },
                        { source: 2, target: 3, id: '2to3' },
                        { source: 3, target: 1, id: '3to1' }]
            };
        }
    });
})();