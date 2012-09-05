define(function (require) {
	var Iris         = require('src/core');
	Iris.Widget      = require('src/widget');
	Iris.Renderer    = require('src/renderer');
	Iris.Event       = require('src/event');
	Iris.init();
	return Iris;
});