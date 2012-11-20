var iris = require('./service-base.js');
var app = iris.app;
iris.configureViews();
var routes = iris.routes;
var url = require('url');
var fs = require('fs');
var path = require('path');

var DOCSROOT =        path.join(iris.IRIS_HOME, 'public');
var JS_DIR =          path.join(DOCSROOT,       'js');
var RENDERER_JS_DIR = path.join(JS_DIR,         'renderers');
var WIDGET_JS_DIR   = path.join(JS_DIR,         'widgets');

var RENDERER_HTTPPATH = '/js/renderers';
var WIDGET_HTTPPATH = '/js/widgets';

var requirejs = require('requirejs');

function directoryContents(response, dir) {
    fs.readdir(dir, function (err, files) {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(files));
    });
}

// Routes
app.get('/', routes.index);

app.get('/about', function (req, res) {
    res.render('about', { title : 'About' });
});

app.get('/contact', function (req, res) {
    res.render('contact', { title : 'Contact Us'});
});

requirejs.define('iris', function () {
    var extendShim = { extend: function (obj) { return obj; } };
    return {
        Widget: extendShim,
        Renderer: extendShim
    };
});

// RequireJS shim for non-AMD dependencies
function shim(dependency) {
    requirejs.define(dependency, function () { return {} });
}

shim('d3');
requirejs.onError = function (error) {
    console.error("Parse error in widget " + error.moduleName);
    console.error("   Error:    " + error.originalError);
    console.error("   Filename: " + error.fileName);
};

app.get('/widget', function (request, response) {
	// list the widgets
});

function aboutModule(filename, key) {
    requirejs([filename], function (module) {
        iris.log(module.about);
    });
    return about;
}

app.get('/widget/:widget', function (req, res, next) {
    var layout = req.query.nolayout == null;
    var widgetName = req.params.widget;
    if (widgetName.match(/[^\s\w\d\.:\/]/)) {
        res.writeHead(400);
        res.end("Illegal URL format.");
        return;
    }
    if (widgetName.match(/.js$/)) {
        // Send the file
        var filename = path.join(WIDGET_JS_DIR, widgetName);
        fs.exists(filename, function (exists) {
            if (!exists) {
                res.send(404);
            } else {
                fs.readFile(filename, function (err, data) {
                    res.writeHead(200);
                    res.write(data);
                    res.end();
                });
            }
        });
    } else {
        // Check if widget exists
        var filename = path.join(WIDGET_JS_DIR, widgetName + '.js');
        fs.exists(filename, function (exists) {
            if (!exists)
                next();
            else
                routes.widget(req, res, { layout: layout, name: widgetName });
        });
    }
});

app.get('/renderer', function (request, response) {
	// list the renderers
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

app.get('/renderer/:renderer', function (req, res, next) {
    var layout = req.query.nolayout == null;
    var rendererName = req.params.renderer;
    if (rendererName.match(/[^\s\w\d\.:\/]/)) {
        res.writeHead(400);
        res.end("Illegal URL format.");
        return;
    }
    if (rendererName.match(/.js$/)) {
        // Send the file
        var filename = path.join(RENDERER_JS_DIR, rendererName);
        fs.exists(filename, function (exists) {
            if (!exists) {
                res.send(404);
            } else {
                fs.readFile(filename, function (err, data) {
                    res.writeHead(200);
                    res.write(data);
                    res.end();
                });
            }
        });
    } else {
        // Check if renderer exists
        var filename = path.join(RENDERER_JS_DIR, rendererName + '.js');
        fs.exists(filename, function (exists) {
            if (!exists)
                next();
            else
                routes.renderer(req, res, { layout: layout, name: rendererName });
        });
    }
});


app.get('/workspace', function (req, res) {
    var widgets = [];
	routes.workspace(req, res, widgets);
});

app.get('/simple', function (req, res) {
    res.render('simple', { title: "Simple Browser" });
});

// Proxy endpoints
// TODO: Every service sets up its own endpoints
for (var serviceName in iris.endpoints) {
    var endpoint = iris.endpoints[serviceName];
    for (var p = 0; p < endpoint.paths.length; p++) {
        var endpointPath = endpoint.paths[p];
        app.get(endpointPath + "*", proxyPath(serviceName));
    }
}

function proxyPath(serviceName) {
    return function (request, response) {
        iris.httpGET(response, serviceName, request.url);
    };
}

iris.startService();
