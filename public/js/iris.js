/**
 * @class Iris
 * 
 * The Iris object.
 *
 * @singleton
 */
define(function (require) {
    var Core = {};

    /**
     * The Widget container
     * @property {Widget}
     */
    Core.Widget = require("iris/widget");

    /**
     * The Renderer container
     * @property {Renderer}
     */
    Core.Renderer = require("iris/renderer");

    return Core;
});