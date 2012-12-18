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
require(['jquery', 'backbone', 'underscore', 'g2p/manhattan'],
    function ($, Backbone, _, ManhattanPlot) {
    var Trait = Backbone.Model.extend({
        defaults: { name: "" },
        urlRoot: "/data/trait",
    });
    
    var vis;
    var AppView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
        },
        render: function () {
            $("#datavis").empty();
            vis = new ManhattanPlot("#datavis");
            vis.setData({
                variations:  this.model.get('variations'),
                chromosomes: this.model.get('chromosomes'),
                maxscore:    this.model.get('maxscore')
            });
            vis.display();
            return this;
        },
    });    

    var App;
    
    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "show"
        },
        show: function (traitId) {
            var trait = new Trait;
            traitId = (traitId || 'kb|g.22476.trait.3');
            trait.set({id: traitId});
            App = new AppView({ model: trait });
            trait.fetch();
        },
    });
    var router = new Router;
    Backbone.history.start();
});