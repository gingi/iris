require([
    "jquery", "underscore", "renderers/network", "util/viewport", "jquery-ui"
],
function ($, _, Network, Viewport) {
    var minStrength = 0.7;
    var viewport = new Viewport({
        parent: "#datavis",
        title: "Network",
        maximize: true
    });
    viewport.css("min-height", "800px");
    var datasetFilter = function () { return true; };
    var goLink = _.template("http://www.ebi.ac.uk/QuickGO/GTerm?id=<%= id %>");
    var network = new Network({
        element: viewport,
        dock: false,
        nodeLabel: { type: "CLUSTER" },
        infoOn: "hover",
        edgeFilter: function (edge) {
            return edge.source != edge.target &&
                (edge.strength >= minStrength || edge.strength == 0) &&
                datasetFilter(edge);
        },
        nodeInfo: function (node, makeRow) {
            makeRow("Name", node.name);
            makeRow("Type", node.type);
            makeRow("KBase ID", link(node.entityId, "#"));
            if (node.type === "GENE" && node.userAnnotations !== undefined) {
                var annotations = node.userAnnotations;
                if (annotations.external_id !== undefined)
                    makeRow("External ID", link(annotations.external_id, "#"));
                if (annotations.functions !== undefined)
                    makeRow("Function", annotations.functions);
                if (annotations.ontologies !== undefined) {
                    var goList = $("<ul/>");
                    _.each(_.keys(annotations.ontologies), function (item) {
                        goList.append($("<li/>")
                            .append(link(item, goLink({ id: item }))));
                    });
                    makeRow("GO terms", goList);
                }
            }
        }
    });
    viewport.addTool($("<a/>", { href: "#" }).html("Click me!"));
    var toolbox = viewport.toolbox();
    addSlider(toolbox);
    addSearch(toolbox);
    
    $.getJSON("/data/network/kbase/coex").done(function (data) {
        addDatasetDropdown(toolbox, data);
        network.setData(data);
        network.render();
    });
    
    function addSlider($container) {
        var tipTitle = "Minimum edge strength: ";
        var wrapper = $("<div/>", {
            id: "strength-slider",
            class: "btn btn-default tool"
        });
        var slider = $("<div/>", { style: "min-width:70px;margin-right:5px" });
        wrapper
            .append($("<div/>", { class: "btn-pad" })
                .append($("<i/>", { class: "icon-adjust" })))
            .append($("<div/>", { class: "btn-pad" })
                .append(slider));
        $container.prepend(wrapper);
        $("#strength-slider").tooltip({
           title: tipTitle + minStrength.toFixed(2),
           placement: "bottom"
        });
        slider.slider({
            min: 0, max: 1, step: 0.01, value: 0.8,
            slide: function (event, ui) {
                minStrength = ui.value;
                network.update();
                $("#strength-slider").next().find(".tooltip-inner")
                    .text(tipTitle + minStrength.toFixed(2));
            }
        });
    }
    
    function addSearch($container) {
        var wrapper = $("<div/>", { class: "btn btn-default tool" });
        wrapper
            .append($("<div/>", { class: "btn-pad" })
                .append($("<input/>", { type: "text", class: " input-xs" })))
            .append($("<div/>", { class: "btn-pad" })
                .append($("<i/>", { class: "icon-search" })));
        $container.prepend(wrapper);
    }
    
    function addDatasetDropdown($container, data) {
        var wrapper = $("<div/>", { class: "btn-group tool" });
        var list = $("<ul/>", { class: "dropdown-menu", role: "menu" });
        list.append(dropdownLink("All data sets", "", "all"));
        _.each(data.datasets, function (ds) {
            var dsStr = ds.id.replace(/^kb.*\.ws\/\//, "");
            list.append(dropdownLink(dsStr, ds.description, ds.id))
        });
        list.find("a").on("click", function (event) {
            var id = $(this).data("value");
            list.find("li").removeClass("active");
            $(this).parent().addClass("active");
            if (id == "all")
                datasetFilter = function () { return true; };
            else
                datasetFilter = function (edge) {
                    return edge.datasetId == id;
                }
            network.update();
        })
        wrapper
            .append($("<div/>", {
                class: "btn btn-default btn-sm dropdown-toggle",
                "data-toggle": "dropdown"
            }).text("Data Set ").append($("<span/>", { class: "caret"})))
            .append(list);
        $container.prepend(wrapper);
    }
    
    function dropdownLink(linkText, title, value) {
        return $("<li/>")
            .append($("<a/>", {
                href: "#",
                "data-toggle": "tooltip",
                "data-container": "body",
                "title": title,
                "data-original-title": title,
                "data-value": value
            }).html(linkText));
    }
    function link(content, href, attrs) {
        return $("<a/>", _.extend({ href: href }, attrs)).html(content);
    }
});
