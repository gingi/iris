require(['jquery', 'backbone', 'underscore', 'renderers/manhattan',
     'util/progress', 'g2p/dropdowns'],
    function ($, Backbone, _, ManhattanPlot, Progress, DropDowns) {
  
    var MANHATTAN_HEIGHT = "300px";
    var PVALUE_THRESHOLD = 1;
    var MAX_GENES_PER_REQUEST = 100;
    var BP2PX = 25e4;
    
    var genesXHR;
    var $hud;
    
    function dataAPI(path) { return "/data" + path; }

    var Trait = Backbone.Model.extend({
        defaults: { name: "", genome: "" },
        urlRoot: dataAPI("/trait"),
        parse: function (json) {
            this.name = json["trait"]["name"];
            this.genome = json["trait"]["id"].replace(/\.trait.*$/, '');
            this.experiment = this.parentId = json["trait"]["experiment"];
            return json;
        }
    });
        
    function genomePixelWidth(contigs) {
        var genomeLength = 0;
        contigs.forEach(function (c) { genomeLength += c.len });
        return Math.floor(genomeLength / BP2PX);
    }

    function linkItem(href, title) {
        return $("<li>")
            .append($("<a>").attr("href", href).text(title));
    }
    
    var ManhattanView = Backbone.View.extend({
        el: $("#container"),
        events: {
            "click":     "clickEvent",
            "selection": "selectionEvent",
        },
        makeRowDiv: function (id) {
            var $div = this.$el.find("#" + id);
            if (!$div.length) {
                $div = $("<div>").attr("id", id);
                this.$el.append($div);
            }
            if (!$div.hasClass('row')) $div.addClass("row");
            return $div;
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
            $hud.fadeOut(function () { $hud.empty(); });
            $hud.progress = new Progress({ element: $hud, fade: false });
            this.manhattanContainer =
                this.makeRowDiv("manhattan-row-container");
            this.subviewBar = this.makeRowDiv("subviews");
            this.$el.find(".alert").remove();
            this.progress = new Progress({
                element: this.manhattanContainer
            });
            this.progress.show();
        },
        render: function () {
            var self = this;
            var $el = self.$el;
            var model = self.model;
            if (model.get('variations').length == 0) {
                self.errorHandler(model, { status: '404' });
                return;
            }
            self.progress.dismiss();
            self.manhattanContainer.empty();
            self.subviewBar.empty();
            var $spanContainer = $("<div>").addClass("span12")
                .css("position", "relative")
                .outerHeight(MANHATTAN_HEIGHT);
            var $viewport = $("<div>")
                .addClass("viewport manhattan")
                .attr("data-title", "Manhattan Plot")
                .attr("id", "manhattan-vis");
            
            self.manhattanContainer.append($spanContainer.append($viewport));
            $viewport.outerHeight($spanContainer.height());
            
            var vis = new ManhattanPlot($viewport, {});
            vis.setData({
                variations: model.get('variations'),
                contigs:    model.get('contigs'),
                maxscore:   model.get('maxscore')
            });
            vis.render();
            $spanContainer.fadeIn();
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                if (genesXHR) {
                    // If a prior query is in progress
                    genesXHR.abort();
                    $hud.empty();
                    self.subviewBar.empty();
                }
                var tbody = $("<tbody>");
                $hud.empty();
                $hud.fadeIn();
                setInterval(function () {
                    if ($hud.is(":empty")) { $hud.progress.show(); }
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
            this.progress.dismiss();
            this.manhattanContainer.empty();
            this.subviewBar.empty();
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
                geneRequests.push(geneIDs.slice(i, i + MAX_GENES_PER_REQUEST));
            }
            $hud.progress.dismiss();
            $hud.append($p);
            if (jqXhr.status == 206) {
                $hud.append($("<div>").addClass("alert mini").html(
                    "<h4>Warning!</h4> Not all genes are shown. " +
                    "The app can't handle more genes at this time. " +
                    "Please select a smaller window."
                ));
            }
            
            this.subviewBar.empty();

            var networkModel = new (Backbone.Model.extend({
                url: dataAPI('/network/random')
            }));
            var networkView = new SubView({
                model: networkModel,
                require: 'renderers/network',
                elementId: 'network',
                title: 'Gene Clusters',
                renderParams: {
                    hud: $("#subinfobox")
                }
            });
            networkModel.fetch({ data: { clusters: 2, nodes: 10 } });
            
            var coexpModel = new (Backbone.Model.extend({
                url: dataAPI('/coexpression'),
                parse: function (data) {
                    return {
                        rows:   data.genes,
                        matrix: data.matrix
                    };
                }
            }));
            var coexpView = new SubView({
                model: coexpModel,
                require: 'renderers/heatmap',
                elementId: 'heatmap',
                title: 'Expression Profile'
            });
            coexpModel.fetch({ data: { genes: geneIDs.join(',') } });

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
                if (!ontology) return;
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

            var geneEnrich = new (Backbone.Model.extend({
                url: function () {
                    var url =
                        dataAPI('/genome/' + this.genomeId + '/go-enrichment');
                    return url;
                },
                parse: function (data) { return data; }
            }));
            geneEnrich.genomeId = self.model.genome;
            
            var barchart = new SubView({
                require: 'charts/bar',
                elementId: "go-histogram",
                title: "Gene Ontology Enrichment",
                renderParams: { yTitle: "-log10 p" },
                model: geneEnrich
            });
            geneEnrich.fetch({ data: { genes: geneIDs.join(",") } });
            
            /*
            // Barchart
            fetchGeneData({
                url: dataAPI('/genome/' + self.model.genome + '/go-enrichment'),
                genes: geneRequests
            }).done(drawBarChart);
            */
        }
    });
    
    var SubView = Backbone.View.extend({
        defaults: {
            require: '',
            title: 'Blank',
            elementId: '',
            renderParams: {},
        },
        initialize: function (params) {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
        },
        render: function() {
            var self = this;
            require([self.options.require], function(Chart) {
                subviewDiv(self.options.elementId, self.options.title);
                var chart = new Chart(_.extend({
                    element: "#" + self.options.elementId
                }, self.options.renderParams));
                console.log(self.model.toJSON());
                chart.setData(self.model.toJSON());
                chart.display();
            })
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
    
    var dropdowns = new DropDowns(dataAPI);

    var Router = Backbone.Router.extend({
        routes: {
            "trait/:traitId": "show",
            ":type/:id": "dropdownSelect",
        },
        dropdownSelect: function (type, id) {
            dropdowns.listen(type, id);
        },
        show: function (traitId) {
            var trait = new Trait;
            trait.set({id: decodeURIComponent(traitId)});
            var mview = new ManhattanView({ model: trait });
            trait.fetch({
                data: { p: 30 },
                success: function (t) {
                    dropdowns.update('trait', traitId, t.parentId);
                }
            });
            dropdowns.select('trait', traitId);
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
        if (!data) return;
        require(['charts/bar'], function (BarChart) {
            var chartData = [];
            var threshold = data.length < 30 
                ? PVALUE_THRESHOLD : PVALUE_THRESHOLD * 2;
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
            var chart = new BarChart({
                element: "#go-histogram", yTitle: "-log10 p"
            });
            chart.setData(chartData);
            chart.display();
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
});
