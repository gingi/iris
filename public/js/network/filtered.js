require(["jquery", "renderers/network", "util/viewport"],
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
    
    $.getJSON("/data/network/kbase/coex").done(function (data) {
        network.setData(data);
        network.render();
    })
});
