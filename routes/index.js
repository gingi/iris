exports.index = function (req, res) {
    res.render('index');
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
    res.render('charts', { title: 'Charts Demo', js: 'demo' });
};

exports.heatmap = function (req, res) {
    res.render('heatmap', { title: 'Heatmap'});
};

exports.heatmapChunked = function (req, res) {
    res.render('heatmap', { title: 'Heatmap', js: 'chunked' });
};

exports.workspace = function (req, res, widgetList) {
    res.render('workspace',
        { title: "Workspace", layout: "workspace_layout", list: widgetList });
};

exports.viewport = function (req, res) {
    res.render('viewport', { title: "Viewport Demo" });
};
