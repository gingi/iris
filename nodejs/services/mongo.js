// RESTful interface around MongoDB interactions for Iris.

var iris   = require('./service-base.js');
var config = iris.loadConfiguration();
var app    = iris.app;
var routes = iris.routes;

// Mongo
var Db = require('mongodb').Db,
    Connection = require('mongodb/lib/mongodb/connection/connection').Connection,
    Server = require('mongodb').Server;

if (!config.MONGO_DB) {
    console.log("config.MONGO_DB needs to be configured");
    return;
}

var store = new Db(
    config.MONGO_DB.name,
    new Server(
        config.MONGO_HOST || 'localhost',
        config.MONGO_PORT || Connection.DEFAULT_PORT, {}
    ),
    { native_parser: false }
);

// Mongo fetches

app.get('/collection/:collection/list', function (req, res) {
    store.open(function(err, db) {
        store.collection(req.params.collection, function(err, collection) {
            collection.find().toArray(function (err, items) {
                res.json(items);
                store.close();
            });
        });
    });    
});

app.get('/collection/:collection/keys', function(req, res) {
    var primaryKey = null;
    try {
        primaryKey = config.MONGO_DB.collections[req.params.collection].key;
    } catch (err) {
        res.json({ error: "Cannot find primary key for collection " + req.params.collection });
        return;
    }
    store.open(function(err, db) {
        store.collection(req.params.collection, function(err, collection) {
            collection.find({}, {}, function (err, cursor) {
                var items = [];
                cursor.each(function (err, doc) {
                    if (doc) {
                        items.push(doc[primaryKey]);
                    } else {
                        res.json(items);
                        store.close();
                    }
                });
            });
        });
    });
});

app.get('/collection/:collection/:identifier', function(req, res) {
    var field = req.params.field;
    var primaryKey = null;
    try {
        primaryKey = config.MONGO_DB.collections[req.params.collection].key;
    } catch (err) {
        res.json({ error: "Cannot find primary key for collection " + req.params.collection });
        return;
    }
    store.open(function(err, db) {
        store.collection(req.params.collection, function(err, collection) {
            var query = {};
            query[primaryKey] = req.params.identifier;
            collection.find(query, {}, function(err, cursor) {
                cursor.each(function(err, doc) {
                    if (doc === null) {
                        store.close();
                        res.end();
                    } else {
                        res.json(field ? doc[field] : doc);
                    }
                });
            });
        });
    });
});

iris.startService();