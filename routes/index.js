exports.index = function (req, res) {
    res.render('index', { title: "Homepage", version: "0.1.1" });
};

exports.widget = function (req, res, args) {
    var view = args.layout ? 'widget-layout' : 'widget';
    res.render(view, args);
};

exports.renderer = function (req, res, args) {
    res.render('renderer', args);
}

exports.about = function (req, res, message) {
    res.render('index', { title: message });
};

exports.examples = function (req, res) {
    res.render('examples', { title: "Examples" });
};

exports.charts = function (req, res) {
    res.render("datavis", { title: "Charts Demo", js: "charts/main" });
};

exports.heatmap = function (req, res) {
    res.render("datavis", { title: "Heatmap", js: "heatmap/main" });
};

exports.heatmapChunked = function (req, res) {
    res.render("heatmap", { title: "Heatmap", js: "chunked" });
};

exports.workspace = function (req, res, widgetList) {
    res.render('workspace',
        { title: "Workspace", layout: "workspace_layout", list: widgetList });
};

exports.viewport = function (req, res) {
    res.render('viewport', { title: "Viewport Demo" });
};

exports.g2p = function (req, res) {
    res.render("datavis", {
        help: "help/g2p",
        title: "Genotype Phenotype Workbench",
        js: "g2p/main"
    });
};

exports.network = function (req, res) {
    res.render("datavis", { title: "Networks Workbench", js: "network/main" });
};

exports.filteredNetwork = function (req, res) {
    res.render("datavis", {
        title: "Filtered Network",
        js: "network/filtered"
    });
}
