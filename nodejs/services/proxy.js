var iris = require('./service-base.js');
var app = iris.app;
iris.configureViews(app);
var routes = iris.routes;
var url = require('url');
var httpProxy = require('http-proxy');
var fs = require('fs');
var path = require('path');
var JS_DIR = iris.IRIS_HOME + '/root/js';
var RENDERER_JS_DIR = JS_DIR + '/renderers';
var RENDERER_HTTPPATH = '/js/renderers';
var WIDGET_JS_DIR   = JS_DIR + '/widgets';


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

function directoryContents(response, dir) {
    fs.readdir(dir, function (err, files) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(files));
    });
}

function fileNotFound(res) {
    res.writeHead(404);
    res.end("File not found.");
}

// Routes
app.get('/', routes.index);
app.get('/about', function (req, res) {
    res.render('about', { title : 'About' });
});
app.get('/contact', function (req, res) {
    res.render('contact', { title : 'Contact Us'});
});

app.get('/404', function (req, res) {
    res.render('error', { title: 'Page not found',
                          heading: 'Page not found',
                          message: 'Now go back to where ya came from.'});
});

app.get('/widget', function (req, res) {
    directoryContents(res, WIDGET_JS_DIR);
});

app.get('/widget/:widget', function (req, res) {
    // TODO: Should this be configured at a more stateful level, e.g., session?
    var layout = req.query["layout"] != null && req.query["layout"] == 'on';
	var widget = findWidget("id", req.params.widget);
    if (widget == null) {
        fileNotFound(res);
    } else {
        routes.widget(req, res, { widget: widget.module, js: widget.js, layout: layout });
    }
});

app.get('/renderer', function (request, response) {
    var i, f, renderers = [];
    fs.readdir(RENDERER_JS_DIR, function (err, files) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        for (i in files) {
            f = files[i];
            if (f.match(/^renderer\.\w+\.js$/)) {
                var name = files[i].split('.', 3)[1];
                renderers[renderers.length] = {
                    name: name,
                    filename: files[i],
                    example: iris.uri() + "/renderer/" + name
                };
            }
        }
        response.write(JSON.stringify(renderers));
        response.end();
    });
});

app.get('/renderer/:renderer', function (req, res) {
    if (req.params.renderer.match(/[^\s\w\d\.:\/]/)) {
        res.writeHead(400);
        res.end("Illegal URL format.");
        return;
    }
    if (req.params.renderer.match(/.js$/)) {
        var filename = RENDERER_JS_DIR + '/' + req.params.renderer;
        path.exists(filename, function (exists) {
            if (!exists) {
                fileNotFound(res);
            } else {
                fs.readFile(filename, function (err, data) {
                    res.writeHead(200);
                    res.write(data);
                    res.end();
                });
            }
        });
    } else {
        var basename = 'renderer.' + req.params.renderer + '.js';
        var filename = RENDERER_JS_DIR + '/' + basename;
        var httpPath = RENDERER_HTTPPATH + '/' + basename;
        path.exists(filename, function (exists) {
            if (!exists) {
                fileNotFound(res);
            } else {
                routes.renderer(req, res, {
                    js: httpPath, title: "Renderer",
                    name: req.params.renderer
                });
            }
        });
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
        var endpointPath = endpoint.paths[p];
        app.get(endpointPath + "*", function (req, res) {
            iris.httpGET(res, serviceName, req.url)
        })
    }
}

iris.startService();
