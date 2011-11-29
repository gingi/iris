
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , gzip = require('connect-gzip')
  , exec = require('child_process').exec
  , spawn = require('child_process').spawn;

var app = module.exports = express.createServer(gzip.gzip());

// For Mongo
var Db = require('mongodb').Db, 
Connection = require('./node_modules/mongodb/lib/mongodb/connection/connection').Connection, 
Server = require('mongodb').Server;
var mongoHost = "localhost";
var mongoPort = Connection.DEFAULT_PORT;
var db = new Db('kbase_plants', new Server(mongoHost, mongoPort, {}), {native_parser:false});


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

app.set('view options', { pretty: true })
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
app.get('/GWAS/:study', function(req,res) {
	routes.gwas(req.params.study, res);
});

app.get('/GWAS/allpoints/:study', function(req,res) {
	routes.allpoints(req.params.study, res);
});

app.get('/chromosomes', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes['at']);
});

app.get('/chromosomes/:genome', function(req,res) {
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(chromosomes[req.params.genome]);
});

app.get('/maxscore/GWAS/:study', function(req,res) {
	var cmd = '../fastbit/src/fbsql -s "max(score)" -d ../fastbit/data2/GWAS/'+req.params.study;
	console.log(cmd);
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

// Mongo fetches

app.get ('/phenotypes/:phenotype', function(req,res){
   db.open(function(err, db) {
        db.collection('arabidopsis2010_sample_phenotype', function(err, collection) {    
          collection.find({'phenotype_name':req.params.phenotype}, {'phenotype_values':1}, function(err, cursor) {
            res.writeHead(200, {'Content-Type': 'application/json'});
  			cursor.each(function(err, doc) {
  				if (doc === null) {
  					db.close();  					
  				}
  				if (doc != null ){
  				    res.end(JSON.stringify(doc["phenotype_values"]));
			    }
  			});   			
          });
        });
   });  
});

app.get ('/phenotypes/', function(req,res){
    var items=[];
   db.open(function(err, db) {
        db.collection('arabidopsis2010_sample_phenotype', function(err, collection) {    
          collection.find({}, {'phenotype_name':1}, function(err, cursor) {
            res.writeHead(200, {'Content-Type': 'application/json'});
  			cursor.each(function(err, doc) {
  				if (doc === null) {
  					res.end(JSON.stringify(items));
  					db.close();  					
  				}	
  			    if (doc != null){
  				    items.push(doc["phenotype_name"]);
			    }
  			});   			
          });
        });
   });  
});
// GO term histogram (all genes)
app.get('/histogram/GO', function(req,res) {
		var cmd = '../fastbit/src/fbsql -s "GO_term,count(*)" -d ../fastbit/data2/gene2GO';
	console.log(cmd);
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

// GO term histogram for a given set of genes
app.post('/histogram/GO', function(req,res) {
	res.send(req.body);
});

// GO term histogram for a GWAS study (all snps)
app.get('/histogram/GO/GWAS/:study', function(req,res) {
	var cmd = '../fastbit/src/gwas2go -d ../fastbit/data -s '
		+ req.params.study;
	console.log(cmd);
	var join = exec(cmd, function(err,stdout,stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

// GO term histogram for a GWAS study where snps are filtered by pos or score
app.get('/histogram/GO/GWAS/:study/:where', function(req,res) {
	var cmd = '../fastbit/src/gwas2go -d ../fastbit/data -s '
		+ req.params.study
		+ ' -w "' + req.params.where + '"';
	console.log(cmd);
	var join = exec(cmd, function(err,stdout,stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

// GO term histogram given a minimum association score
app.get('/histogram/GO/phenotypes/:minscore',function(req,res) {
	res.send("minscore:"+req.params.minscore);
});
// phenotype histogram given a list of GO terms

app.post('/histogram/phenotypes/GO',function(req,res) {
	res.send(req.body);
});

// phenotype histogram given a minimum association score
app.get('/histogram/phenotypes/:minscore', function(req,res) {
	res.send("minscore:"+req.params.minscore);
});

app.get('/gene2GWAS/:gene_id', function(req,res) {
	var cmd = '../fastbit/src/fbsql -d ../fastbit/data/gene2GWAS -s "study_id,score" -w "gene_id='+req.params.gene_id+'"';
	var fbsql = exec(cmd, function (error, stdout, stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});	
});

// scatterplot rectangles for a GWAS study on given chromosome with at most b1 x b2 boxes
app.get('/scatter/GWAS/:study/:chr/:b1/:b2', function(req,res) {
	var cmd = '../fastbit/src/scatter_new -c1 pos -c2 score -d ../fastbit/data2/GWAS/' + req.params.study
		+ '/' + req.params.chr + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2;
		console.log(cmd);
		var scatter = exec(cmd, function (error, stdout, stderr) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
});
app.get('/scatter/GWAS/:study/:chr/:b1/:b2/:f/:n1/:x1/:n2/:x2/:m', function(req,res) {
	var cmd = '../fastbit/src/scatter_new -c1 pos -c2 score -d ../fastbit/data2/GWAS/' + req.params.study
		+ '/' + req.params.chr + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2
		+ ' -n1 ' + req.params.n1 + ' -n2 ' + req.params.n2
		+ ' -x1 ' + req.params.x1 + ' -x2 ' + req.params.x2
		+ ' -f ' + req.params.f + ' -m ' + req.params.m;
		console.log(cmd);
		var scatter = exec(cmd, {maxBuffer:10000*1024},function (error, stdout, stderr) {
            res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
});

// scatterplot for GWAS study with no binning
app.get('/scatter/GWAS/nobinning/:study/:chr', function(req,res) {
	var cmd = '../fastbit/src/fbsql -s "pos,score" -d ../fastbit/data2/GWAS/' + req.params.study + '/' + req.params.chr;
	console.log(cmd);
	var scatter = exec(cmd,{maxBuffer:10000*1024},function(error, stdout,stderr) {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(stdout);
	});
});

app.post('/scatter', function(req,res) {
	res.send(req.body);
});

// scatterplot for any partition comparing c1 to c2 with additional args taken from etc
app.get('/scatter/:partition/:c1/:c2/:etc', function(req,res) {
	var cmd = '../fastbit/src/scatter_new -d ../fastbit/data2/' + req.params.partition
		+ ' -c1 ' + req.params.c1 + ' -c2 ' + req.params.c2
		+ ' ' + req.params.etc;
		console.log(cmd);
		var scatter = exec(cmd, function (error, stdout, stderr) {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(stdout);
		});
});

// testing jquery-fastbit
app.get('/jquery/fastbit',routes.jquery_fastbit);

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
