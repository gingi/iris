/*
 * Network Renderer
 * 
 * Todo:
 *  - Better customization of nodes/edges/labels
 *  - API for events and actions
 *    - Node events (select, double-click, right-click)
 *    - Multiple node selection
 *    - Zooming/panning actions
 *    - Hover
 * 
 */

(function() {
    Iris.Renderer.extend({
        about: {
            name: "network",
            author: "Paul and Jer-Ming",
            version: "1.0",
            requires: ['d3.v2.js'],
            options: {
                'key': 'value',
                'target': 'test',
                'data': 'exampleData()'
            },
            defaults: {
                key: 'value',
                target: 'test',
                width: 1000,
                height: 1000,
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
                .attr('height', options.height)
                .attr('pointer-events', 'all')
                .append('svg:g')
                .call(d3.behavior.zoom().on('zoom', zoom))
                .append('svg:g');

            svg.append('svg:rect')
                .attr('width', options.width)
                .attr('height', options.height)
                .attr('fill', 'white');

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
                }).style('stroke', '#747170');

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
                    .attr('fill', function(d,i){
                    	if (d.type === 'map'){
                    		return '#FFFFFF';
                    	}else{
                    		return 'black';
                    	}
                    })
					.attr("dy", function(d,i){
						if (d.type === 'compound'){
							return -(info.attrs.r+1)
						}else{
							return +2;
						}
						
					})
                    .attr('font-size', 5)
                    .attr('opacity', '0.8')
                    .text(function(d) {
                        if (d.label) {
                            return d.label;
                        } else {
                            return d.id;
                        }
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

            function zoom() {
//                console.log("zoom/pan", d3.event.translate, d3.event.scale);
                svg.attr("transform",
                         "translate(" + d3.event.translate + ")"
                         + " scale(" + d3.event.scale + ")");
            }

            var padding = 10;
            function drag() {
//                console.log('drag', d3.event.x, d3.event.y);
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

                return false;
            }
        },

        exampleData: function() {
            return kegg_data;
        }

/*
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
*/
    });

    var kegg_data = {

        "types": {
            compound: {
                shape: 'circle',
                attrs: {
                    r: 5,
                    fill: '#3288BD'
                }
            },
            enzyme: {
                shape: 'rect',
                attrs: {
                    width: 30,
                    height: 15,
                    fill: '#99D594'
                }
            },
            map: {
                shape: 'rect',
                attrs: {
                    width: 40,
                    height: 20,
                    rx: 4,
                    ry: 4,
                    fill: '#D53E4F'
                }
            }
        },

        "edges": [{"source":"97","target":"48","id":"97to48"},{"source":"41","target":"132","id":"41to132"},{"source":"52","target":"93","id":"52to93"},{"source":"68","target":"90","id":"68to90"},{"source":"98","target":"44","id":"98to44"},{"source":"61","target":"91","id":"61to91"},{"source":"52","target":"99","id":"52to99"},{"source":"91","target":"71","id":"91to71"},{"source":"133","target":"40","id":"133to40"},{"source":"92","target":"62","id":"92to62"},{"source":"90","target":"82","id":"90to82"},{"source":"91","target":"67","id":"91to67"},{"source":"70","target":"87","id":"70to87"},{"source":"93","target":"117","id":"93to117"},{"source":"81","target":"108","id":"81to108"},{"source":"102","target":"116","id":"102to116"},{"source":"113","target":"93","id":"113to93"},{"source":"74","target":"87","id":"74to87"},{"source":"134","target":"105","id":"134to105"},{"source":"132","target":"122","id":"132to122"},{"source":"95","target":"131","id":"95to131"},{"source":"101","target":"38","id":"101to38"},{"source":"138","target":"46","id":"138to46"},{"source":"105","target":"13","id":"105to13"},{"source":"49","target":"103","id":"49to103"},{"source":"40","target":"38","id":"40to38"},{"source":"99","target":"47","id":"99to47"},{"source":"102","target":"39","id":"102to39"},{"source":"88","target":"65","id":"88to65"},{"source":"92","target":"59","id":"92to59"},{"source":"54","target":"86","id":"54to86"},{"source":"39","target":"40","id":"39to40"},{"source":"122","target":"94","id":"122to94"},{"source":"102","target":"45","id":"102to45"},{"source":"62","target":"92","id":"62to92"},{"source":"85","target":"63","id":"85to63"},{"source":"105","target":"59","id":"105to59"},{"source":"67","target":"91","id":"67to91"},{"source":"76","target":"97","id":"76to97"},{"source":"99","target":"46","id":"99to46"},{"source":"94","target":"122","id":"94to122"},{"source":"58","target":"89","id":"58to89"},{"source":"102","target":"37","id":"102to37"},{"source":"114","target":"113","id":"114to113"},{"source":"50","target":"96","id":"50to96"},{"source":"63","target":"85","id":"63to85"},{"source":"13","target":"105","id":"13to105"},{"source":"101","target":"125","id":"101to125"},{"source":"72","target":"91","id":"72to91"},{"source":"73","target":"85","id":"73to85"},{"source":"137","target":"102","id":"137to102"},{"source":"82","target":"90","id":"82to90"},{"source":"44","target":"102","id":"44to102"},{"source":"90","target":"136","id":"90to136"},{"source":"130","target":"94","id":"130to94"},{"source":"40","target":"37","id":"40to37"},{"source":"125","target":"99","id":"125to99"},{"source":"100","target":"43","id":"100to43"},{"source":"48","target":"100","id":"48to100"},{"source":"87","target":"78","id":"87to78"},{"source":"83","target":"90","id":"83to90"},{"source":"132","target":"41","id":"132to41"},{"source":"91","target":"72","id":"91to72"},{"source":"64","target":"92","id":"64to92"},{"source":"40","target":"39","id":"40to39"},{"source":"86","target":"41","id":"86to41"},{"source":"55","target":"94","id":"55to94"},{"source":"132","target":"56","id":"132to56"},{"source":"120","target":"95","id":"120to95"},{"source":"87","target":"72","id":"87to72"},{"source":"90","target":"83","id":"90to83"},{"source":"94","target":"126","id":"94to126"},{"source":"93","target":"54","id":"93to54"},{"source":"71","target":"87","id":"71to87"},{"source":"91","target":"62","id":"91to62"},{"source":"74","target":"85","id":"74to85"},{"source":"89","target":"13","id":"89to13"},{"source":"91","target":"61","id":"91to61"},{"source":"79","target":"90","id":"79to90"},{"source":"69","target":"88","id":"69to88"},{"source":"127","target":"130","id":"127to130"},{"source":"37","target":"40","id":"37to40"},{"source":"99","target":"52","id":"99to52"},{"source":"87","target":"135","id":"87to135"},{"source":"96","target":"50","id":"96to50"},{"source":"73","target":"87","id":"73to87"},{"source":"108","target":"83","id":"108to83"},{"source":"84","target":"61","id":"84to61"},{"source":"39","target":"102","id":"39to102"},{"source":"56","target":"132","id":"56to132"},{"source":"99","target":"125","id":"99to125"},{"source":"90","target":"67","id":"90to67"},{"source":"87","target":"74","id":"87to74"},{"source":"46","target":"100","id":"46to100"},{"source":"85","target":"42","id":"85to42"},{"source":"104","target":"49","id":"104to49"},{"source":"77","target":"95","id":"77to95"},{"source":"43","target":"102","id":"43to102"},{"source":"78","target":"91","id":"78to91"},{"source":"102","target":"43","id":"102to43"},{"source":"91","target":"78","id":"91to78"},{"source":"134","target":"92","id":"134to92"},{"source":"91","target":"68","id":"91to68"},{"source":"86","target":"55","id":"86to55"},{"source":"138","target":"47","id":"138to47"},{"source":"47","target":"100","id":"47to100"},{"source":"85","target":"73","id":"85to73"},{"source":"94","target":"77","id":"94to77"},{"source":"65","target":"88","id":"65to88"},{"source":"49","target":"101","id":"49to101"},{"source":"87","target":"69","id":"87to69"},{"source":"132","target":"123","id":"132to123"},{"source":"132","target":"120","id":"132to120"},{"source":"94","target":"55","id":"94to55"},{"source":"90","target":"79","id":"90to79"},{"source":"132","target":"126","id":"132to126"},{"source":"13","target":"132","id":"13to132"},{"source":"49","target":"104","id":"49to104"},{"source":"56","target":"95","id":"56to95"},{"source":"126","target":"94","id":"126to94"},{"source":"88","target":"69","id":"88to69"},{"source":"116","target":"102","id":"116to102"},{"source":"59","target":"92","id":"59to92"},{"source":"102","target":"44","id":"102to44"},{"source":"62","target":"91","id":"62to91"},{"source":"37","target":"102","id":"37to102"},{"source":"38","target":"40","id":"38to40"},{"source":"53","target":"114","id":"53to114"},{"source":"88","target":"66","id":"88to66"},{"source":"46","target":"99","id":"46to99"},{"source":"96","target":"119","id":"96to119"},{"source":"48","target":"138","id":"48to138"},{"source":"72","target":"87","id":"72to87"},{"source":"104","target":"76","id":"104to76"},{"source":"94","target":"123","id":"94to123"},{"source":"45","target":"102","id":"45to102"},{"source":"114","target":"117","id":"114to117"},{"source":"80","target":"107","id":"80to107"},{"source":"50","target":"99","id":"50to99"},{"source":"70","target":"91","id":"70to91"},{"source":"85","target":"74","id":"85to74"},{"source":"58","target":"132","id":"58to132"},{"source":"67","target":"90","id":"67to90"},{"source":"90","target":"64","id":"90to64"},{"source":"91","target":"70","id":"91to70"},{"source":"106","target":"80","id":"106to80"},{"source":"103","target":"49","id":"103to49"},{"source":"93","target":"52","id":"93to52"},{"source":"99","target":"50","id":"99to50"},{"source":"55","target":"86","id":"55to86"},{"source":"66","target":"88","id":"66to88"},{"source":"98","target":"45","id":"98to45"},{"source":"105","target":"60","id":"105to60"},{"source":"65","target":"90","id":"65to90"},{"source":"64","target":"90","id":"64to90"},{"source":"68","target":"91","id":"68to91"},{"source":"101","target":"53","id":"101to53"},{"source":"98","target":"137","id":"98to137"},{"source":"107","target":"82","id":"107to82"},{"source":"92","target":"134","id":"92to134"},{"source":"109","target":"81","id":"109to81"},{"source":"133","target":"101","id":"133to101"},{"source":"87","target":"71","id":"87to71"},{"source":"101","target":"49","id":"101to49"},{"source":"71","target":"91","id":"71to91"},{"source":"86","target":"54","id":"86to54"},{"source":"132","target":"58","id":"132to58"},{"source":"100","target":"48","id":"100to48"},{"source":"90","target":"68","id":"90to68"},{"source":"91","target":"41","id":"91to41"},{"source":"40","target":"133","id":"40to133"},{"source":"48","target":"97","id":"48to97"},{"source":"48","target":"103","id":"48to103"},{"source":"91","target":"63","id":"91to63"},{"source":"38","target":"101","id":"38to101"},{"source":"88","target":"136","id":"88to136"},{"source":"54","target":"93","id":"54to93"},{"source":"95","target":"120","id":"95to120"},{"source":"90","target":"65","id":"90to65"},{"source":"63","target":"91","id":"63to91"},{"source":"94","target":"57","id":"94to57"},{"source":"59","target":"105","id":"59to105"},{"source":"97","target":"76","id":"97to76"},{"source":"87","target":"73","id":"87to73"},{"source":"95","target":"77","id":"95to77"},{"source":"60","target":"92","id":"60to92"},{"source":"92","target":"64","id":"92to64"},{"source":"90","target":"66","id":"90to66"},{"source":"102","target":"137","id":"102to137"},{"source":"99","target":"41","id":"99to41"},{"source":"136","target":"90","id":"136to90"},{"source":"120","target":"132","id":"120to132"},{"source":"66","target":"90","id":"66to90"},{"source":"47","target":"99","id":"47to99"},{"source":"117","target":"93","id":"117to93"},{"source":"98","target":"116","id":"98to116"},{"source":"13","target":"89","id":"13to89"},{"source":"135","target":"91","id":"135to91"},{"source":"53","target":"101","id":"53to101"},{"source":"131","target":"127","id":"131to127"},{"source":"88","target":"79","id":"88to79"},{"source":"69","target":"87","id":"69to87"},{"source":"77","target":"94","id":"77to94"},{"source":"123","target":"94","id":"123to94"},{"source":"135","target":"87","id":"135to87"},{"source":"87","target":"70","id":"87to70"}],

        "nodes":[{"y":556,"x":398,"type":"compound","label":"cpd:C01159","id":"127"},{"y":301,"x":332,"type":"compound","label":"cpd:C01172","id":"90"},{"y":173,"x":483,"type":"enzyme","label":"ec:5.4.2.2","id":"63"},{"y":218,"x":233,"type":"enzyme","label":"ec:2.7.1.1","id":"71"},{"y":953,"x":378,"type":"compound","label":"cpd:C00084","id":"102"},{"y":360,"x":181,"type":"enzyme","label":"ec:2.7.1.69","id":"80"},{"y":920,"x":629,"type":"map","label":"path:ec00640","id":"119"},{"y":863,"x":483,"type":"compound","label":"cpd:C00022","id":"99"},{"y":186,"x":316,"type":"enzyme","label":"ec:3.1.3.9","id":"72"},{"y":795,"x":289,"type":"enzyme","label":"ec:1.2.7.1","id":"125"},{"y":943,"x":487,"type":"enzyme","label":"ec:1.1.1.2","id":"44"},{"y":629,"x":483,"type":"enzyme","label":"ec:5.4.2.1","id":"55"},{"y":195,"x":601,"type":"compound","label":"cpd:C00031","id":"84"},{"y":133,"x":343,"type":"enzyme","label":"ec:2.7.1.41","id":"74"},{"y":520,"x":483,"type":"compound","label":"cpd:C00236","id":"95"},{"y":599,"x":306,"type":"map","label":"path:ec00710","id":"57"},{"y":196,"x":552,"type":"enzyme","label":"ec:2.7.1.69","id":"61"},{"y":385,"x":239,"type":"compound","label":"cpd:C06188","id":"108"},{"y":385,"x":132,"type":"compound","label":"cpd:C01451","id":"109"},{"y":303,"x":483,"type":"compound","label":"cpd:C05345","id":"92"},{"y":863,"x":265,"type":"compound","label":"cpd:C16255","id":"103"},{"y":448,"x":332,"type":"compound","label":"cpd:C00111","id":"89"},{"y":726,"x":204,"type":"enzyme","label":"ec:4.1.1.32","id":"113"},{"y":230,"x":483,"type":"compound","label":"cpd:C00668","id":"91"},{"y":218,"x":281,"type":"enzyme","label":"ec:2.7.1.63","id":"78"},{"y":359,"x":239,"type":"compound","label":"cpd:C06187","id":"107"},{"y":865,"x":319,"type":"enzyme","label":"ec:1.2.4.1","id":"48"},{"y":228,"x":181,"type":"compound","label":"cpd:C00267","id":"87"},{"y":736,"x":483,"type":"compound","label":"cpd:C00074","id":"93"},{"y":556,"x":483,"type":"enzyme","label":"ec:2.7.2.3","id":"77"},{"y":359,"x":132,"type":"compound","label":"cpd:C06186","id":"106"},{"y":911,"x":96,"type":"enzyme","label":"ec:6.2.1.1","id":"133"},{"y":291,"x":233,"type":"enzyme","label":"ec:2.7.1.1","id":"65"},{"y":544,"x":555,"type":"enzyme","label":"ec:1.2.1.9","id":"123"},{"y":864,"x":558,"type":"enzyme","label":"ec:1.1.1.27","id":"50"},{"y":964,"x":289,"type":"enzyme","label":"ec:1.2.1.5","id":"39"},{"y":302,"x":385,"type":"enzyme","label":"ec:5.3.1.9","id":"64"},{"y":820,"x":378,"type":"compound","label":"cpd:C00068","id":"138"},{"y":906,"x":314,"type":"compound","label":"cpd:C15972","id":"97"},{"y":736,"x":146,"type":"compound","label":"cpd:C00036","id":"114"},{"y":339,"x":656,"type":"map","label":"path:ec00030","id":"41"},{"y":450,"x":403,"type":"enzyme","label":"ec:5.3.1.1","id":"58"},{"y":974,"x":439,"type":"enzyme","label":"ec:1.1.2.8","id":"137"},{"y":386,"x":181,"type":"enzyme","label":"ec:2.7.1.69","id":"81"},{"y":770,"x":483,"type":"enzyme","label":"ec:2.7.1.40","id":"52"},{"y":336,"x":408,"type":"enzyme","label":"ec:3.1.3.11","id":"60"},{"y":484,"x":458,"type":"enzyme","label":"ec:1.2.1.12","id":"56"},{"y":863,"x":146,"type":"compound","label":"cpd:C00024","id":"101"},{"y":154,"x":343,"type":"enzyme","label":"ec:3.1.3.10","id":"73"},{"y":936,"x":439,"type":"enzyme","label":"ec:1.1.1.1","id":"45"},{"y":312,"x":233,"type":"enzyme","label":"ec:2.7.1.2","id":"66"},{"y":664,"x":483,"type":"compound","label":"cpd:C00631","id":"86"},{"y":908,"x":262,"type":"enzyme","label":"ec:1.8.1.4","id":"76"},{"y":265,"x":483,"type":"enzyme","label":"ec:5.3.1.9","id":"62"},{"y":701,"x":483,"type":"enzyme","label":"ec:4.2.1.11","id":"54"},{"y":264,"x":357,"type":"enzyme","label":"ec:5.3.1.9","id":"67"},{"y":239,"x":233,"type":"enzyme","label":"ec:2.7.1.2","id":"70"},{"y":264,"x":307,"type":"enzyme","label":"ec:5.1.3.15","id":"68"},{"y":312,"x":281,"type":"enzyme","label":"ec:2.7.1.147","id":"136"},{"y":955,"x":439,"type":"enzyme","label":"ec:1.1.2.7","id":"116"},{"y":301,"x":181,"type":"compound","label":"cpd:C00221","id":"88"},{"y":863,"x":378,"type":"compound","label":"cpd:C05125","id":"100"},{"y":359,"x":291,"type":"enzyme","label":"ec:3.2.1.86","id":"82"},{"y":484,"x":508,"type":"enzyme","label":"ec:1.2.1.59","id":"120"},{"y":336,"x":508,"type":"enzyme","label":"ec:2.7.1.146","id":"134"},{"y":953,"x":146,"type":"compound","label":"cpd:C00033","id":"40"},{"y":58,"x":166,"type":"map","label":"path:ec00010","id":"75"},{"y":385,"x":291,"type":"enzyme","label":"ec:3.2.1.86","id":"83"},{"y":239,"x":281,"type":"enzyme","label":"ec:2.7.1.147","id":"135"},{"y":336,"x":458,"type":"enzyme","label":"ec:2.7.1.11","id":"59"},{"y":264,"x":181,"type":"enzyme","label":"ec:5.1.3.3","id":"69"},{"y":865,"x":210,"type":"enzyme","label":"ec:2.3.1.12","id":"49"},{"y":906,"x":212,"type":"compound","label":"cpd:C15973","id":"104"},{"y":522,"x":438,"type":"enzyme","label":"ec:5.4.2.4","id":"131"},{"y":586,"x":437,"type":"enzyme","label":"ec:3.1.3.13","id":"130"},{"y":800,"x":64,"type":"map","label":"path:ec00020","id":"53"},{"y":525,"x":582,"type":"enzyme","label":"ec:1.2.7.6","id":"122"},{"y":291,"x":281,"type":"enzyme","label":"ec:2.7.1.63","id":"79"},{"y":76,"x":485,"type":"map","label":"path:ec00500","id":"42"},{"y":874,"x":431,"type":"enzyme","label":"ec:4.1.1.1","id":"46"},{"y":404,"x":483,"type":"enzyme","label":"ec:4.1.2.13","id":"13"},{"y":373,"x":483,"type":"compound","label":"cpd:C05378","id":"105"},{"y":863,"x":627,"type":"compound","label":"cpd:C00186","id":"96"},{"y":525,"x":532,"type":"enzyme","label":"ec:1.2.7.5","id":"126"},{"y":143,"x":483,"type":"compound","label":"cpd:C00103","id":"85"},{"y":592,"x":483,"type":"compound","label":"cpd:C00197","id":"94"},{"y":763,"x":384,"type":"map","label":"path:ec00620","id":"51"},{"y":853,"x":431,"type":"enzyme","label":"ec:1.2.4.1","id":"47"},{"y":911,"x":146,"type":"enzyme","label":"ec:6.2.1.13","id":"38"},{"y":953,"x":550,"type":"compound","label":"cpd:C00469","id":"98"},{"y":448,"x":483,"type":"compound","label":"cpd:C00118","id":"132"},{"y":943,"x":289,"type":"enzyme","label":"ec:1.2.1.3","id":"37"},{"y":747,"x":204,"type":"enzyme","label":"ec:4.1.1.49","id":"117"},{"y":912,"x":378,"type":"enzyme","label":"ec:4.1.1.1","id":"43"}]

};

})();
