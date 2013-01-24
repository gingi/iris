require(['jquery', 'backbone', 'underscore', 'renderers/network'],
    function ($, Backbone, _, NetworkVis) {
        
    var Network = Backbone.Model.extend({
        defaults: { name: "" },
        urlRoot: "/data/network",
    });
    
    var Neighborhood = Backbone.Model.extend({
        url: function () {
            return "/data/node/" + this.get('id') + '/neighbors';
        }
    })
    
    var vis;
    var AppView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
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
    
    var NetworkDatasets = Backbone.Model.extend({
        url: function () {
            return '/data/node/' + this.get('id') + '/datasets';
        },
        parse: function (data) {
            this.set('datasets', data);
        }
    });
    
    var DatasetView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            this.model.on('change', this.render);
        },
        template: _.template("<li><a href=\"<%=link%>\" title=\"<%=desc%>\">" +
                             "<%=name%></a></li>"),
        render: function () {
            var self = this;
            var hud = $("<div>")
                .addClass("hud")
                .css("top", 50)
                .css("left", 20)
                .css("width", 400);
            this.$el.append(hud);
            var list = $("<ul>");
            var datasets = this.model.get('datasets');
            hud.empty();
            if (datasets == null || datasets.length == 0) {
                hud.text("No datasets");
            } else {
                hud.append(list);
                datasets.forEach(function (ds) {
                    list.append(self.template({
                        name: ds.name, desc: ds.description,
                        link: "#node/" + self.model.get('id') + 
                              "/" + ds.id
                    }));
                })
                list.append(self.template({
                    name: 'All', desc: "Use all networks",
                    link: "#node/" + self.model.get('id') +
                        "/" + _.pluck(datasets, 'id').join(',')
                }))
            }
            hud.fadeIn();
        }
    })
    
    var SearchBox = Backbone.View.extend({
        el: $("#nav-search"),
        events: {
            "submit": "search"
        },
        search: function (data) {
            var query = $("#nav-search [type=text]").val();
            router.navigate("#node/" + query);
        }
    });

    var App;
    
    var Router = Backbone.Router.extend({
        routes: {
            "node/:id":          "networkDatasets",
            "node/:id/:dataset": "neighborhood",
            ":network":          "showNetwork"
        },
        showNetwork: function (networkId) {
            console.log("Showing network")
            var network = new Network;
            networkId = (networkId || 'random');
            network.set({id: networkId});
            App = new AppView({ model: network });
            network.fetch();
            var search = new SearchBox();
        },
        networkDatasets: function (nodeId) {
            var datasets = new NetworkDatasets({ id: nodeId });
            var datasetView = new DatasetView({ model: datasets });
            datasets.fetch();
        },
        neighborhood: function (id, dataset) {
            var network = new Neighborhood({ id: id, dataset: dataset });
            var app = new AppView({ model: network });
            network.fetch({ data: { datasets: dataset }});
        }
    });
    var router = new Router;
    Backbone.history.start();
});