requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        underscore: { exports: '_' },
        backbone:   {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        },
        'backbone.localStorage': {
            exports: 'Backbone',
            deps: [ 'backbone' ]
        }
    },
})
require(['jquery', 'backbone', 'underscore', 'renderers/manhattan', 'util/spin',
'util/dropdown'],
    function ($, Backbone, _, ManhattanPlot, Spinner, DropDown) {
  
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
        defaults: { name: "" },
        urlRoot: dataAPI("/trait"),
        parse: function (json) {
            this.name = json["trait"]["name"];
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
        return $("<div>")
            .attr("id", "subviews")
            .addClass("row")
            .height(400);
    }
    
    function dismissSpinner($el) {
        $el.find(".spinner").fadeOut(function () { $(this).remove() });
    }
    
    var ManhattanView = Backbone.View.extend({
        initialize: function () {
            //Listeners
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.model.on('error', (this.errorHandler).bind(this));

            this.$el.css("position", "relative")

            // Prepare transitions
            $hud = $("#infoBox").css("min-height", "30px");
            $hud.on("click", function () { $hud.fadeOut() });
            this.$el.find(".manhattan").fadeTo(0, 0.3);
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
            $el.find(".manhattan").remove();
            $el.find("#subviews").remove();
            var $newVis = $("<div>")
                .addClass("manhattan")
                .css("min-width",
                    Math.min($el.width()-80,
                        genomePixelWidth(self.model.get('contigs'))))
                .outerHeight(MANHATTAN_HEIGHT);
            var $title = $("<div>")
                    .append($("<h4>").text(model.name));
            $newVis.append($title);
            var $visElement = $("<div>")
                .css("width", "100%");
            $newVis.append($visElement);
            $el.append($newVis);
            $visElement.outerHeight(
                $newVis.outerHeight(true) -
                $title.outerHeight(true)
            );
            $el.append(subviewBar());
            
            vis = new ManhattanPlot($visElement, {});
            vis.setData({
                variations: model.get('variations'),
                contigs:    model.get('contigs'),
                maxscore:   model.get('maxscore')
            });
            vis.render();
            $newVis.fadeIn();
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
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
                $.ajax({
                    url: dataAPI('/trait/' + self.model.id + '/genes'),
                    dataType: 'json',
                    data: {
                        pmin: pmin,
                        pmax: pmax,
                        locations: ranges
                    },
                    success: function (genes) {
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
                        dismissSpinner($hud);
                        $hud.append($p);
                        $.ajax({
                            url: dataAPI('/coexpression'),
                            dataType: 'json',
                            data: { genes: genes },
                            success: function (coexpression) {
                                drawHeatmap({ rows: genes, matrix: coexpression });
                            }
                        })
                    }
                })
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
            this.$el.find(".manhattan").remove();
            this.$el.find("#subviews").remove();
            this.$el.append($("<div>")
                .addClass("alert alert-warning").html(text));
        }
    });    

    var Router = Backbone.Router.extend({
        routes: {
            "trait/:traitId": "show",
        },
        show: function (traitId) {
            var trait = new Trait;
            trait.set({id: decodeURIComponent(traitId)});
            var mview = new ManhattanView({ model: trait, el: $("#container") });
            trait.fetch({ data: { p: 30 } });
        }
    });
    var router = new Router;
    Backbone.history.start();

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
    var dropdowns = {};
    dropdowns.genomes = dropDownFactory.create({
        name:       "Genomes",
        url:        dataAPI("/genome"),
        itemType:   'genome',
        itemSelect: function (item) {
            dropdowns.experiments.fetch({ genomeId: item.id });
        }
    });
    dropdowns.experiments = dropDownFactory.create({
        name: "Experiments",
        url:  function () {
            return dataAPI("/genome/" + this.genomeId + "/experiments")
        },
        itemType: 'experiment',
        itemSelect: function (item) {
            dropdowns.traits.fetch({ experimentId: item.id });
        }
    });
    dropdowns.traits = dropDownFactory.create({
        name: "Traits",
        url: function () {
            return dataAPI("/experiment/" + this.experimentId + "/traits");
        },
        itemType: 'trait'
    });
    dropdowns.genomes.fetch();
    
    function drawHeatmap(data) {
        require(['renderers/heatmap'], function (Heatmap) {
            $("#subviews").find("#heatmap").remove();
            $("#subviews").append($("<div>")
                .attr("id", "heatmap")
                .addClass("subview")
                .addClass("span4")
                .css("min-height", "300px"));
            var heatmap = new Heatmap("#heatmap");
            try {
                heatmap.setData(data);
                heatmap.render();
            } catch (e) {
                $("#heatmap").append($("<div>")
                    .addClass("alert alert-error")
                    .css("margin", "20px").html([e, "Try selecting a smaller window"].join("<br>")));
            }
        });
    }
});
