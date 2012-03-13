/*
 * iris.js
 *
 * For now, just some utility functions shared by one or more widgets...
 *
 * Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
 */

var Iris = {};
Iris._dataServiceURI = undefined;

// FIXME: Does this really have to be synchronous?
// With 'async: true', this gets evaluated after the rendering
// --Shiran
jQuery.ajax({
    url: "/service",
    dataType: 'json',
    async: false,
    success: function (service) {
        Iris._dataServiceURI = service.dataServiceURI;
    }
});
Iris.dataURI = function (path) {
    return Iris._dataServiceURI + path;
}

jQuery.getJSON("/service/list", function (services) {
    Iris.services = {};
    for (var i = 0; i < services.length; i++) {
        var service = services[i];
        Iris.services[service.path] = service.uri;
    }
});

