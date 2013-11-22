/**
 * @class Widget
 * 
 * Iris.Widget. A controller class for managing data and renderers for
 * visualization
 * 
 *     @example
 *     var MyWidget = Iris.Widget.extend({});
 *     var widget = new MyWidget();
 * 
 * Or:
 * 
 *     @example
 *     iris.require(["widget"], function (Widget) {
 *         var widget = Widget.extend({});
 *     });
 *
 * @extends Root
 * @singleton
 */
define(["iris/root"], function (Root) {
    return Root.extend({
        defaults: {
            element: "body"
        },
        /**
         * @method initialize
         * @inheritdoc Root#initialize
         */
        initialize: function (options) {
            this.element = options.element;
        }
        /**
         * @method register
         * @inheritdoc Root#register
         * @param {String} name The name of the widget
         * @param {Object} widget The widget to register
         */
    });
});
