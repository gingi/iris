// RESTful interface around MongoDB interactions for iris.

var iris   = require('./service-base.js');
var app    = iris.app;

// Mongo
var Db = require('mongodb').Db,
    Connection =
         require('mongodb/lib/mongodb/connection/connection').Connection,
    Server = require('mongodb').Server;

if (!iris.config.MONGO_DB) {
    iris.log("iris.config.MONGO_DB needs to be configured");
    return;
}

var store = new Db(
    iris.config.MONGO_DB.name,
    new Server(
        iris.config.MONGO_HOST || 'localhost',
        iris.config.MONGO_PORT || Connection.DEFAULT_PORT, {}
    ),
    { native_parser: false, safe: false }
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
        primaryKey =
             iris.config.MONGO_DB.collections[req.params.collection].key;
    } catch (err) {
        res.json({ error: "Cannot find primary key for collection " +
             req.params.collection });
        return;
    }
    store.open(function(err, db) {
        store.collection(req.params.collection, function(err, collection) {
            var fetchFields = {};
            fetchFields[primaryKey] = 1;
            collection.find({}, fetchFields, function (err, cursor) {
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
    var field = req.query.field;
    var slice;
    if (field) {
        slice = function (data) {
            return data[field];
        };
    } else {
        slice = function (data) { return data; };
    }
    var primaryKey = null;
    try {
        primaryKey =
             iris.config.MONGO_DB.collections[req.params.collection].key;
    } catch (err) {
        res.json({
            error: "Cannot find primary key for collection " +
                 req.params.collection
        });
        return;
    }
    store.open(function (err, db) {
        store.collection(req.params.collection, function (err, collection) {
            var query = {};        query[primaryKey] = req.params.identifier;
            var fetchFields = {};  fetchFields[field] = 1;
            collection.find(query, fetchFields, function (err, cursor) {
                cursor.each(function (err, doc) {
                    if (doc === null) {
                        store.close();
                        res.end();
                    } else {
                        res.json(slice(doc));
                    }
                });
            });
        });
    });
});

iris.startService();