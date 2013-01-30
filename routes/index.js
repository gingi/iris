
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'KBase Data Visualization Library' });
};

exports.charts = function (req, res) {
    res.render('charts', { title: 'Charts Demo', js: 'demo' });
};

exports.heatmap = function (req, res) {
    res.render('datavis', { title: 'Heatmap', js: 'heatmap/app' });
};

exports.heatmapChunked = function (req, res) {
    res.render('heatmap', { title: 'Heatmap', js: 'chunked' });
};
