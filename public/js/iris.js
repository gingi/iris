/**
 * @class Iris
 * 
 * The Iris object.
 *
 * @singleton
 */
define(function (require) {
    var Iris      = {};

    /**
     * The Widget container
     * @property {Widget}
     */
    Iris.Widget   = require('iris/widget');

    /**
     * The Renderer container
     * @property {Renderer}
     */
    Iris.Renderer = require('iris/renderer');

    return Iris;
});