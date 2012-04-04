var iris   = require('./service-base.js');
var config = iris.config;
var app    = iris.app;
var exec   = require('child_process').exec;
var spawn  = require('child_process').spawn;

// Mongo
var Db = require('mongodb').Db,
    Connection = require('mongodb/lib/mongodb/connection/connection').Connection,
    Server = require('mongodb').Server;
var mongoHost = config.MONGO_HOST != null ? config.MONGO_HOST : 'localhost';
var mongoPort = config.MONGO_PORT != null ? config.MONGO_PORT : Connection.DEFAULT_PORT;
var db = new Db('phenotypes', new Server(mongoHost, mongoPort, {}), {
    native_parser: false
});

// chromosome lengths for each species
var chromosomes = {
    at: '[[1,30427671],[2,19698289],[3,23459830],[4,18585056],[5,26975502]]'
};

// Routes
app.get('/data/chrlen', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(chromosomes[req.query["species"]]);
});

// GWAS routes
/*
	/data/GWAS/:study	- list all study ids
	/data/GWAS/:study/maxscore
	/data/GWAS/:study/scatter
	/data/GWAS/:study/scatter_nobinning
*/

app.get('/data/GWAS/:study', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.send("[3396]");
});

app.get('/data/GWAS/:study/maxscore', function(req, res) {
    var cmd = config.binDir + '/fbsql -s "max(score)" -d ' + config.dataDir + '/GWAS/' + req.params.study;
    console.log(cmd);
    var fbsql = exec(cmd, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

// scatterplot rectangles for a GWAS study on given chromosome with at most b1 x b2 boxes
app.get('/data/GWAS/:study/scatter', function(req, res) {
    var cmd = config.binDir + '/scatter -d ' + config.dataDir + '/GWAS/' + req.params.study + '/' + req.query["chr"] + ' -c1 pos -c2 score' + ' -n1 0 -n2 0' + ' -b1 ' + req.query["b1"] + ' -b2 ' + req.query["b2"] + ' -x1 ' + req.query["x1"] + ' -x2 ' + req.query["x2"];
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

// scatterplot for GWAS study with no binning
app.get('/data/GWAS/:study/scatter_nobinning', function(req, res) {
    var cmd = config.binDir + '/fbsql -s "pos,score" -d ' + config.dataDir + '/GWAS/' + req.params.study + '/' + req.query["chr"];
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


// Mongo fetches
app.get('/data/phenotypes/:phenotype', function(req, res) {
    db.open(function(err, db) {
        db.collection('phenotypes', function(err, collection) {
            collection.find({
                'phenotype_name': req.params.phenotype
            }, {
                'phenotype_values': 1
            }, function(err, cursor) {

                cursor.each(function(err, doc) {
                    if (doc === null) {
                        db.close();
                        res.end();
                    }
                    if (doc != null) {
                        res.writeHead(200, {
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify(doc["phenotype_values"]));
                    }
                });
            });
        });
    });
});

app.get('/data/phenotypes', function(req, res) {
    var items = [];
    db.open(function(err, db) {
        db.collection('phenotypes', function(err, collection) {
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
                    if (doc != null) {
                        items.push(doc["phenotype_name"]);
                    }
                });
            });
        });
    });
});

// GO term histogram (all genes)
app.get('/histogram/GO', function(req, res) {
    var cmd = config.binDir + '/fbsql -s "GO_term,count(*)" -d ' + config.dataDir + '/gene2GO';
    console.log(cmd);
    var fbsql = exec(cmd, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

// GO term histogram for a GWAS study (all snps)
app.get('/histogram/GO/GWAS/:study', function(req, res) {
    var cmd = config.binDir + '/gwas2go -d ' + config.dataDir + ' -s ' + req.params.study;
    console.log(cmd);
    var join = exec(cmd, function(err, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

// GO term histogram for a GWAS study where snps are filtered by pos or score
app.get('/histogram/GO/GWAS/:study/:where', function(req, res) {
    var cmd = config.binDir + '/gwas2go -d ' + config.dataDir + ' -s ' + req.params.study + ' -w "' + req.params.where + '"';
    console.log(cmd);
    var join = exec(cmd, function(err, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

app.get('/gene2GWAS', function(req, res) {
    var cmd = config.binDir + '/fbsql -d ' + config.dataDir + '/GWAS_snp_consequences -s "study_id,gene_stable_id,max(score)"';
	console.log(cmd);
    var fbsql = exec(cmd, {
        maxBuffer: 10000 * 1024
    }, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

app.get('/gene2GWAS/:gene_id', function(req, res) {
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

app.get('/data/:d/pcoords', function(req, res) {
    var cmd = config.binDir + '/scatter -a 1 -d ' + config.dataDir + '/' + req.params.d + ' -b1 ' + req.query["b1"] + ' -b2 ' + req.query["b2"] + ' -c1 ' + req.query["c1"] + ' -c2 ' + req.query["c2"] + ' -n1 ' + req.query["n1"] + ' -n2 ' + req.query["n2"] + ' -x1 ' + req.query["x1"] + ' -x2 ' + req.query["x2"];
    if (req.query["w"]) {
        cmd = cmd + ' -w "' + req.query["w"] + '"';
    }

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

app.get('/data/:d/ranges', function(req, res) {
    var cmd = config.binDir + "/ranges -d " + config.dataDir + "/" + req.params.d;
    console.log(cmd);
    var ranges = exec(cmd, function(error, stdout, stderr) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(stdout);
    });
});

iris.startService();