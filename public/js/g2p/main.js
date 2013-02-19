require([
    'jquery',
    'backbone',
    'underscore',
    'renderers/manhattan',
    'util/progress',
    'util/viewport',
    'util/hud',
    'g2p/dropdowns',
    'g2p/blurb'],
    function (
        $, Backbone, _, ManhattanPlot, Progress, Viewport, HUD, DropDowns, Blurb
    ) {
  
    function dataAPI(path) { return "/data" + path; }

    var MANHATTAN_HEIGHT = "300px";
    var PVALUE_THRESHOLD = 1;
    var MAX_GENES_PER_REQUEST = 100;
    var BP2PX = 25e4;
    
    var genesXHR;
    var hud;
    var dropdowns = new DropDowns(dataAPI);
    var router;

    // Vent: Event Aggregator
    var Vent = _.extend({}, Backbone.Events);

    // Models
    var Trait = Backbone.Model.extend({
        defaults: { name: "", genome: "" },
        urlRoot: dataAPI("/trait"),
        parse: function (json) {
            if (json["trait"]) {
                this.name = json["trait"]["name"];
                this.genome = json["trait"]["id"].replace(/\.trait.*$/, '');
                this.experiment = this.parentId = json["trait"]["experiment"];
            }
            return json;
        }
    });
    var SubViewModel = Backbone.Model.extend({
        parse: function (data) { this.set(data); }
    });
    var Network = SubViewModel.extend({
        url: dataAPI('/network/internal')
    });
    
    var ExpressionProfile = SubViewModel.extend({
        defaults: {
            terms: "PO:0009005,PO:0009006,PO:0009010,PO:0009025,PO:0005352",
        },
        url: function () {
            var url = dataAPI("/query/expression");
            return url;
        },
        parse: function (json) {
            if (!json || !json.data) return;
            var matrix = [];
            var columns = [];
            var maxScore = 0;
            json.data.forEach(function (values, i) {
                for (var j = 0; j < values.length; j++) {
                    var val = parseFloat(values[j]);
                    matrix.push([i, j, val]);
                    maxScore = Math.max(val, maxScore);
                }
            });
            SubViewModel.prototype.parse.call(this, {
                rows:     _.pluck(json.genes, "name"),
                columns:  _.pluck(json.terms, "name"),
                matrix:   matrix,
                maxScore: maxScore
            });
        }
    });
    var GeneFunctions = SubViewModel.extend({
        url: function () {
            return dataAPI('/query/gene-function');
        },
        parse: function (data) {
            var genes = [];
            for (var id in data.genes) {
                for (var i in data.genes[id].terms) {
                    genes.push([
                        data.genes[id].name,
                        data.terms[i].term,
                        data.terms[i].ec,
                        data.terms[i].desc,
                        data.genes[id].function
                    ]);
                }
            }
            SubViewModel.prototype.parse.call(this, {
                data: genes,
                columns: ['Name', 'GO Term', 'EC', 'Description', 'Function'],
                filter: ['EC']
            });
        },
    });
    var GOEnrichment = SubViewModel.extend({
        url: function () {
            return dataAPI('/query/go-enrichment');
        },
        parse: function (data) {
            var filtered = [];
            var threshold = data.length < 50 
                ? PVALUE_THRESHOLD : PVALUE_THRESHOLD * 2;
            for (var i = 0; i < data.length; i++) {
                var normalized = -Math.log(data[i].pvalue) / Math.LN10;
                if (normalized >= threshold) {
                    filtered.push({
                        x: data[i].goID,
                        y: normalized,
                        title: data[i].goDesc.join("\n")
                    });
                }
            }
            SubViewModel.prototype.parse.call(this, filtered);
        },
    });
    
    var SubView = Backbone.View.extend({
        defaults: {
            require:      '',
            title:        'Blank',
            elementId:    '',
            renderParams: {},
            fetchParams:  {}
        },
        initialize: function (params) {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            Vent.on('genes', this.fetchModel, this);
            var wrapper = $("<div>").addClass("span4");
            $("#subviews").append(wrapper);
            this.viewport = new Viewport({
                parent: wrapper,
                height: 400,
                title: this.options.title,
                id: this.options.elementId,
                sortContainer: $("#subviews")
            });
            this.progress = new Progress({ element: this.viewport });
            this.progress.show();
        },
        render: function() {
            var self = this;
            require([self.options.require], function(Chart) {
                self.progress.dismiss();
                var chart = new Chart(_.extend({
                    element: self.viewport
                }, self.options.renderParams));
                chart.setData(self.model.toJSON());
                chart.render();
            })
        },
        fetchModel: function (genes) {
            var self = this;
            var data = { genes: genes };
            for (var prop in this.options.fetchParams) {
                data[prop] = this.options.fetchParams[prop];
            }
            if (typeof this.options.beforeFetch === 'function') {
                this.options.beforeFetch.call(self.model, data);
            }
            this.model.fetch({
                data: data,
                error: function (model, response) {
                    var message = $("<span>")
                        .text("Uhoh! Got bad vibes from the server")
                        .append($("<pre>")
                            .append("The dirty details: ")
                            .append(response.responseText)).html();
                    self.viewport.showError({ message: message });
                }
            });
        }
    });
    
    var ManhattanView = Backbone.View.extend({
        el: $("#datavis"),
        makeRowDiv: function (id) {
            var $div = this.$el.find("#" + id);
            if (!$div.length) {
                $div = $("<div>").attr("id", id);
                this.$el.append($div);
            }
            if (!$div.hasClass('row')) $div.addClass("row");
            return $div;
        },
        initialize: function () {
            //Listeners
            _.bindAll(this, 'render');
            Vent.bind("selection", this.createSubViews, this);
            this.model.on('change', this.render);
            this.model.on('error', this.errorHandler, this);

            this.$el.css("position", "relative")

            // Prepare transitions
            hud = new HUD({
                position: { top: 100, right: 20 },
                element: "#datavis",
                title: "Selection",
                width: 200
            });
            hud.progress = new Progress({ element: hud, fade: false });
            this.manhattanContainer =
                this.makeRowDiv("manhattan-row-container");
            this.subviewBar = this.makeRowDiv("subviews");
            this.$el.find(".alert").remove();
            this.progress = new Progress({ element: this.manhattanContainer });
            this.progress.show();
        },
        render: function () {
            var self = this;
            var $el = self.$el;
            var model = self.model;
            if (!model.get('variations') ||
                model.get('variations').length == 0) {
                self.errorHandler(model, { status: '404' });
                return;
            }
            self.progress.dismiss();
            self.manhattanContainer.empty();
            self.subviewBar.empty();
            var $spanContainer = $("<div>").addClass("span12")
                .css("position", "relative");
            self.manhattanContainer.append($spanContainer);
            var viewport = new Viewport({
                parent: $spanContainer,
                height: MANHATTAN_HEIGHT,
                id: "manhattan-vis",
                title: "Manhattan Plot"
            }).addClass("manhattan");
            
            var vis = new ManhattanPlot({ element: viewport });
            vis.setData({
                variations: model.get('variations'),
                contigs:    model.get('contigs'),
                maxscore:   model.get('maxscore')
            });
            vis.render();
            $spanContainer.fadeIn();
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                Vent.trigger("selection", [scoreA, scoreB, ranges]);
                if (genesXHR) {
                    // If a prior query is in progress
                    genesXHR.abort();
                    hud.empty();
                }
                var tbody = $("<tbody>");
                hud.empty();
                hud.show();
                setInterval(function () {
                    if (hud.is(":empty")) { hud.progress.show(); }
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
            vis.on("pinpoint", function () { });
            return this;
        },
        errorHandler: function (model, error) {
            var text = '';
            if (error.status == '404') {
                text = error.responseText ? 
                    JSON.parse(error.responseText).error : "Not found"
            } else {
                var details;
                try {
                    details = JSON.parse(error.responseText).error;
                } catch (err) {
                    details = error.responseText;
                }
                text = $("<span>")
                    .append($("<h3>").text("Unexpected Error"))
                    .append($("<p>").html("Our apologies. Please " +
                        "<a href=\"mailto:shiran@cshl.edu\">contact us</a> " +
                        "with the following details if this problem persists."
                    ))
                    .append($("<pre>").css("font-size", "8pt").text([
                        "TECHNICAL DETAILS",
                        "=================",
                        "Status:  " +
                            error.statusText + " (" + error.status + ")",
                        "Error:   " + details
                    ].join("\n")));
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
            $p.text(genes.length > 0
                ? genes.length + " genes" : "No genes found");
            var geneIDs = _.map(genes, function (g) { return g[0] });
            // var geneRequests = [];
            // for (var i = 0; i < geneIDs.length;
            //     i += MAX_GENES_PER_REQUEST) {
            //     geneRequests.push(geneIDs.slice(i, i + MAX_GENES_PER_REQUEST));
            // }
            hud.progress.dismiss();
            hud.append($p);
            if (jqXhr.status == 206) {
                hud.append($("<div>").addClass("alert mini").html(
                    "<h3>Warning!</h3><p>Not all genes are shown. " +
                    "The app can't handle more genes at this time. " +
                    "Please select a smaller window.</p>"
                ));
            }
            
            Vent.trigger("genes", geneIDs.join(","));
        },
        createSubViews: function () {
            this.subviewBar.empty();
            var genome = this.model.genome;
            var network = new Network;
            var networkView = new SubView({
                model: network,
                require: 'renderers/network',
                elementId: 'network',
                title: 'Gene Clusters',
                renderParams: {
                    hud: $("#subinfobox"),
                    dock: false
                },
                beforeFetch: function (data) {
                    data.nodes = data.genes;
                    delete data.genes;
                },
            });
            
            var expressionModel = new ExpressionProfile;
            var expView = new SubView({
                model: expressionModel,
                require: 'renderers/heatmap',
                elementId: 'heatmap',
                title: 'Expression Profile',
                fetchParams: { terms: expressionModel.get('terms') }
            });

            var funcView = new SubView({
                model: new GeneFunctions,
                require: 'renderers/table',
                elementId: "gene-table",
                title: "Trait Genes",
                renderParams: { scrollY: 250 }
            });

            var barchart = new SubView({
                model: new GOEnrichment,
                require: 'charts/bar',
                elementId: "go-histogram",
                title: "Gene Ontology Enrichment",
                renderParams: { yTitle: "-log10 p" }
            });
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
    
    var Router = Backbone.Router.extend({
        routes: {
            "trait/:traitId": "show",
            ":type/:id":      "dropdownSelect",
            "*action":        "default"
        },
        dropdownSelect: function (type, id) {
            dropdowns.listen(type, id);
            dropdowns.select(type, id);
        },
        show: function (traitId) {
            $("#datavis").empty();
            var trait = new Trait;
            trait.set({id: decodeURIComponent(traitId)});
            var mview = new ManhattanView({ model: trait });
            trait.fetch({
                data: { p: 30 },
                success: function (t) {
                    dropdowns.update('trait', traitId, t.parentId);
                    dropdowns.select('trait', traitId);
                }
            });
        },
        default: function () {
            $("#datavis").empty();
            new Blurb($("#datavis"), router);
        }
    });
   
    router = new Router;
    Backbone.history.start();
});