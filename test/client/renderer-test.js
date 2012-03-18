var target  = __dirname + '/../../root/js/widgets/widget.js';
var documentStub = require(__dirname + '/stubs.js').documentStub;
var sandbox = require('nodeunit').utils.sandbox;
var context = sandbox(target, { console: console, document: documentStub });
var Iris    = context.Iris;
