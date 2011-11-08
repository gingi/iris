
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
	, util = require('util')
	, http = require('http')
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/gwas', routes.select_study);
app.get('/gwas/:study([0-9]+)', function(req,res) {
	routes.gwas(req.params.study,res);
});
app.get('/manhattanproxy/get_chromosomes', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/chr_list.pl?g=at'
	};
	http.get(options, function(response) {
		util.pump(response, res);
	});
});

app.get('/manhattanproxy/get_scores/:study/:id', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/run.pl?exe=fbsql&s=chr,min(score),max(score)'
			+ '&d=GWAS/' + req.params.study
			+ '&w=id=\''+req.params.id+'\''
	};
	http.get(options, function(response) {
		util.pump(response, res);
	});
});
app.get('/manhattanproxy/get_coordinates/:bins/:study/:experiment/:chromosome', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/run.pl?exe=get2DDist&c1=pos&c2=score'
			+ '&b='	+ req.params.bins
			+ '&d=GWAS/' + req.params.study
			+ '&w=id=\'' + req.params.experiment + '\'+and+chr=' + req.params.chromosome
	};
	http.get(options, function(response) {
		util.pump(response, res);
	});
});



app.listen(3003);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
