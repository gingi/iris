/* jshint sub:true */
require([
    "jquery", "underscore", "renderers/network", "util/viewport",
    "text!sample-data/network1.json", "transformers/netindex",
    "util/slider", "text!templates/checkbox.html", "jquery-ui"
],
function (
    JQ, _, Network, Viewport, Example, NetIndex, Slider, CheckboxTemplate
) {
    "use strict";
    Example = JSON.parse(Example);
    var minStrength = 0.7;
    var viewport = new Viewport({
        parent: "#datavis",
        title: "Network",
        maximize: true
    });
    viewport.css("min-height", "600px");
    var datasetFilter = function () { return true; };
    var goLink = _.template("http://www.ebi.ac.uk/QuickGO/GTerm?id=<%= id %>");
    var network = new Network({
        element: viewport,
        dock: false,
        nodeLabel: { type: "CLUSTER" },
        infoOn: "hover",
        edgeFilter: function (edge) {
            return edge.source != edge.target &&
                (edge.strength >= minStrength ||
                    edge.source.type === "CLUSTER" ||
                    edge.target.type === "CLUSTER") &&
                datasetFilter(edge);
        },
        nodeInfo: function (node, makeRow) {
            makeRow("Type", node.type);
            makeRow("KBase ID", link(node.entityId, "#"));
            if (node.type === "GENE" && node.userAnnotations !== undefined) {
                var annotations = node.userAnnotations;
                if (annotations["external_id"] !== undefined)
                    makeRow("External ID",
                        link(annotations["external_id"], "#"));
                if (annotations["functions"] !== undefined)
                    makeRow("Function", annotations["functions"]);
                if (annotations.ontologies !== undefined) {
                    var goList = JQ("<ul/>");
                    _.each(_.keys(annotations.ontologies), function (item) {
                        goList.append(JQ("<li/>")
                            .append(link(item, goLink({ id: item }))));
                    });
                    makeRow("GO terms", goList);
                }
            }
        },
        searchTerms: function (node, indexMe) {
            indexMe(node.entityId);
            indexMe(node.kbid);
            if (node.userAnnotations !== undefined) {
                var annotations = node.userAnnotations;
                if (annotations["functions"] !== undefined)
                    indexMe(annotations["functions"]);
            }
        }
    });
    viewport.renderer(network);
    forceSlider(viewport, "charge",   "Node charge", JQ("<i>", {
        class: "icon-magnet"
    }), 5);
    forceSlider(viewport, "distance", "Edge distance", JQ("<i>", {
        class: "icon-resize-horizontal"
    }));
    forceSlider(viewport, "strength", "Edge strength", JQ("<span>", {
        class: "glyphicon glyphicon-link"
    }), 0.015);
    forceSlider(viewport, "gravity",  "Gravity", "G", 0.012);
    var toolbox = viewport.toolbox();
    addSlider(toolbox);
    addSearch(toolbox);
    
    // var fetchData = NetIndex(Example);
    var fetchData = JQ.getJSON("/data/network/kbase/coex");
    
    JQ.when(fetchData).done(function (data) {
        try {
            network.setData(data);
        } catch (error) {
            require(["text!templates/error-alert.html"], function (template) {
                JQ("#container").prepend(_.template(template, error));
            });
        }
        network.render();
        addDatasetDropdown(toolbox, data);
        addClusterDropdown(toolbox, data);
    });
    
    function forceSlider(viewport, property, title, label, factor) {
        if (factor === undefined)
            factor = 1;
        viewport.addTool((new Slider({
            title: title,
            label: label,
            value: 0,
            min: -10,
            max: 10,
            step: 1,
            slide: function (value) {
                network.forceDelta(property, value * factor);
                network.update();
            }
        })).element());
    }
    
    function addSlider($container) {
        var slider = new Slider({
            label: JQ("<i>", { class: "icon-adjust" }),
            title: "Minimum edge strength",
            min: 0,
            max: 1,
            step: 0.01,
            value: 0.8,
            slide: function (value) {
                minStrength = value;
                network.update();
            }
        });
        $container.prepend(JQ("<div>", { class: "btn btn-default tool" })
            .append(JQ("<div>", { class: "btn-pad" })
                .append(slider.element())
            )
        );
    }

    function addSearch($container) {
        var wrapper = JQ("<div>", { class: "btn btn-default tool" });
        wrapper
            .append(JQ("<div>", { class: "btn-pad" })
                .append(JQ("<input/>", {
                    id: "network-search",
                    type: "text",
                    class: "input-xs"
                })))
            .append(JQ("<div/>", { class: "btn-pad" })
                .append(JQ("<i/>", { class: "icon-search" })));
        $container.prepend(wrapper);
        JQ("#network-search").keyup(function () {
            network.updateSearch(JQ(this).val());
        });
    }

    function addClusterDropdown($container, data) {
        var list = JQ("<fieldset>");
        var menu = JQ("<ul>", { class: "dropdown-menu", role: "menu" })
            .append(JQ("<li>").append(list));
        var allClusters = dropdownCheckbox("all", "All clusters", true);
        var allCheckbox = allClusters.find("input");
        allClusters.css("background-color", "#666").css("color", "#fff");
        list.append(allClusters);
        var clusters = [];
        
        // A bit of a Schwartzian Transform to sort by neighbors
        _.map(
            _.filter(data.nodes, function (n) { return n.type === "CLUSTER"; }),
            function (node) {
                clusters.push({
                    node: node,
                    neighbors: network.neighbors(node).length
                });
            }
        );
        _.each(_.sortBy(clusters,
            function (entry) { return -entry.neighbors; }),
            function (entry) {
                var box = dropdownCheckbox(entry.node.id, "", true);
                var labelDiv = JQ("<div>", { style: "min-width:120px" })
                .append(
                    JQ("<span>", { style: "float: left" })
                        .html(entry.node.entityId)
                ).append(
                    JQ("<span>", { style: "float:right;color:#aaa" })
                        .html("N:" + entry.neighbors)
                );
                box.children("label").first().append(labelDiv);
                list.append(box);
            }
        );
        list.find("label").click(function (event) {
            event.preventDefault();
        });
        list.find("input[type='checkbox']").click(function (event) {
            // Prevent menu from closing on checkbox
            event.stopPropagation();
            var box = JQ(this);
            var id = box.val();
            var checked = box.prop("checked");
            var clSelect = "input[type='checkbox'][value!='all']";
            if (id === "all") {
                list.find(clSelect)
                    .prop("checked", checked)
                    .trigger("change");
            } else {
                if (list.find(clSelect + ":not(:checked)").length === 0)
                    allCheckbox.prop("checked", true);
                else
                    allCheckbox.prop("checked", false);
                
            }
        }).change(function (event) {
            var id = JQ(this).val();
            var checked = JQ(this).prop("checked");
            if (id === "all")
                return;
            var node = network.findNode(id);
            if (node === null) {
                require(["text!templates/error-alert.html"],
                function (template) {
                    JQ("#container").prepend(_.template(template, {
                        message: "Could not find node " + id
                    }));
                });
                return;
            }
            network.pause();
            if (checked) {
                unhideCluster(node);
            } else {
                hideCluster(node);
            }
            network.resume();
        });
        var button = JQ("<div>", {
            class: "btn btn-default btn-sm dropdown-toggle",
            "data-toggle": "dropdown"
        }).text("Clusters ").append(JQ("<span/>", { class: "caret"}))
            .dropdown();
        $container.prepend(JQ("<div>", { class: "btn-group tool" })
            .append(button)
            .append(menu)
        );
    }
    
    function unhideCluster(cluster) {
        network.unhideNode(cluster);
        var neighbors = network.neighbors(cluster, null);
        _.each(neighbors, function (nPair) {
            console.log("neighbor", nPair)
            var node = nPair[0];
            if (node.type === 'GENE')
                network.unhideNode(node);
        });
    }

    function hideCluster(cluster) {
        var neighbors = network.neighbors(cluster);
        _.each(neighbors, function (nPair) {
            var node = nPair[0];
            if (node.type === 'GENE')
                network.hideNode(node);
        })
        network.hideNode(cluster);
    }

    function addDatasetDropdown($container, data) {
        var wrapper = JQ("<div>", { class: "btn-group tool" });
        var list = JQ("<ul>", { class: "dropdown-menu", role: "menu" });
        list.append(dropdownLink("All data sets", "", "all"));
        _.each(data.datasets, function (ds) {
            var dsStr = ds.id.replace(/^kb.*\.ws\/\//, "");
            list.append(dropdownLink(dsStr, ds.description, ds.id));
        });
        list.find("a").on("click", function (event) {
            var id = JQ(this).data("value");
            list.find("li").removeClass("active");
            JQ(this).parent().addClass("active");
            if (id == "all")
                datasetFilter = function () { return true; };
            else
                datasetFilter = function (edge) {
                    return edge.datasetId == id;
                };
            network.update();
        });
        var button = JQ("<div/>", {
            class: "btn btn-default btn-sm dropdown-toggle",
            "data-toggle": "dropdown"
        }).text("Data Set ").append(JQ("<span/>", { class: "caret"}))
            .dropdown();
        wrapper
            .append(button)
            .append(list);
        $container.prepend(wrapper);
    }

    function dropdownLink(linkText, title, value) {
        return JQ("<li>")
            .append(JQ("<a>", {
                href: "#",
                "data-toggle": "tooltip",
                "data-container": "body",
                "title": title,
                "data-original-title": title,
                "data-value": value
            }).append(linkText));
    }
    function dropdownCheckbox(value, label, checked) {
        return JQ("<div>", { class: "dropdown-menu-item" })
            .append(_.template(CheckboxTemplate, {
                label: label,
                value: value,
                checked: checked
            }));
    }
    function link(content, href, attrs) {
        return JQ("<a>", _.extend({ href: href }, attrs)).html(content);
    }
});
