/**
 * @module root
 * Root class for all Iris classes
 */
define(["backbone", "underscore"], function (Backbone, _) {
    var Root = function (attributes, options) {
        attributes = attributes ? _.clone(attributes) : {};
        this.about = {};
        this.initialize.apply(this, arguments);
    };
    _.extend(Root.prototype, Backbone.Events, {
        initialize: function () {},
    });
    Root.extend = Backbone.View.extend;
    return Root;
});
