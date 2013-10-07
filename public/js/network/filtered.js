require(["jquery", "renderers/network", "util/viewport"],
function ($, Network, Viewport) {
    var viewport = new Viewport({
        parent: "#datavis",
        title: "Network",
        maximize: true
    });
    viewport.css("min-height", "700px");
    var network = new Network({
        element: viewport,
        dock: false,
        nodeLabel: { type: "CLUSTER" }
    });
    $.getJSON("/data/network/kbase/coex").done(function (data) {
        network.setData(data);
        network.render();
    })
});
