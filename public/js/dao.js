define(['api'], function (API) {
    var STORAGE_KEY = 'networks';
    var Data = function () {
        this.api = new API();
        this.writeToStorage();
        this.readFromStorage();
        this.indexData();
    };
    
    Data.prototype.updateFromServer = function (key, callback) {
        var self = this;
        var success = function (data) {
            self.networks[key] = data;
            self.indexData();
            if (callback) { callback(); }
        };
        var failure = function () {
            if (callback) { callback(); }
        }
        self.api.getNetwork(key, success, failure);
    };
    
    Data.prototype.readFromStorage = function () {
        try {
            var n = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
        } catch (e) {};
        this.networks = n || [];
    };
    
    Data.prototype.writeToStorage = function () {
        window.localStorage.setItem(STORAGE_KEY,
            JSON.stringify(this.networks)
        );
    };
    
    Data.prototype.indexData = function () {};
    
    Data.prototype.getNetwork = function (networkName) {
        return this.networks[networkName];
    };
    
    return Data;
});