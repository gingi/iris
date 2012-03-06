// RESTful interface around MongoDB interactions for Iris.

var iris   = require('./iris-base.js');
var config = iris.loadConfiguration();
var app    = iris.app;
var routes = iris.routes;

// Mongo
var Db = require('mongodb').Db,
    Connection = require('mongodb/lib/mongodb/connection/connection').Connection,
    Server = require('mongodb').Server;
var mongoHost = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var mongoPort = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;
var db = new Db('kbase_plants', new Server(mongoHost, mongoPort, {}), {
    native_parser: false
});

// Mongo fetches
app.get('/data/phenotypes/:phenotype', function(req, res) {
    db.open(function(err, db) {
        db.collection('arabidopsis2010_sample_phenotype', function(err, collection) {
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
                    if (doc != null) {
                        items.push(doc["phenotype_name"]);
                    }
                });
            });
        });
    });
});


iris.startService();