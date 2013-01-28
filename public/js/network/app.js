require(['jquery', 'backbone', 'underscore',
    'renderers/network', 'util/progress', 'util/hud'],
    function ($, Backbone, _, NetworkVis, Progress, HUD) {
        
    var neighborTemplate = _.template("/data/node/<%= id %>/neighbors");
    var networkTemplate  = _.template("/data/network/<%= id %>");
    var internalTemplate = _.template("/data/network/internal");

    var App, Search, router, AppProgress;
    var resetNetwork = true;
        
    AppProgress = new Progress({
        element: "#progress-indicator",
        fade: false,
        type: Progress.BAR
    });
    var NetworkModel = Backbone.Model.extend({
        parse: function (data) {
            this.set('data', data);
        }
    });
    var NetworkData = new NetworkModel;
    var Datavis = new NetworkVis({ element: "#datavis", dock: true });
    Datavis.on("dblclick-node", function (evt, node, element) {
        if (NetworkData.id == 'random') {
            AppProgress.show("Fetching fake data");
            NetworkVis.getNeighbors.call(Datavis, node, element);
        } else {
            resetNetwork = false;
            if (NetworkDatasets.get('datasets') == null) {
                router.navigate("#node/" + node.name + "/datasets", true);
            } else {
                router.navigate("#node/" + node.name + "/datasets/" +
                     NetworkDatasets.get('datasets').join(",") +
                     "/neighbors", true);
             }
        }
    });
    Datavis.on("click-node", function (evt, node, element) {
        Datavis.clickNode(node, element);
    });
/*
    Datavis.dockHudContent(function (nodes) {
        var dock = this;
        require(['renderers/table'], function (Table) {
            var $div = $("<div>").attr("id", "dock-hud-content");
            dock.hud.append($div);
            var table = new Table({ element: "#dock-hud-content" });
            table.setData({
                data: nodes,
                columns: ['Name']
            });
            table.display();
        })
    })
*/
    Datavis.addDockAction(function (nodes) {
        var dock = this;
        if (nodes.length > 1) {
            var button = $("<button>")
                .addClass("btn btn-small btn-primary")
                .text("Shared clusters");
            button.on("click", function () {
                resetNetwork = false;
                AppProgress.show("Getting clusters");
                var fetched = 0;
                nodes.forEach(function (id) {
                    var neighbors = new NetworkModel;
                    neighbors.url = neighborTemplate({ id: id });
                    neighbors.fetch({
                        data: {
                            datasets: NetworkDatasets.get('datasets').join(",")
                        },
                        success: function (model, data) {
                            fetched++;
                            Datavis.merge(data);
                            if (fetched == nodes.length) {
                                AppProgress.dismiss();
                                enableBuildNetwork();
                            }
                        }
                    })
                })
                // router.navigate(
                //     "#network/" + nodes.join(",") +
                //     "/datasets/" + NetworkDatasets.get('datasets').join(","), true);
            })
            dock.hud.append(button);
        }
    });
    Datavis.addDockAction(function () {
        var dock = this;
        button = $("<button>").addClass("btn btn-small")
            .attr("id", "btn-build-network")
            .css("margin-left", 10)
            .attr("disabled", true)
            .text("Build internal network");
            dock.hud.append(button);
    });
    function enableBuildNetwork() {
        var button = $("#btn-build-network")
        var clusters = Datavis.find("CLUSTER", "type");
        if (clusters.length) {
            button.attr("disabled", null);
        }
        button.on("click", function () {
/*
            AppProgress.show("Building network");
            var fetched = 0;
            clusters.forEach(function (cluster) {
                var neighbors = new NetworkModel;
                neighbors.url = neighborTemplate(cluster);
                neighbors.fetch({
                    data: {
                        datasets: NetworkDatasets.get('datasets').join(",")
                    },
                    success: function (model, data) {
                        fetched++;
                        Datavis.merge(data);
                        if (fetched == nodes.length) {
                            AppProgress.dismiss();
                            enableBuildNetwork();
                        }
                    }
                })
            })
*/
            router.navigate("#network/" + _.pluck(clusters, "entityId") +
                "/datasets/" + NetworkDatasets.get('datasets').join(","), true);
        });
    }
    
    var AppView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            if (NetworkData)
                NetworkData.on('sync', this.render);
        },
        render: function () {
            var self = this;
            Datavis.merge(NetworkData.get('data'));
            AppProgress.dismiss();
            return self;
        },
    });
    
    var DatasetModel = Backbone.Model.extend({
        url: function () {
            return '/data/node/' + this.get('id') + '/datasets';
        },
        parse: function (data) {
            this.set('datasets', data);
        }
    });
    var NetworkDatasets = new DatasetModel;
    
    var DatasetView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            NetworkDatasets.on('change', this.render);
        },
        template: _.template("<li><a href=\"<%=link%>\" title=\"<%=desc%>\">" +
                             "<%=name%></a></li>"),
        render: function () {
            var self = this;
            var hud = new HUD({
                position: { top: 50, left: 20 },
                width: 400
            });
            var list = $("<ul>");
            if (NetworkDatasets == null ||
                    NetworkDatasets.get('datasets') == null) {
                hud.text("No datasets");
            } else {
                var datasets = NetworkDatasets.get('datasets');
                hud.append($("<h4>").text("Data Sets"))
                hud.append(list);
                datasets.forEach(function (ds) {
                    list.append(self.template({
                        name: ds.name, desc: ds.description,
                        link: "#node/" + NetworkDatasets.get('id') + 
                              "/datasets/" + ds.id
                    }));
                })
                list.append(self.template({
                    name: 'All', desc: "Use all networks",
                    link: "#node/" + NetworkDatasets.get('id') +
                        "/datasets/" + _.pluck(datasets, 'id').join(',')
                }))
            }
            hud.show();
        }
    })
    
    var SearchBox = Backbone.View.extend({
        el: $("#nav-search"),
        events: { "submit": "search" },
        search: function (data) {
            var query = $("#nav-search [type=text]").val();
            resetNetwork = false;
            router.navigate("#node/" + query, true);
        }
    });

    function showApp(params) {
        AppProgress.show("Fetching network");
        if (resetNetwork) { Datavis.reset(); }
        resetNetwork = true;
        NetworkData.set({ id: params.id });
        NetworkData.url = params.url({ id: params.id });
        App = new AppView({ model: NetworkData });
        NetworkData.fetch({ data: params.fetchData });
    }
    
    var Router = Backbone.Router.extend({
        routes: {
            "node/:id":                          "addNode",
            "node/:id/datasets/:datasets":       "addNode",
            "nodes/:nodes/datasets/:datasets":   "addNodes",
            "node/:node/datasets":               "networkDatasets",
            "node/:id/datasets/:sets/neighbors": "neighborhood",
            "network/:nodes/datasets/:datasets": "internalNetwork",
            ":network":                          "showNetwork",
            "*path":                             "default"
        },
        addNode: function (nodeId, datasets) {
            NetworkData.set({ id: nodeId });
            if (resetNetwork) { Datavis.reset(); }
            Datavis.addNode({
                name: nodeId
            });
            NetworkDatasets.set('datasets', datasets.split(","));
        },
        addNodes: function (nodeInput, datasetInput) {
            NetworkData.set({ id: null });
            if (resetNetwork) { Datavis.reset(); }
            var nodes = nodeInput.split(",");
            var datasets = datasetInput.split(",");
            for (var i = 0; i < nodes.length; i++) {
                var type, group;
                if (nodes[i].match(/^kb\|/)) {
                    type = 'CLUSTER';
                    group = 'clusters';
                } else {
                    type = 'GENE';
                    group = 'genes';
                }
                Datavis.addNode({
                    name: nodes[i], type: type, group: group
                });
            }
            NetworkDatasets.set('datasets', datasets);
            Datavis.dockNodes(nodes);
        },
        showNetwork: function (networkId) {
            showApp({
                id: networkId || 'random',
                url: networkTemplate
            })
        },
        networkDatasets: function (nodeId) {
            AppProgress.show("Fetching data sets");
            NetworkDatasets.set({ id: nodeId });
            var datasetView = new DatasetView();
            NetworkDatasets.fetch({
                success: function () { AppProgress.dismiss(); }
            });
        },
        neighborhood: function (id, dataset) {
            showApp({
                id: id,
                url: neighborTemplate,
                fetchData: { datasets: dataset }
            });
            NetworkDatasets.set('dataset', dataset);
        },
        internalNetwork: function (nodes, datasets) {
            AppProgress.show("Building");
            showApp({
                id: "internal",
                url: internalTemplate,
                fetchData: { datasets: datasets, nodes: nodes }
            });
        },
        default: function () {
            // Default route
        }
    });
    router = new Router;
    search = new SearchBox;
    Backbone.history.start();
});