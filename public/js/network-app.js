requirejs.config({
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
require(['jquery', 'backbone', 'underscore', 'network-vis'],
    function ($, Backbone, _, NetworkVis) {
    var Network = Backbone.Model.extend({
        defaults: { name: "" },
        urlRoot: "/data/network",
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
            vis = new NetworkVis("#datavis");
            vis.setNodes(this.model.get('nodes'));
            vis.setEdges(this.model.get('edges'));
            vis.start();
            return this;
        },
    });    

    var App;
    
    var Router = Backbone.Router.extend({
        routes: {
            "*actions": "showNetwork",
        },
        showNetwork: function (networkId) {
            var network = new Network;
            networkId = (networkId || 'random');
            network.set({id: networkId});
            App = new AppView({ model: network });
            network.fetch();
        }
    });
    var router = new Router;
    Backbone.history.start();
});