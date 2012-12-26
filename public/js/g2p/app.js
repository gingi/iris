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
require(['jquery', 'backbone', 'underscore', 'g2p/manhattan', 'util/spin'],
    function ($, Backbone, _, ManhattanPlot, Spinner) {
        
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
    });
    
    var Model = Backbone.Model.extend({
        defaults: { name: "", itemType: "" },
        url: function () { return dataAPI(this.path()); },
        parse: function (json) {
            this.set('items', json);
        }
    });
    
    var cache = {};
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
        var experiment = cache["experiment"];
        var items = experiment ? experiment.get('items') : [];
        for (var i in items) {
            if (items[i][0] == trait.id) {
                return items[i][1];
            }
        }
        return trait.id;
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
    function genomePixelWidth(chromosomes) {
        var genomeLength = 0;
        chromosomes.forEach(function (c) { genomeLength += c.len });
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
    
    function dismissSpinner($el) {
        $el.find(".spinnerContainer").fadeOut(function () { $(this).remove() });
    }
    
    var ManhattanView = Backbone.View.extend({
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
            this.model.on('error', (this.errorHandler).bind(this));
            this.$el.css("position", "relative")
            $hud = $("#infoBox");
            this.$el.find(".manhattan").fadeTo(0, 0.3);
            this.$el.find(".spinnerContainer").remove();
            this.$el.find(".alert").remove();
            var div = $("<div>")
                .attr("class", "spinnerContainer")
                .css("width", this.$el.width()-80)
                .css("height", "400px")
                .css("position", "absolute");
            this.$el.append(div);
            addSpinner(div);
        },
        render: function () {
            var self = this;
            var $el = self.$el;
            dismissSpinner($el);
            var $oldVis = $el.find(".manhattan");
            var $newVis = $("<div>")
                .attr("class", "manhattan")
                .css("min-width",
                    Math.min($el.width()-80,
                        genomePixelWidth(self.model.get('chromosomes'))))
                .css("min-height", "400px")
                .css("position", "absolute");
            $newVis.append($("<h4>").text(traitName(this.model)));
            $el.append($newVis);
            
            vis = new ManhattanPlot($newVis);
            vis.setData({
                variations:  this.model.get('variations'),
                chromosomes: this.model.get('chromosomes'),
                maxscore:    this.model.get('maxscore')
            });
            vis.display();
            if ($oldVis.length > 0) {
                $oldVis.fadeOut(function () {
                    $newVis.fadeIn();
                    $oldVis.remove();
                 });
            } else {
                $newVis.fadeIn();
            }
            vis.on("selection", function (evt, scoreA, scoreB, ranges) {
                var tbody = $("<tbody>");
                $hud.empty();
                $hud.append($("<table>").append(tbody));
                row(tbody, "-log(p)<sub><i>max</i></sub>", scoreA.toFixed(2));
                row(tbody, "-log(p)<sub><i>min</i></sub>", scoreB.toFixed(2));
                $.ajax({
                    url: dataAPI('/trait/' + self.model.id + '/genes'),
                    dataType: 'json',
                    data: {
                        pmin: Math.pow(10, -scoreA),
                        pmax: Math.pow(10, -scoreB),
                        locations: ranges
                    },
                    success: function (json) {
                        row(tbody, "genes", json.length);
                        $hud.fadeIn();
                    }
                })
            });
            vis.on("pinpoint", function () { $hud.fadeOut(); });
            return this;
        },
        errorHandler: function (model, error) {
            var text = '';
            if (error.status == '404') {
                text = 'No variations for trait "' + model.id + '"';
            } else {
                text = $("<pre>").text(JSON.stringify(error.responseText));
            }
            dismissSpinner(this.$el);
            this.$el.find(".manhattan").remove();
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
            cache[type] = model;
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
});
