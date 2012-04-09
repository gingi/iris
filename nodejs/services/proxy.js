var iris = require('./service-base.js');
var app = iris.app;
iris.configureViews(app);
var routes = iris.routes;
var url = require('url');
var httpProxy = require('http-proxy');

/* Widget configuration
 *
 * Associate widget name (key) with renderer (value)
 * Rendering JavaScript is assumed to be in DOCSROOT/js/widgets
 *
 * TODO: Move to MetaContainer?
 */
var widgetList = [
    {
        id: 'manhattan',
        module: 'Manhattan',
        name: 'Manhattan Plot',
        js: 'manhattan.js'
    },
    {
        id: 'data',
        module: 'DataBrowser',
        name: 'JSON Viewer',
        js: 'data.js'
    },
    {
        id: 'pcoords',
        module: 'Pcoords',
        name: 'Parallel Coordinates Plot',
        js: 'pcoords.js'
    },
    {
        id: 'chord',
        module: 'Chord',
        name: 'Comparative Map',
        js: 'chord.js'
    },
    {
        id: 'barchart',
        module: 'BarChart',
        name: 'Phenotype Distribution',
        js: 'barchart.js'
    }
];

function findWidget(key, val) {
	for (var i in widgetList) {
		if (widgetList[i][key] === val) {
			return widgetList[i];
		}
	}
	return null;
}

// Routes
app.get('/', routes.index);

app.get('/404', function (req, res) {
    res.render('error', { title: 'Page not found',
                          heading: 'Page not found',
                          message: 'Now go back to where ya came from.'});
});

app.get('/widget/:widget', function (req, res) {
    // TODO: Should this be configured at a more stateful level, e.g., session?
    var layout = req.query["layout"] != null && req.query["layout"] == 'on';
	var widget = findWidget("id", req.params.widget);
    if (widget == null) {
        res.redirect('/404');
    } else {
        routes.widget(req, res, { widget: widget.module, js: widget.js, layout: layout });
    }
});

app.get('/workspace', function (req, res) {
	routes.workspace(req, res, widgetList);
});

app.get('/viewport', function (req, res) {
    routes.viewport(req, res);
});

app.get('/simple', function (req, res) {
    res.render('simple', { title: "Simple Browser" });
});

// Proxy endpoints
for (var serviceName in iris.endpoints) {
    var endpoint = iris.endpoints[serviceName];
    for (var p = 0; p < endpoint.paths.length; p++) {
        var path = endpoint.paths[p];
        app.get(path + "*", function (req, res) {
            iris.httpGET(res, serviceName, req.url)
        })
    }
}

iris.startService();
