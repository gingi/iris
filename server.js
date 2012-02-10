var IRIS_PORT = 4747;
var IRIS_HOME = __dirname + '/..';
var IRIS_BIN  = IRIS_HOME + '/bin';
var IRIS_DATA = IRIS_HOME + '/fastbit/data';

/**
 * Module dependencies.
 */

var express = require('express'), // web server
	Resource = require('express-resource'), // for resourceful routing
    routes = require('./routes'), // main page, info page, workspace, etc
    gzip = require('connect-gzip'), // sends gzipped responses 
    exec = require('child_process').exec, // for launching fastbit executables
    spawn = require('child_process').spawn, // same idea
    app = module.exports = express.createServer(gzip.gzip());

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

// look into using mongoose and/or mongodb for the metadata db
//    http://mongoosejs.com

// load data resources
app.resource('datatype', require('./data/type')); // use this to list all data types?
// replace these with a loop over the data types in the db (never edit this file)
// app.resource(dtype, require('./data/'+dtype));
app.resource('genome', require('./data/genome'));
app.resource('assembly', require('./data/assembly'));
app.resource('gwas', require('./data/gwas'));
app.resource('gene2GO', require('./data/gene2GO'));

// load widget resources
app.resource('widget', require('./widgets/widget')); // use this to list all widgets

// Routes for the various views
app.get('/', routes.index); // welcome page or the main app?
app.get('/about', routes.about);
app.get('/contact', routes.contact);

// load routes for the widgets
// each widget notifies the client (manager.js) of its routes through the resourceful routing above
// but the server needs to configure them too.
// Connect to the metadata db, fetch all the widget routes and set them up here...

// One missing link is some client side code that manages the widgets
// It needs to:
// 1. fetch the list of widgets (/widget index fn in widgets/widget.js)
// 2. fetch the various data types (/datatype index fn in data/type.js)
// 3. load user session info
// 4. populate the workspace based on session info and/or url - permalink?)
// 5. manage communication between widgets
// 6. expose valid relationships between widgets and data

// other useful features (scope creep here)
// widgets should be able to dump their data - as a URI?
// metadata browser
// widget browser
// user history

app.listen(IRIS_PORT);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
