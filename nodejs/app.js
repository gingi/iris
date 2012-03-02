/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    gzip = require('connect-gzip'),
    app = module.exports = express.createServer(gzip.gzip());

var config = require('./config.js').Config;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/../root'));
});

app.set('view options', { pretty: true });
app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


/* Widget configuration
 *
 * Associate widget name (key) with renderer (value)
 * Rendering JavaScript is assumed to be in DOCSROOT/js/widgets
 *
 * TODO: Move to MetaContainer?
 */
var widgets = {
    manhattan: 'manhattan.js',
    pcoords:    'pcoords.js',
    chord:       'chord.js',
	data: 'data.js',
	barChart: 'barChart.js'
};

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

app.listen(config.appPort);
console.log("service-address http://localhost:%d", app.address().port)
console.log("service-mode %s", app.settings.env);
