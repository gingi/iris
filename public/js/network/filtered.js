require(["jquery", "renderers/network", "util/viewport", "jquery-ui"],
function ($, Network, Viewport) {
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
            edge.strength >= 0.7;
        }
    });
    viewport.addTool($("<a/>", { href: "#" }).html("Click me!"));
    var toolbox = viewport.toolbox();
    addSlider(toolbox);
    addSearch(toolbox);
    
    
    $.getJSON("/data/network/kbase/coex").done(function (data) {
        network.setData(data);
        network.render();
    });
    
    function addSlider($container) {
        var wrapper = $("<div/>", {
            class: "btn btn-default tool"
        });
        var slider = $("<div/>", { style: "min-width:60px" });
        wrapper
            .append($("<div/>", { class: "btn-pad" })
                .append($("<i/>", { class: "icon-adjust" })))
            .append($("<div/>", { class: "btn-pad" })
                .append(slider));
        $container.prepend(wrapper);
        slider.slider({
            min: 0, max: 1, step: 0.05, value: 0.8
        }).on("slide", function () { });
    }
    
    function addSearch($container) {
        var wrapper = $("<div/>", {
            class: "btn btn-default tool"
        });
        wrapper
            .append($("<div/>", { class: "btn-pad" })
                .append($("<input/>", { type: "text", class: " input-xs" })))
            .append($("<div/>", { class: "btn-pad" })
                .append($("<i/>", { class: "icon-search" })));
        $container.prepend(wrapper);
    }
});
