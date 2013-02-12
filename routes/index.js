
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'KBase Data Visualization Library' });
};

exports.charts = function (req, res) {
    res.render('datavis', { title: 'Charts Demo', js: 'charts/main' });
};

exports.heatmap = function (req, res) {
    res.render('datavis', { title: 'Heatmap', js: 'heatmap/main' });
};

exports.heatmapChunked = function (req, res) {
    res.render('heatmap', { title: 'Heatmap', js: 'chunked' });
};
