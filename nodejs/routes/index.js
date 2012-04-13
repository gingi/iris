exports.index = function(req, res) {
    res.render('index', { title: 'Welcome' })
};

exports.widget = function(req, res, args) {
    args['title'] = args['widget'];
    res.render('widget', args);
};

exports.renderer = function (req, res, args) {
    res.render('renderer', args);
}

exports.about = function(req, res, message) {
    res.render('index', { title: message });
};

exports.examples = function(req, res) {
    res.render('examples', { title: "Examples" });
};

exports.workspace = function(req, res, widgetList) {
    res.render('workspace',
        { title: "Workspace", layout: "workspace_layout", list: widgetList });
};

exports.viewport = function(req, res) {
    res.render('viewport', { title: "Viewport Demo" });
};