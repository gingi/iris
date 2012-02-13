var IRIS_PORT = 4747;
var IRIS_HOME = __dirname + '/..';
var IRIS_BIN  = IRIS_HOME + '/bin';
var IRIS_DATA = IRIS_HOME + '/fastbit/data';

/**
 * Module dependencies.
 */

var express = require('express'), // web server
    routes = require('./routes'), // main page, info page, workspace, etc
    gzip = require('connect-gzip'), // sends gzipped responses 
    exec = require('child_process').exec, // for launching fastbit executables
    spawn = require('child_process').spawn, // same idea
    app = module.exports = express.createServer(gzip.gzip()),
		Db = require('mongodb').Db,
		Connection = require('mongodb').Connection,
		Server = require('mongodb').Server;

// Configuration
app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/../root'));
});

app.set('view options', { pretty: true });
app.configure('development', function() {
  app.use(express.errorHandler({
	        dumpExceptions: true,
	        showStack: true
	    }));
});

app.configure('production', function() {
   app.use(express.errorHandler());
});


// initialize the mongo db connection
var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var db = new Db('iris', new Server(host, port, {}));

// route to list all data types
app.get('/data', function(req,res) {
	db.collection('data_types',function(err,collection) {
		collection.find({}).toArray(function(err, dtypes) {
			res.json(dtypes);
		});
	});
});
// routes to add/edit data types - deferred admin/power user feature

// route to get a specific data type
app.get('/data/:dtype', function(req,res) {
	db.collection('data_types', function(err,collection) {
		collection.find({_type_id: req.params.dtype}).toArray(function(err, dtypes) {
			res.json(dtypes);
		});
	});
});

// route to get metadata of a given type
app.get('/data/:dtype/:meta_id', function(req,res) {
	db.collection('metadata', function(err,collection) {
		collection.find({_type_id: req.params.dtype, _meta_id: req.params.meta_id}).toArray(function(err,meta) {
			res.json(meta);
		});
	});
});

// route to list all widgets
app.get('/widget', function(req,res) {
	db.collection('widgets',function(err,collection) {
		collection.find({}).toArray(function(err, widgets) {
			res.json(widgets);
		});
	});
});
// routes to add/edit widgets - deferred admin/power user feature
// route to get a specific widget
app.get('/widget/:widget', function(req,res) {
	db.collection('widgets', function(err, collection) {
		collection.find({_widget_id: req.params.widget}).toArray(function(err,widget) {
			res.json(widget);
		});
	});
});

db.open(function(err,p_client) {
	if (err) {new Error(err);}
	// routes to initialize widgets
	db.collection('widgets', function(err, collection) {
	 	collection.find({}).each(function(err, widget) {
			if (widget != null) {
				console.log(widget);
				widget._routes.each(function(err, route_obj) {
					app.get('/widget/:widget/'+route_obj.path, route_obj.fn(req,res));
				});
			} else {
				// done or none
			}
		});
	});
});


// Routes for the various views
app.get('/', routes.index); // welcome page or the main app?
app.get('/about', routes.about);
app.get('/contact', routes.contact);

app.listen(IRIS_PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
