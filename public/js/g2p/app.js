requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        underscore: { exports: '_' },
        backbone:   {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        }
    },
})
require(['jquery', 'backbone', 'underscore', 'renderers/manhattan', 'util/spin'],
    function ($, Backbone, _, ManhattanPlot, Spinner) {
    
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
    
    var Model = Backbone.Model.extend({
        defaults: { name: "", itemType: "" },
        url: function () { return dataAPI(this.path()); },
        parse: function (json) {
            this.set('items', json);
        }
    });
    
    var ModelCache = {};
    var Types = {};
    
    Types.root = Model.extend({
        el: $("#genome-select"),
        path: function () { return "/genome" },
        initialize: function () {
            this.set('itemType', 'genome');
        }
    });
    Types.genome = Model.extend({
        el: $("#exp-select"),
        path: function () {
            return "/genome/" + this.id + "/experiments";
        },
        initialize: function () {
            this.set('itemType', 'experiment');
        }
    });
    
    Types.experiment = Model.extend({
        el: $("#trait-select"),
        path: function () {
            return "/experiment/" + this.id + "/traits";
        },
        initialize: function () {
            this.set('itemType', 'trait');
        }
    });
    
    function traitName(trait) {
        return trait.name;
    };
    
    var BP2PX = 2.5e5;
    var vis;
    var $hud;
    function row(tb, key, val) {
        if (!val) return;
        tb.append($("<tr>")
            .append($("<th>").html(key))
            .append($("<td>").html(val))
        );
    }
    function genomePixelWidth(contigs) {
        var genomeLength = 0;
        contigs.forEach(function (c) { genomeLength += c.len });
        return Math.floor(genomeLength / BP2PX);
    }
    
    function linkItem(href, title) {
        return $("<li>")
            .append($("<a>").attr("href", href).text(title));
    }
    
    var DropDownMenu = Backbone.View.extend({
        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            addSpinner(this.$el.parent());
            this.$el.parent().fadeTo(1, 0.2);
        },
        render: function (evt) {
            var $el = this.$el;
            $el.parent().fadeTo(1, 1, function () {
                $(this).find(".spinner").remove();
            });
            var model = this.model;
            $el.empty();
            var items = model.get('items');
            if (items.length == 0) {
                $el.append($("<li>")
                    .css("padding", "5px")
                    .addClass("text-warning")
                    .text('No ' + model.get('itemType') + 's'));
            } else {
                items.forEach(function (i) {
                    $el.append(linkItem(
                        "#" + model.get('itemType') + "/" + i[0], i[1]
                    ));
                });
            }
        }
    });
    
    function subviewBar() {
        return $("<div>")
            .attr("id", "subviews")
            .addClass("row")
            .height(400);
    }
    
    function dismissSpinner($el) {
        $el.find(".spinnerContainer").fadeOut(function () { $(this).remove() });
    }
    
    var ManhattanView = Backbone.View.extend({
        initialize: function () {
            //Listeners
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.model.on('error', (this.errorHandler).bind(this));

            this.$el.css("position", "relative")

            // Prepare transitions
            $hud = $("#infoBox");
            $hud.on("click", function () { $hud.fadeOut() });
            this.$el.find(".manhattan").fadeTo(0, 0.3);
            $("#subviews").fadeTo(0, 0.3);
            this.$el.find(".spinnerContainer").remove();
            this.$el.find(".alert").remove();
            var div = $("<div>")
                .attr("class", "spinnerContainer")
                .css("width", this.$el.width()-80)
                .css("height", MANHATTAN_HEIGHT)
                .css("position", "absolute");
            this.$el.append(div);
            addSpinner(div);
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
            
            vis = new ManhattanPlot($visElement);
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
                $hud.append($("<table>").append(tbody));
                $.ajax({
                    url: dataAPI('/trait/' + self.model.id + '/genes'),
                    dataType: 'json',
                    data: {
                        pmin: Math.pow(10, -scoreA),
                        pmax: Math.pow(10, -scoreB),
                        locations: ranges
                    },
                    success: function (genes) {
                        if (genes.length > 0) {
                            row(tbody, "genes", genes.length);
                        } else {
                            $hud.append($("<p>")
                                .css("text-align", "center")
                                .css("font-weight", "bold")
                                .text("No genes found"));
                        }
                        $hud.fadeIn();
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
                text = 'No variations for trait "' + model.name + '"';
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
            ":type/:id": "dropdownSelect",
        },
        dropdownSelect: function (type, id) {
            var model = new Types[type];
            model.set({id: decodeURIComponent(id)});
            ModelCache[type] = model;
            var view = new DropDownMenu({ model: model, el: model.el });
            model.fetch();
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
    var rootModel = new Types.root;
    new DropDownMenu({ model: rootModel, el: rootModel.el });
    rootModel.fetch();
    
    
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
