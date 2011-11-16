
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
	, util = require('util')
	, http = require('http')
	, redis = require('redis')
	, exec = require('child_process').exec

var client = redis.createClient();
client.on("error", function(err) {
	console.log("error " + err);
});

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

// cache responses from remote http services 

no_redis = function(options,res) {
	http.get(options, function(response) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		util.pump(response,res);
	});
}

use_redis = function(options,res) {
	var key = options.host + options.path;
	client.get(key, function(err,cached) {
		if (cached) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(cached.toString());
		} else {
			http.get(options, function(response) {
				res.writeHead(200, {'Content-Type': 'application/json'});
				util.pump(response,res);
				var str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});
				response.on('end', function () {
					client.set(key, str);
				});	
			});
		}
	});	
}

// chromosome lengths for each species
var chromosomes = { at: '[[1,30427671],[2,19698289],[3,23459830],[4,18585056],[5,26975502]]' };

// Routes

app.get('/', routes.index);
app.get('/gwas', routes.select_study);
app.get('/gwas/:experiment/:study', function(req,res){
	routes.gwas(req.params.study, req.params.experiment, res);
});
app.get('/gwas/scores', routes.query_scores);

app.get('/chromosomes', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes['at']);
})

app.get('/chromosomes/:genome', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes[req.params.genome]);
})

app.get('/manhattanproxy/get_chromosomes', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes['at']);
});

app.post('/gwas/scores', function(req,res) {
	var data = '';
	req.addListener('data', function(chunk) { data += chunk; });
	req.addListener('end', function() {
		var jreq = JSON.parse(data);
		var cmd = 'exe/fbsql -s "' + jreq.select + '"';
		cmd += ' -d data/GWAS/' + jreq.study;
		if (jreq.study === "full_results") {
			cmd += '/' + jreq.id;
			if (jreq.where) {
				cmd += ' -w ' + jreq.where;
			}
		} else {
			cmd += ' -w "id=' + jreq.id + '"';
			if (jreq.where) {
				cmd += ' and ' + jreq.where;
			}
		}
		console.log(cmd);
		var fbsql = exec(cmd, function (error, stdout, stderr) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
	});
});

app.get('/gwas/scores/:study/:id', function(req,res) {
	var cmd = 'exe/fbsql -s "chr,min(score),max(score)" -d data/GWAS/' + req.params.study;
	if (req.params.study === "full_results") {
		cmd += '/' + req.params.id;
	} else {
		cmd += ' -w "id=' + req.params.id + '"';
	}

	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
	
});

app.get('/manhattanproxy/get_scores/:study/:id', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/run.pl?exe=fbsql&s=chr,min(score),max(score)'
			+ '&d=GWAS/' + req.params.study
			+ '&w=id=' + req.params.id
	};
	no_redis(options,res);
//		http.get(options, function(response) {
//			util.pump(response, res);
//		});
});

app.get('/manhattanproxy/get_coordinates/:bins/:study/:experiment/:chromosome', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/run.pl?exe=scatter&c1=pos&c2=score'
			+ '&b1='	+ req.params.bins
			+ '&b2='	+ req.params.bins
			+ '&d=GWAS/' + req.params.study
			+ '&w=id=' + req.params.experiment + '+and+chr=' + req.params.chromosome
	};
	no_redis(options,res);
	//	http.get(options, function(response) {
	//		util.pump(response, res);
	//	});
});

app.get('/manhattanproxy/get_all_points/:study/:experiment/:chromosome', function(req,res) {
	var options = {
		host: 'brie.cshl.edu',
		port: 80,
		path: '/~olson/qdv/web/run.pl?exe=fbsql&s=chr,pos,score'
			+ '&d=GWAS/' + req.params.study
			+ '&w=id=' + req.params.experiment + '+and+chr=' + req.params.chromosome
	};
	no_redis(options,res);
});

// define some routes to talk to fastbit executables
app.get('/fbsql/:select/GWAS/:from',function(req,res) {

	var cmd = 'exe/fbsql -d data/GWAS/'+req.params.from
		+ ' -s "' + req.params.select + '" -w "1=1"';
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.send(stdout);
	});
});

app.get('/fbsql/:select/GWAS/:from/:where',function(req,res) {
	var cmd = 'exe/fbsql -d data/GWAS/'+req.params.from
		+ ' -s "' + req.params.select + '" -w "' + req.params.where + '"';
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.send(stdout);
	});
});
app.get('/fbsql/:select/:from',function(req,res) {

	var cmd = 'exe/fbsql -d data/'+req.params.from
		+ ' -s "' + req.params.select + '" -w "1=1"';
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.send(stdout);
	});
});

app.get('/fbsql/:select/:from/:where',function(req,res) {
	var cmd = 'exe/fbsql -d data/'+req.params.from
		+ ' -s "' + req.params.select + '" -w "' + req.params.where + '"';
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.send(stdout);
	});
});

app.get('/scatterU/:from/:where/:etc', function(req,res) {
	var cmd = 'exe/scatterU -d data/GWAS/'+req.params.from
		+ ' -w "' + req.params.where + '" ' + req.params.etc;
		var scatter = exec(cmd, function (error, stdout, stderr) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
});

app.listen(3003);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
