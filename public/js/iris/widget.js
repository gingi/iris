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
 * @singleton
 */
define(["iris/root"], function (Root) {
    return Root.extend({
        defaults: {
            element: "body"
        },
        initialize: function (options) {
            this.element = options.element;
        }
    });
});
