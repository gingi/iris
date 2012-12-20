var IRIS_HOME = __dirname + '/..';
var IRIS_BIN  = IRIS_HOME + '/external/snapdragon/bin';
var IRIS_DATA = IRIS_HOME + '/examples';

exports.Config = {
    APP_ADDRESS:     '127.0.0.1',
    SOCKET_HOST:     '127.0.0.1',
    BINDIR:          IRIS_BIN,
    FASTBIT_DATADIR: IRIS_DATA + "/fastbit",
    MONGO_DB: {
        name: 'phenotypes',
        collections: {
            'phenotypes': {
                key: 'phenotype_name'
            }
        }
    }
};
