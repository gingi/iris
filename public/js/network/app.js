require(['jquery', 'backbone', 'underscore',
    'renderers/network', 'util/progress', 'util/hud'],
    function ($, Backbone, _, NetworkVis, Progress, HUD) {
        
    var neighborTemplate = _.template("/data/node/<%= id %>/neighbors");
    var networkTemplate  = _.template("/data/network/<%= id %>");
    var internalTemplate = _.template("/data/network/internal");
    var datasetsTemplate = _.template("/data/node/<%= id %>/datasets");
    var datasetLinkItemTemplate = _.template(
        "<li><a href=\"<%=link%>\" title=\"<%=desc%>\"><%=name%></a></li>");
    var neighborQueryTemplate = _.template("/data/query/network/neighbors");

    var App, Search, router, AppProgress;
    var resetNetwork = true;
    var clusters;
        
    AppProgress = new Progress({
        element: "#progress-indicator",
        fade: false,
        type: Progress.BAR
    });
    var NetworkModel = Backbone.Model.extend({
        parse: function (data) { this.set(data); },
    });
    var NetworkData = new NetworkModel;
    var Datavis = new NetworkVis({
        element: "#datavis",
        dock: true,
        joinAttribute: "entityId",
        label: { type: "CLUSTER" }
    });
    Datavis.on("dblclick-node", function (evt, node, element) {
        evt.stopPropagation();
        if (node.isExpanded) {
            Datavis.collapse(node);
            node.isExpanded = false;
            node.isCollapsed = true;
            return;
        } else if (node.isCollapsed) {
            Datavis.uncollapse(node);
            node.isCollapsed = false;
            node.isExpanded = true;
            return;
        }
        resetNetwork = false;
        if (DataSets.get('datasets') == null) {
            router.navigate("#node/" + node.name + "/datasets", true);
        } else {
            $.ajax({
                url: neighborTemplate({ id: node.entityId }),
                dataType: 'json',
                data: { datasets: DataSets.asString() }
            }).done(function (n) { Datavis.merge(n, { hidden: false }); });
            
            // FIXME: This stopped working for some reason
            //        Getting objects within edge.source/link
            // router.navigate("#node/" + node.name + "/datasets/" +
            //      DataSets.asString() +
            //      "/neighbors", true);
        }
        node.isExpanded = true;
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
    var nodeClusters = {};
    Datavis.addDockAction(function (nodes) {
        var dock = this;
        if (nodes.length > 1) {
            var button = $("<button>")
                .addClass("btn btn-small btn-primary")
                .text("Get clusters");
            button.on("click", function () {
                resetNetwork = false;
                AppProgress.show("Getting clusters");
                var fetched = 0;
                nodes.forEach(function (id) {
                    if (nodeClusters[id]) {
                        fetched++;
                        if (fetched == clusters.length) {
                            AppProgress.dismiss();
                        }
                        return;
                    }
                    var neighbors = new NetworkModel;
                    neighbors.url = neighborTemplate({ id: id });
                    neighbors.fetch({
                        data: {
                            datasets: DataSets.asString(),
                            rels: "gc"
                        },
                        success: function (model, data) {
                            fetched++;
                            nodeClusters[id] = true;
                            if (!data) return;
                            data.nodes.forEach(function (node) {
                                // Ensure distinct colors.
                                node.group = node.entityId;
                            });
                            Datavis.merge(data);
                            if (fetched == nodes.length) {
                                AppProgress.dismiss();
                                enableBuildNetwork();
                            }
                        }
                    })
                })
            })
            dock.hud.append(button);
        }
    });
    var clusterNeighbors = {};
    Datavis.addDockAction(function () {
        var dock = this;
        var button = $("<button>").addClass("btn btn-small")
            .attr("id", "btn-co-neighbors")
            .css("margin-left", 5)
            .attr("disabled", !clusters || clusters.length == 0)
            .text("Find Co-Neighbors");
        dock.hud.append(button);
        button.on("click", function () {
            AppProgress.show("Getting co-neighbors");
            var fetched = 0;
            clusters.forEach(function (cluster) {
                if (clusterNeighbors[cluster.entityId]) {
                    fetched++;
                    if (fetched == clusters.length) {
                        AppProgress.dismiss();
                    }
                    return;
                }
                var neighbors = new NetworkModel;
                neighbors.url = neighborTemplate({ id: cluster.entityId });
                neighbors.fetch({
                    data: { datasets: DataSets.asString() },
                    success: function (model, data) {
                        fetched++;
                        clusterNeighbors[cluster.entityId] = true;
                        fetchCoNeighbors(model, data, cluster);
                        if (fetched == clusters.length) {
                            AppProgress.dismiss();
                            enableBuildNetwork();
                            Datavis.display();
                        }
                    }
                })
            })
            // router.navigate("#network/" + _.pluck(clusters, "entityId") +
            //     "/datasets/" + DataSets.asString(), true);
        });
    });
    Datavis.addDockAction(function () {
        var dock = this;
        dock.hud.append($("<button>")
            .addClass("btn btn-small")
            .css("margin-left", 5)
            .text("||").on("click", function () {
                this._paused = !this._paused;
                if (this._paused) {
                    Datavis.pause();
                    $(this).text(">");
                } else {
                    Datavis.resume();
                    $(this).text("||");
                }
            }));
    });
    function enableBuildNetwork() {
        clusters = Datavis.find("CLUSTER", "type");
        if (clusters.length) {
            $("#btn-co-neighbors").attr("disabled", false);
        }
    }
    function unhideCoNeighbors(nodes) {
nodes.length = Math.min(nodes.length, 10);
        var docked = Datavis.dockedNodes();
        for (var i = 0; i < nodes.length; i++) {
            for (var j = 0; j < docked.length; j++) {
                var target = Datavis.findNode(nodes[i].entityId, "entityId");
                if (!target) continue;
                target.group = nodes[i].group;
                var link = Datavis.findEdge(target, docked[j]);
                if (link != null) {
                    link.hidden = false;
                    target.hidden = false;
                }
            }
        }
    }
    function fetchCoNeighbors(model, data, cluster) {
        Datavis.merge(data, { hidden: true });
        var nodes = _.pluck(_.filter(data.nodes, function (d) {
                return d.type == 'GENE'
            }), "entityId").join(",");
        if (nodes == "") return;
        $.ajax({
            url: neighborQueryTemplate(),
            dataType: "json",
            data: {
                nodes: nodes,
                datasets: DataSets.asString,
                rels: "gg"
            }
        }).done(function (neighbors) {
            if (!neighbors || !neighbors.nodes) return;
            neighbors.nodes.forEach(function (node) {
                node.group = cluster.group;
            });
            Datavis.merge(neighbors, { hidden: true });
            unhideCoNeighbors(neighbors.nodes);
        });
    }
    
    var AppView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            if (NetworkData)
                NetworkData.on('change', this.render);
        },
        render: function () {
            var self = this;
            Datavis.merge(NetworkData.toJSON());
            AppProgress.dismiss();
            return self;
        },
    });
    
    var DataSetModel = Backbone.Model.extend({
        url:   function () {return datasetsTemplate(this); },
        parse: function (data) { this.set("datasets", data); }
    });
    var DataSets = new DataSetModel;
    DataSets.asString = function () {
        return DataSets.get("datasets").join(",")
    };
    
    var DataSetView = Backbone.View.extend({
        el: $("#container"),
        initialize: function () {
            _.bindAll(this, 'render');
            DataSets.on('change', this.render);
        },
        template: datasetLinkItemTemplate,
        render: function () {
            var self = this;
            var hud = new HUD({
                position: { top: 50, left: 20 },
                width: 400
            });
            var list = $("<ul>");
            if (DataSets == null ||
                    DataSets.get('datasets') == null) {
                hud.text("No datasets");
            } else {
                var datasets = DataSets.get('datasets');
                hud.append($("<h4>").text("Data Sets"))
                hud.append(list);
                datasets.forEach(function (ds) {
                    list.append(self.template({
                        name: ds.name, desc: ds.description,
                        link: "#node/" + DataSets.get('id') + 
                              "/datasets/" + ds.id
                    }));
                })
                list.append(self.template({
                    name: 'All', desc: "Use all networks",
                    link: "#node/" + DataSets.get('id') +
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
        if (resetNetwork) { Datavis.reset(); }
        resetNetwork = true;
        if (params.id == 'fake') {
            DataSets.set('datasets', ["fake"]);
        }
        NetworkData.clear();
        // NetworkData.set({ id: params.id });
        NetworkData.url = params.url({ id: params.id });
        App = new AppView;
        NetworkData.fetch({ data: params.fetchData });
    }
    
    var Router = Backbone.Router.extend({
        routes: {
            "node/:id":                          "addNode",
            "node/:id/datasets/:sets":           "addNode",
            "nodes/:nodes/datasets/:sets":       "addNodes",
            "node/:node/datasets":               "networkDatasets",
            "node/:id/datasets/:sets/neighbors": "neighborhood",
            "network/:nodes/datasets/:sets":     "internalNetwork",
            ":network":                          "showNetwork",
            "*path":                             "default"
        },
        addNode: function (nodeId, datasets) {
            NetworkData.set({ id: nodeId });
            if (resetNetwork) { Datavis.reset(); }
            Datavis.addNode({ name: nodeId });
            DataSets.set('datasets', datasets.split(","));
        },
        addNodes: function (nodeInput, datasetInput) {
            NetworkData.set({ id: null });
            if (resetNetwork) { Datavis.reset(); }
            var nodes = nodeInput.split(",");
            var datasets = datasetInput.split(",");
            for (var i = 0; i < nodes.length; i++) {
                var type, group;
                type = 'GENE';
                group = 'genes';
                Datavis.addNode({
                    name: nodes[i], entityId: nodes[i], type: type, group: group
                });
            }
            DataSets.set('datasets', datasets);
            Datavis.dockNodes(nodes);
        },
        showNetwork: function (networkId) {
            Datavis.reset();
            showApp({
                id: networkId || 'fake',
                url: networkTemplate
            })
        },
        networkDatasets: function (nodeId) {
            DataSets.set({ id: nodeId });
            var datasetView = new DataSetView();
            DataSets.fetch({
                success: function () { AppProgress.dismiss(); }
            });
        },
        neighborhood: function (id, datasets) {
            showApp({
                id: id,
                url: neighborTemplate,
                fetchData: { datasets: datasets }
            });
            DataSets.set('datasets', datasets.split(","));
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