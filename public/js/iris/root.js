/**
 * Root class for all Iris classes.
 *
 * @module iris/root
 */
define(["backbone", "underscore"], function (Backbone, _) {
    var Root = function (attributes, options) {
        attributes = attributes ? _.clone(attributes) : {};
        this.initialize.apply(this, arguments);
    };
    _.extend(Root.prototype, Backbone.Events, {
        initialize: function () {},
        about: {}
    });
    Root.extend = Backbone.View.extend;
    return Root;
});
