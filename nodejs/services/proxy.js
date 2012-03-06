var iris = require('./iris-base.js');
var config = iris.loadConfiguration();
var app = iris.app;
iris.configureViews(app);
var routes = iris.routes;

/* Widget configuration
 *
 * Associate widget name (key) with renderer (value)
 * Rendering JavaScript is assumed to be in DOCSROOT/js/widgets
 *
 * TODO: Move to MetaContainer?
 */
var widgets = {
    manhattan: 'manhattan.js',
    pcoords:   'pcoords.js',
    chord:     'chord.js',
	data:      'data.js',
	barChart:  'barChart.js'
};
var widget_list = [
	{ id: 'manhattan', name: 'Manhattan Plot', js: 'manhattan.js' },
	{ id: 'data', name: 'Data browser', js: 'data.js' },
	{ id: 'pcoords', name: 'Parallel Coordinates Plot', js: 'pcoords.js' },
	{ id: 'chord', name: 'Chord', js: 'chord.js' },
	{ id: 'barChart', name: 'Bar Chart', js: 'barchart.js' }
];

// Routes
app.get('/', routes.index);

app.get('/404', function(req, res) {
    res.render('error', { title: 'Page not found',
                          heading: 'Page not found',
                          message: 'Now go back to where ya came from.'});
});

app.get('/widget/:widget', function(req, res) {
    // TODO: Should this be configured at a more stateful level, e.g., session?
    var layout = req.query["layout"] != null && req.query["layout"] == 'on';
    var widget_js = widgets[req.params.widget];
    if (widget_js == null) {
        res.redirect('/404');
    } else {
        routes.widget(req, res, { widget: req.params.widget, js: widget_js, layout: layout });
    }
});

app.get('/examples', routes.examples);
app.get('/workspace', function(req,res) {
	routes.workspace( req, res, widget_list );
});

iris.startServer();