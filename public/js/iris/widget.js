/**
 * Iris.Widget. A controller class for managing data and renderers for
 * visualization
 *
 * @module iris/widget
 */
define(["iris/root"], function (Root) {
    return Root.extend({
        /** Widget defaults */
        defaults: {
            element: "body"
        },
        initialize: function (options) {
            this.element = options.element;
        }
    });
});
