require(["jquery", "renderers/network", "util/viewport", "jquery-ui"],
function ($, Network, Viewport) {
    var minStrength = 0.7;
    var viewport = new Viewport({
        parent: "#datavis",
        title: "Network",
        maximize: true
    });
    var network = new Network({
        element: viewport,
        dock: false,
        nodeLabel: { type: "CLUSTER" },
        infoOn: "hover",
        edgeFilter: function (edge) {
            return edge.source != edge.target &&
            edge.strength >= minStrength;
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
        var wrapper = $("<div/>", { class: "btn btn-default tool" });
        var slider = $("<div/>", { style: "min-width:70px" });
        wrapper
            .append($("<div/>", { class: "btn-pad" })
                .append($("<i/>", { class: "icon-adjust" })))
            .append($("<div/>", { class: "btn-pad" })
                .append(slider));
        $container.prepend(wrapper);
        slider.slider({
            min: 0, max: 1, step: 0.05, value: 0.8,
            slide: function (event, ui) {
                minStrength = ui.value;
                network.update();
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
        _.each(data.datasets, function (ds) {
            var dsStr = ds.id.replace(/^kb.*\.ws\/\//, "");
            list.append($("<li/>")
                .append($("<a/>", {
                    href: "#",
                    "data-toggle": "tooltip",
                    "data-container": "body",
                    "title": ds.description,
                    "data-original-title": ds.description
                }).html(dsStr)));
        })
        wrapper
            .append($("<div/>", {
                class: "btn btn-default btn-sm dropdown-toggle",
                "data-toggle": "dropdown"
            }).text("Data Set ").append($("<span/>", { class: "caret"})))
            .append(list);
        $container.prepend(wrapper);
    }
});
