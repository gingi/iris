define(function (require) {
	var Iris         = require('app/core');
	Iris.Widget      = require('app/widget');
	Iris.Renderer    = require('app/renderer');
	Iris.Event       = require('app/event');
    
	Iris.init();
    
	return Iris;
});