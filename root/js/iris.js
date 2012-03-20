/*
 * iris.js
 *
 * For now, just some utility functions shared by one or more widgets...
 *
 * Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
 */

if (!Iris) {
     var Iris = (function () {
        var dataServiceURI;
        var services = {};

        // FIXME: Does this really have to be synchronous?
        // With 'async: true', this gets evaluated after the rendering
        // --Shiran
        jQuery.ajax({
            url: "/service",
            dataType: 'json',
            async: false,
            success: function (service) {
                dataServiceURI = service.dataServiceURI;
            }
        });

        jQuery.getJSON("/service/list", function (services) {
            for (var i = 0; i < services.length; i++) {
                var service = services[i];
                services[service.path] = service.uri;
            }
        });
        
        function getJSON(path, callback) {
            var url = Iris.dataURI(path);
            $.ajax({
                url: url,
                dataType: 'json',
                data: [],
                success: callback,
                error: function (event, request, settings) {
                    console.warn("AJAX error! ", event, request, settings);
                }
            });
        };

        return {
            dataURI: function (path) { return dataServiceURI + path; },
            services: services,
            getJSON: getJSON,
        };
    })();
}