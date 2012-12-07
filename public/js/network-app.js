requirejs.config({
    shim: {
        jquery:     { exports: '$' },
        d3:         { exports: 'd3' },
        backbone:   { exports: 'Backbone' },
        underscore:  { exports: '_' }
    },
})
require(['underscore', 'jquery', 'backbone', 'network-vis'],
    function (_, $, Backbone, NetworkVis) {
    var Network = Backbone.Model.extend({
       defaults: { name: "" },
       urlRoot: "/data/network",
    });
    
    var networkID = location.hash.substr(1) || 'random';

    var AppView = Backbone.View.extend({
        initialize: function () {
            var network = this.model;
            network.set({ id: networkID });
            network.bind('fetch', this.render);
            network.fetch({
                success: function (model) {
                    App.render();
                }
            });
            // network.bind('change', this.update, this);
        },
        render: function () {
            var vis = new NetworkVis("#datavis");
            vis.setNodes(this.model.get('nodes'));
            vis.setEdges(this.model.get('edges'));
            vis.start();
            // vis.addNode("Cause");
            // vis.addNode("Effect");
            // vis.addLink("Cause", "Effect");
            // vis.addNode("A");
            // vis.addNode("B");
            // vis.addLink("A", "B");
            return this;
        },
        events: {
            "click circle.node": "doClick"
        },
        doClick: function () {
            console.log("Clicked.");
        }    
        
    });    
    
    var App = new AppView({ model: new Network });
});