
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'KBase Data Visualization Library',
        version: "0.2.1"
    });
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
