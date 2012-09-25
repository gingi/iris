/*
* core.js
*
* Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
*/

define(["app/util", "app/framebuilder", "jquery"],
function (Util, FrameBuilder, jQuery) {
    var Iris = {};
    var dataServiceURI;
    var services = Iris.services = {};
    var Renderer = Iris.Renderer = {};
        
    Iris.init = function () {
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

		/* FIXME: How to handle this?		
		FrameBuilder.init({
			renderer_resources: [ '/renderer/' ],
			data_resources: [
				'http://dev.metagenomics.anl.gov/api_new.cgi'
			], 
			dataflow_resources: [
				 'http://dev.metagenomics.anl.gov/api_new.cgi/dataflow/'
			],
			library_resource: '/js/',
			widget_resources: [ '/widget/' ],
			layout: null,
			viewports: null
		});
		*/
    }
        
    Iris.dataURI = function (path) { return dataServiceURI + path; };
    Iris.getJSON = function (path, callback) {
        var url = Iris.dataURI(path);
        jQuery.ajax({
            url: url,
            dataType: 'json',
            data: [],
            success: callback,
            error: function (event, request, settings) {
                console.warn("AJAX error! ", event, request, settings);
            }
        });
    };

    /* ===================================================
     * Iris.Model
     */
    var Model = Iris.Model = {};
    Model.create = function (spec) {
        var model = {};
        Util.extend(model, observable());
        return model;
    };
    
	Iris.renderer = function (name) {
    	var rendObject = require(name);
    	
    	Util.extend(rendObject, {});
    	return rendObject.create();
    };
    
    Iris.extend = Util.extend;
    return Iris;
});
