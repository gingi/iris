
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
	, exec = require('child_process').exec

var app = module.exports = express.createServer();


//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
}

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
	app.use(allowCrossDomain);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// chromosome lengths for each species
var chromosomes = { at: '[[1,30427671],[2,19698289],[3,23459830],[4,18585056],[5,26975502]]' };

// Routes

app.get('/', routes.index);

app.get('/chromosomes', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes['at']);
});

app.get('/chromosomes/:genome', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes[req.params.genome]);
});

app.get('/histogram/GO', function(req,res) {
	var cmd = '../fastbit/fbsql -s "GO_term,count(*)" -d ../fastbit/data/ath_GO'
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

app.get('/histogram/GO/GWAS/:study/:where', function(req,res) {
	var cmd = '../fastbit/join_once -d1 ../fastbit/data/GWAS/full_results/'
		+ req.params.study + ' -d2 ../fastbit/data/ath_GO -s1 "gene_id,count(*)"'
		+ ' -s2 "GO_term,count(*)" -j gene_id -w1 "' + req.params.where + '"';
	var join = exec(cmd, function (err, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

app.get('/scatter/GWAS/:study/:chr/:b1/:b2', function(req,res) {
	var cmd = '../fastbit/scatter -c1 pos -c2 score -d ../fastbit/data/GWAS/full_results/' + req.params.study
		+ '/' + req.params.chr + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2;
		var scatter = exec(cmd, function (error, stdout, stderr) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
});

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
