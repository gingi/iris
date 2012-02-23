/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    gzip = require('connect-gzip'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    app = module.exports = express.createServer(gzip.gzip());

var config = require('./config.js').Config;

// Mongo
var Db = require('mongodb').Db, 
Connection = require('./node_modules/mongodb/lib/mongodb/connection/connection').Connection, 
Server = require('mongodb').Server;
var mongoHost = Connection.DEFAULT_HOST;
var mongoPort = Connection.DEFAULT_PORT;
var db = new Db('iris', new Server(mongoHost, mongoPort, {}), {native_parser:false});


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

// chromosome lengths for each species
var chromosomes = {
    at: '[[1,30427671],[2,19698289],[3,23459830],[4,18585056],[5,26975502]]'
};

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
		data: 'data.js'
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

app.get('/pcoords/:table', function(req,res) {
	routes.pcoords(req.params.table, res);
});

// app.get('/widgets/:widget', function(req,res) {
app.get('/GWAS/:study', function(req,res) {
    routes.gwas(req.params.study);
});

app.get('/GWAS/allpoints/:study', function(req,res) {
	routes.allpoints(req.params.study, res);
});

app.get('/data/chrlen', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
});
    res.end(chromosomes[req.query["species"]]);
});

app.get('/data/maxscore/GWAS/:study', function(req,res) {
    var cmd = config.binDir + '/fbsql -s "max(score)" -d ' + config.dataDir + '/GWAS/' + req.params.study;
	console.log(cmd);
	var fbsql = exec(cmd, function (error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});
});

// Mongo fetches
app.get ('/data/phenotypes/:phenotype', function(req,res){
   db.open(function(err, db) {
        db.collection('arabidopsis2010_sample_phenotype', function(err, collection) {    
            collection.find({
                'phenotype_name': req.params.phenotype
            }, {
                'phenotype_values': 1
            }, function(err, cursor) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
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

app.get ('/data/phenotypes', function(req,res){
    var items=[];
   db.open(function(err, db) {
        db.collection('arabidopsis2010_sample_phenotype', function(err, collection) {    
            collection.find({}, {
                'phenotype_name': 1
            }, function(err, cursor) {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                });
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
    var cmd = config.binDir + '/fbsql -s "GO_term,count(*)" -d ' + config.dataDir + '/gene2GO';
	console.log(cmd);
	var fbsql = exec(cmd, function (error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});
});

// GO term histogram for a given set of genes
app.post('/histogram/GO', function(req,res) {
	res.send(req.body);
});

// GO term histogram for a GWAS study (all snps)
app.get('/histogram/GO/GWAS/:study', function(req,res) {
    var cmd = config.binDir + '/gwas2go -d ' + config.dataDir + ' -s ' + req.params.study;
	console.log(cmd);
	var join = exec(cmd, function(err,stdout,stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});
});

// GO term histogram for a GWAS study where snps are filtered by pos or score
app.get('/histogram/GO/GWAS/:study/:where', function(req,res) {
    var cmd = config.binDir + '/gwas2go -d ' + config.dataDir + ' -s ' + req.params.study + ' -w "' + req.params.where + '"';
	console.log(cmd);
	var join = exec(cmd, function(err,stdout,stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
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

app.get('/gene2GWAS', function(req,res) {
    var cmd = config.binDir + '/fbsql -d ' + config.dataDir + '/GWAS_snp_consequences -s "study_id,gene_stable_id,max(score)"';
    var fbsql = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});	
});

app.get('/gene2GWAS/:gene_id', function(req,res) {
    var cmd = config.binDir + '/fbsql -d ' + config.dataDir + '/GWAS_snp_consequences -s "study_id,max(score)" -w "gene_id=' + req.params.gene_id + '"';
    var fbsql = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});	
});

// scatterplot rectangles for a GWAS study on given chromosome with at most b1 x b2 boxes
app.get('/data/scatter/GWAS/:study/:chr/:b1/:b2', function(req,res) {
    var cmd = config.binDir + '/scatter_new -c1 pos -c2 score -d ' + config.dataDir + '/GWAS/' + req.params.study + '/' + req.params.chr + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2;
		console.log(cmd);
		var scatter = exec(cmd, function (error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
			res.end(stdout);
		});
});
app.get('/data/scatter/GWAS/:study/:chr/:b1/:b2/:n1/:x1/:n2/:x2', function(req,res) {
    var cmd = config.binDir + '/scatter -c1 pos -c2 score -d ' + config.dataDir + '/GWAS/' + req.params.study + '/' + req.params.chr + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2 + ' -n1 ' + req.params.n1 + ' -n2 ' + req.params.n2 + ' -x1 ' + req.params.x1 + ' -x2 ' + req.params.x2;
		console.log(cmd);
    var scatter = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
			res.end(stdout);
		});
});

app.get('/data/pcoords/:d/:c1/:c2/:b1/:b2/:n1/:x1/:n2/:x2', function(req,res) {
    var cmd = config.binDir + '/scatter -a 1 -d ' + config.dataDir + '/' + req.params.d + ' -b1 ' + req.params.b1 + ' -b2 ' + req.params.b2 + ' -c1 ' + req.params.c1 + ' -c2 ' + req.params.c2 + ' -n1 ' + req.params.n1 + ' -n2 ' + req.params.n2 + ' -x1 ' + req.params.x1 + ' -x2 ' + req.params.x2;
		console.log(cmd);
    var scatter = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
			res.end(stdout);
		});
});

app.get('/data/ranges/:d', function(req,res) {
    var cmd = "../fastbit/src/ranges -d ' + config.dataDir + '/" + req.params.d;
	console.log(cmd);
	var ranges = exec(cmd, function(error,stdout,stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	})
});

// scatterplot for GWAS study with no binning
app.get('/data/scatter/GWAS/nobinning/:study/:chr', function(req,res) {
    var cmd = config.binDir + '/fbsql -s "pos,score" -d ' + config.dataDir + '/GWAS/' + req.params.study + '/' + req.params.chr;
	console.log(cmd);
    var scatter = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
		res.end(stdout);
	});
});

app.post('/data/scatter', function(req,res) {
	res.send(req.body);
});

// scatterplot for any partition comparing c1 to c2 with additional args taken from etc
app.get('/data/scatter/:partition/:c1/:c2/:etc', function(req,res) {
    var cmd = config.binDir + '/scatter_new -d ' + config.dataDir + '/' + req.params.partition + ' -c1 ' + req.params.c1 + ' -c2 ' + req.params.c2 + ' ' + req.params.etc;
		console.log(cmd);
		var scatter = exec(cmd, function (error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
			res.end(stdout);
		});
});

// testing jquery-fastbit
app.get('/jquery/fastbit',routes.jquery_fastbit);

app.listen(config.appPort);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
