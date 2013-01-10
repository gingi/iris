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
require(['jquery', 'backbone', 'underscore', 'renderers/manhattan', 'util/spin',
'util/dropdown', 'util/eventemitter'],
    function ($, Backbone, _, ManhattanPlot, Spinner, DropDown, EventEmitter) {
  
    var MANHATTAN_HEIGHT = "300px";
    
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
                // .css("min-width",
                //     Math.min($el.width()-80,
                //         genomePixelWidth(self.model.get('contigs'))))
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
                .done(function (genes) {
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
                    var sourceGenes = _.map(genes, function (g) { return g[1] });
                    dismissSpinner($hud);
                    $hud.append($p);
                    $("#subviews").empty();
                    // addSpinner($("#subviews"));
                    $.ajax({
                        url: dataAPI('/coexpression'),
                        dataType: 'json',
                        data: { genes: sourceGenes },
                        success: function (coexpression) {
                            drawHeatmap({ rows: genes, matrix: coexpression });
                        }
                    });
                    $.ajax({
                        url: dataAPI('/genome/' + self.model.genome + '/ontology'),
                        dataType: 'json',
                        data: { genes: sourceGenes },
                        success: function (data) {
                            var genes = [];
                            for (var gene in data.genes) {
                                var terms = [], ecs = [], descs = [];
                                for (var i in data.genes[gene]) {
                                    // terms.push(data.terms[i].term);
                                    // ecs.push(data.terms[i].ec);
                                    // descs.push(data.terms[i].desc);
                                    genes.push([
                                        gene,
                                        data.terms[i].term,
                                        data.terms[i].ec,
                                        data.terms[i].desc,
                                    ]);
                                        
                                }
                                // genes.push([gene,
                                //     terms.join("<br/>"),
                                //     ecs.join("<br/>"),
                                //     descs.join("<br/>")
                                // ]);
                            }
                            showTable(genes);
                        }
                    })
                    $.ajax({
                        url: dataAPI('/genome/' + self.model.genome + '/go-enrichment'),
                        dataType: 'json',
                        data: { genes: sourceGenes },
                        success: function (ontology) {
                            drawBarChart(ontology);
                        }
                    })
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
        }
    });
    
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
        }
    });
    for (var type in dropdowns) {
        var dd = dropdowns[type];
        var select;
        dd.view = dropDownFactory.create({
            name:       dd.name,
            url:        dd.url,
            itemType:   type,
            itemSelect: function (item, $el) {
                $el.parents("li.dropdown").find("#copy").text(item.title);
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
            for (var i = 0; i < data.length; i++) {
                chartData.push({
                    x: data[i].goID, y: data[i].pvalue,
                    title: data[i].goDesc.join("\n")
                });
            }
            subviewDiv("go-histogram", "Gene Ontology Enrichment");
            var chart = new BarChart("#go-histogram", { yTitle: "P value" });
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
            var chart = new PieChart("#go-domains", { categories: 3 });
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
                    .css("margin", "20px").html([e, "Try selecting a smaller window"].join("<br>")));
            }
        });
    }
    
    function showTable(data) {
        require(['renderers/table'], function (Table) {
            subviewDiv("gene-table", "Trait Genes");
            var table = new Table({element: "#gene-table", scrollY: 250});
            table.setData({
                data: data,
                columns: ['Name', 'GO Term', 'EC', 'Description']
            })
            table.display();
        })
    }
});
