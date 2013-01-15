requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:      { exports: '$' },
        d3:          { exports: 'd3' },
        underscore:  { exports: '_' },
        colorbrewer: { exports: 'colorbrewer'},
        backbone:    {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        },
        'backbone.localstorage': {
            exports: 'Backbone',
            deps: [ 'backbone' ]
        }
    },
})
require(['jquery', 'backbone', 'underscore', 'renderers/manhattan',
     'util/spin', 'util/dropdown'],
    function ($, Backbone, _, ManhattanPlot, Spinner, DropDown) {
  
    var MANHATTAN_HEIGHT = "300px";
    var PVALUE_THRESHOLD = 1;
    var MAX_GENES_PER_REQUEST = 100;
    
    function dataAPI(path) { return "/data" + path; }
    function addSpinner(el) {
        var opts = {
            lines: 13, // The number of lines to draw
            length: 5, // The length of each line
            width: 2, // The line thickness
            radius: 5, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 69, // The rotation offset
            color: '#666', // #rgb or #rrggbb
            speed: 1.3, // Rounds per second
            trail: 42, // Afterglow percentage
            className: 'spinner', // The CSS class to assign to the spinner
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        var spinner = new Spinner(opts).spin(el[0]);
    }

    var Trait = Backbone.Model.extend({
        defaults: { name: "", genome: "" },
        urlRoot: dataAPI("/trait"),
        parse: function (json) {
            this.name = json["trait"]["name"];
            this.genome = json["trait"]["id"].replace(/\.trait.*$/, '');
            return json;
        }
    });
        
    var BP2PX = 25e4;
    var vis;
    var $hud;

    function genomePixelWidth(contigs) {
        var genomeLength = 0;
        contigs.forEach(function (c) { genomeLength += c.len });
        return Math.floor(genomeLength / BP2PX);
    }

    function linkItem(href, title) {
        return $("<li>")
            .append($("<a>").attr("href", href).text(title));
    }

    function subviewBar() {
        return $("<div>").attr("id", "subviews").addClass("row");
    }
    
    function dismissSpinner($el) {
        $el.find(".spinner").fadeOut(function () { $(this).remove() });
    }
    
    var ManhattanView = Backbone.View.extend({
        el: $("#container"),
        events: {
            "click":     "clickEvent",
            "selection": "selectionEvent",
        },
        clickEvent: function () {},
        selectionEvent: function () {},
        initialize: function () {
            //Listeners
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.model.on('error', (this.errorHandler).bind(this));

            this.$el.css("position", "relative")

            // Prepare transitions
            $hud = $("#infoBox").css("min-height", "30px");
            $hud.on("click", function () { $hud.fadeOut() });
            this.$el.find("#manhattan-row-container").fadeTo(0, 0.3);
            $("#subviews").fadeTo(0, 0.3);
            this.$el.find(".alert").remove();
            addSpinner(this.$el);
        },
        render: function () {
            var self = this;
            var $el = self.$el;
            var model = self.model;
            if (model.get('variations').length == 0) {
                self.errorHandler(model, { status: '404' });
                return;
            }
            dismissSpinner($el);
            $el.find("#manhattan-row-container").remove();
            $el.find("#subviews").empty();
            var $rowContainer  = $("<div>").addClass("row")
                .attr("id", "manhattan-row-container");
            var $spanContainer = $("<div>").addClass("span12")
                .css("position", "relative")
                .outerHeight(MANHATTAN_HEIGHT);
            var $viewport = $("<div>")
                .addClass("viewport manhattan")
                .attr("data-title", "Manhattan Plot")
                .attr("id", "manhattan-vis");
            
            $el.append($rowContainer.append($spanContainer.append($viewport)));
            $viewport.outerHeight($spanContainer.height());
            $el.append(subviewBar());
            
            vis = new ManhattanPlot($viewport, {});
            vis.setData({
                variations: model.get('variations'),
                contigs:    model.get('contigs'),
                maxscore:   model.get('maxscore')
            });
            vis.render();
            $spanContainer.fadeIn();
            var genesXHR;
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                if (genesXHR) {
                    // If a prior query is in progress
                    genesXHR.abort();
                    genesXHR = null;
                }
                var tbody = $("<tbody>");
                $hud.empty();
                $hud.fadeIn();
                setInterval(function () {
                    if ($hud.is(":empty")) { addSpinner($hud); }
                }, 500);
                var pmin = Math.pow(10, -scoreA);
                var pmax = Math.pow(10, -scoreB);
                if (pmin > pmax) {
                    var tmp = pmin; pmin = pmax; pmax = tmp;
                }
                genesXHR = $.ajax({
                    url: dataAPI('/trait/' + self.model.id + '/genes'),
                    dataType: 'json',
                    data: {
                        pmin: pmin,
                        pmax: pmax,
                        locations: ranges
                    }
                })
                .done(function () {
                    self.handleGeneSelection.apply(self, arguments)
                });
            });
            vis.on("pinpoint", function () { $hud.fadeOut(); });
            return this;
        },
        errorHandler: function (model, error) {
            var text = '';
            if (error.status == '404') {
                text = JSON.parse(error.responseText).error;
            } else {
                var details = JSON.parse(error.responseText).error;
                text = $("<span>")
                    .append($("<h3>").text(error.statusText))
                    .append($("<pre>").css("font-size", "8pt").text([
                    "TECHNICAL DETAILS",
                    "=================",
                    "Status:  " + error.status,
                    "Message: " + details.message,
                    "Stack:   " + details.stack].join("\n")));
            }
            dismissSpinner(this.$el);
            this.$el.find("#manhattan-row-container").remove();
            this.$el.find("#subviews").remove();
            this.$el.append($("<div>")
                .addClass("alert alert-warning").html(text));
        },
        handleGeneSelection: function (genes, status, jqXhr) {
            var self = this;
            var $p = $("<p>")
                .css("text-align",  "center")
                .css("vertical-align", "middle")
                .css("font-weight", "bold")
                .css("min-height",  "30px");
            if (genes.length > 0) {
                $p.text(genes.length + " genes");
            } else {
                $p.text("No genes found");
            }
            var geneIDs =
                _.map(genes, function (g) { return g[0] });
            var geneRequests = [];
            for (var i = 0; i < geneIDs.length;
                i += MAX_GENES_PER_REQUEST) {
                geneRequests.push(
                    geneIDs.slice(i, i + MAX_GENES_PER_REQUEST));
            }
            dismissSpinner($hud);
            $hud.append($p);
            if (jqXhr.status == 206) {
                $hud.append($("<div>").addClass("alert mini").html(
                    "<h4>Warning!</h4> Not all genes are shown. The app can't handle more genes at this time. Please select a smaller window."
                ));
            }
            
            $("#subviews").empty();
            
            // Network
            $.ajax({
                url: dataAPI('/network/random'),
                dataType: 'json',
                data: { clusters: 2, nodes: 10 }
            }).done(function (json) { drawNetwork(json); });
            
            // Heatmap
            fetchGeneData({
                url: dataAPI('/coexpression'),
                genes: geneRequests
            }).done(function (json) {
                drawHeatmap({ rows: json.genes, matrix: json.matrix });
            });
            
            // Table
            $.when(
                fetchGeneData({
                    url: dataAPI('/genome/' +
                        self.model.genome + '/ontology'),
                    genes: geneRequests
                }),
                fetchGeneData({
                    url: dataAPI('/genes/functions'),
                    genes: geneRequests
                })
            ).done(function (ontology, functions) {
                var genes = [];
                for (var id in ontology.genes) {
                    for (var i in ontology.genes[id].terms) {
                        genes.push([
                            ontology.genes[id].name,
                            ontology.terms[i].term,
                            ontology.terms[i].ec,
                            ontology.terms[i].desc,
                            functions[id]
                        ]);
                    }
                }
                showTable(genes);
            })
            
            // Barchart
            fetchGeneData({
                url: dataAPI(
                    '/genome/' + self.model.genome + '/go-enrichment'),
                genes: geneRequests
            }).done(drawBarChart);
        }
    });
    
    function fetchGeneData(params) {
        var promises = [];
        function makeRequest(genes) {
            return $.ajax({
                url: params.url,
                dataType: 'json',
                data: { genes: genes.join(",") },
            });
        }
        for (var i = 0; i < params.genes.length; i++) {
            promises.push(makeRequest(params.genes[i]));
        }
        return $.when.apply($, promises).then(function () {
            var json;
            if (arguments.length == 0) {
                return null;
            }
            if (params.genes.length == 1) {
                // Single request, no merging necessary
                return arguments[0];
            }
            var args = _.map(arguments, function (arg) { return arg[0]; });
            if (_.isArray(args[0])) {
                json = [];
                args.forEach(function (arg) {
                    $.merge(json, arg);
                });
            } else {
                json = {};
                args.unshift(true, json);
                $.extend.apply($, args);
            }
            return json;
        });
    }
    
    var dropdowns = {
        genome: {
            name:       "Genomes",
            url:        dataAPI("/genome"),
            listeners:  ['experiment'],
        },     
        experiment: {
            name: "Experiments",
            url:  function () {
                return dataAPI("/genome/" + this.parentId + "/experiments")
            },
            listeners:  ['trait']
        },
        trait: {
            name: "Traits",
            url: function () {
                return dataAPI("/experiment/" + this.parentId + "/traits");
            }
        }
    };

    var dropDownFactory = new DropDown({
        container: "#g2pnav",
        template:  "#dropdownTemplate",
        parseItem: function (data, item) {
            item.id    = data[0];
            item.title = data[1];
        },
        itemLink: function (item) {
            return "#" + item.type + "/" + item.id;
        },
        sortBy: function (item) { return item.title.toLowerCase(); }
    });
    for (var type in dropdowns) {
        var dd = dropdowns[type];
        var select;
        dd.view = dropDownFactory.create({
            name:       dd.name,
            url:        dd.url,
            itemType:   type,
            itemSelect: function (item, $el) {
                $el.parents("li.dropdown")
                    .find("#copy").text(item.title);
            } 
        });
    }
    dropdowns.genome.view.fetch();
    var Router = Backbone.Router.extend({
        routes: {
            "trait/:traitId": "show",
            ":type/:id": "dropdownSelect",
        },
        dropdownSelect: function (type, id) {
            _.each(dropdowns[type].listeners, function (l) {
                dropdowns[l].view.fetch({ parentId: id });
            });
        },
        show: function (traitId) {
            var trait = new Trait;
            trait.set({id: decodeURIComponent(traitId)});
            var mview = new ManhattanView({ model: trait });
            trait.fetch({ data: { p: 30 } });
        }
    });
    var router = new Router;
    Backbone.history.start();
    
    function subviewDiv(id, title) {
        $("#subviews").append(
            $("<div>").addClass("span4").append(
                $("<div>").addClass("viewport")
                    .attr("id", id)
                    .attr('data-title', title)));
    }    
    
    function drawBarChart(data) {
        require(['charts/bar'], function (BarChart) {
            var chartData = [];
            var threshold = data.length < 30 ? PVALUE_THRESHOLD : PVALUE_THRESHOLD * 2;
            for (var i = 0; i < data.length; i++) {
                var normalized = -Math.log(data[i].pvalue) / Math.LN10;
                if (normalized >= threshold) {
                    chartData.push({
                        x: data[i].goID, y: normalized,
                        title: data[i].goDesc.join("\n")
                    });
                }
            }
            subviewDiv("go-histogram", "Gene Ontology Enrichment");
            var chart = new BarChart({ element: "#go-histogram", yTitle: "-log10 p" });
            chart.setData(chartData);
            chart.display();
        });
    }
    
    function drawPieChart(data) {
        require(['charts/pie'], function (PieChart) {
            var domains = {}, chartData = [];
            for (var i = 0; i < data.length; i++) {
                var domain = data[i].goDesc[1].replace('_', ' ');
                if (!domains.hasOwnProperty(domain)) {
                    domains[domain] = 0;
                }
                domains[domain]++;
            }
            for (var domain in domains) {
                chartData.push([domain, domains[domain]]);
            }
            subviewDiv("go-domains", "Gene Ontology Domains");
            var chart = new PieChart({ element: "#go-domains", categories: 3 });
            chart.setData(chartData);
            chart.display();
        })
    }

    function drawHeatmap(data) {
        require(['renderers/heatmap'], function (Heatmap) {
            subviewDiv("heatmap", "Expression Profile");
            var heatmap = new Heatmap("#heatmap");
            try {
                heatmap.setData(data);
                heatmap.render();
            } catch (e) {
                $("#heatmap").append($("<div>")
                    .addClass("text text-error")
                    .css("margin", "20px").html(
                        [e, "Try selecting a smaller window"].join("<br>")));
            }
        });
    }

    function showTable(data) {
        require(['renderers/table'], function (Table) {
            subviewDiv("gene-table", "Trait Genes");
            var table = new Table({element: "#gene-table", scrollY: 250});
            table.setData({
                data: data,
                columns: ['Name', 'GO Term', 'EC', 'Description', 'Function'],
                filter: ['EC']
            })
            table.display();
        })
    }
    
    function drawNetwork(data) {
        var nodes = data.nodes;
        var edges = data.edges;
        require(['renderers/network'], function (NetworkVis) {
            subviewDiv("network", "Gene Clusters");
            var network = new NetworkVis("#network", {
                hud: $("#subinfobox")
            });
            network.setNodes(nodes);
            network.setEdges(edges);
            network.render();
        })
    }
});
