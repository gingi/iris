require(['jquery', 'backbone', 'underscore', 'renderers/network'],
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
            $("#nav-search").on('submit', function (evt) {
                var value = evt.target[0].value;
                vis.highlight(value);
            });
        },
        render: function () {
            $("#datavis").empty();
            vis = new NetworkVis({ element: "#datavis", dock: true });
            vis.setData({
                nodes: this.model.get('nodes'),
                edges: this.model.get('edges')
            });
            vis.display();
            return this;
        },
    });    

    var App;
    
    var Router = Backbone.Router.extend({
        routes: {
            "*actions":        "showNetwork"
        },
        showNetwork: function (networkId) {
            var network = new Network;
            networkId = (networkId || 'random');
            network.set({id: networkId});
            App = new AppView({ model: network });
            network.fetch();
        },
    });
    var router = new Router;
    Backbone.history.start();
});