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
var WIDGET_HTTPPATH = '/js/widgets';
var requirejs = require('requirejs');

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

function capitalize(word) {
    return word[0].toUpperCase() + word.slice(1);
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

function widgetList(startCallback, itemCallback, listCallback) {
    var i, file, name, widgets = [];
    fs.readdir(WIDGET_JS_DIR, function (err, files) {
        startCallback();
        var widgetPaths = {};
        for (i = 0; i < files.length; i++) {
            file = files[i];
            if (file.match(/^\./)) {
                continue;
            }
            var matches = file.match(/^widget\.(\w+)\.js$/);
            if (!matches) {
                continue;
            }
            var widgetName = matches[1];
            widgetPaths["widgets/" + widgetName] =
                "widgets/widget." + widgetName;
        }
        console.log(widgetPaths);
        requirejs.config({
            nodeRequire: require,
            baseUrl: JS_DIR,
            paths: widgetPaths,
        });
        for (w in widgetPaths) {
            requirejs([w], function (module) {
                widgets.push(itemCallback(widgetPaths[w], module.about));
            });
        }
        listCallback(widgets);
    });
}

app.get('/widget', function (request, response) {
    widgetList(
        function () {
            response.writeHead(200, { 'Content-Type': 'application/json' });
        },
        function (file, about) {
            return {
                name     : about.name,
                title    : about.title,
                example  : iris.uri() + '/widget/' + about.name
            };
        },
        function (widgets) {
            response.write(JSON.stringify(widgets));
            response.end();
        }
    );
});

function aboutModule(filename, key) {
    requirejs([filename], function (module) {
        console.log(module.about);
    });
    return about;
}

app.get('/widget/:widget', function (req, res) {
    var layout = req.query.layout !== null && req.query.layout == 'on';
    var widget;
    if (req.params.widget.match(/[^\s\w\d\.:\/]/)) {
        res.writeHead(400);
        res.end("Illegal URL format.");
        return;
    }
    if (req.params.widget.match(/.js$/)) {
        // Send the file
        var filename = WIDGET_JS_DIR + '/' + req.params.widget;
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
        var basename = 'widget.' + req.params.widget + '.js';
        var filename = WIDGET_JS_DIR + '/' + basename;
        var httpPath = WIDGET_HTTPPATH + '/' + basename;
        var name = req.params.widget;
        path.exists(filename, function (exists) {
            if (!exists) {
                fileNotFound(res);
            } else {
                routes.widget(req, res, {
                    title: "Some Title",
                    js: httpPath,
                    name: name,
                    layout: layout
                });
            }
        });
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
        // Send the file
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
        var name = req.params.renderer;
        path.exists(filename, function (exists) {
            if (!exists) {
                fileNotFound(res);
            } else {
                routes.renderer(req, res, {
                    js: httpPath, title: "Renderer",
                    name: name,
                });
            }
        });
    }
});

app.get('/workspace', function (req, res) {
    widgetList(
        function () {},
        function (file, about) {
            return {
                name    : about.name,
                title   : about.title,
                js      : WIDGET_HTTPPATH + "/" + file,
                example : iris.uri() + '/widget/' + about.name
            };
        },
        function (widgets) {
        	routes.workspace(req, res, widgets);
        }
    );
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
        app.get(endpointPath + "*", proxyPath(serviceName));
    }
}

function proxyPath(serviceName) {
    return function (request, response) {
        iris.httpGET(response, serviceName, request.url);
    };
}

iris.startService();
