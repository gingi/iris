/**
 * Root class for all Iris classes.
 *
 * @module iris/root
 */
define(["backbone", "underscore"], function (Backbone, _) {
    var Root = function (options) {
        this.options = options ? _.clone(options) : {};
        var args = _.toArray(arguments);
        if (this.defaults) {
            _.defaults(this.options, this.defaults);
            args[0] = this.options;
        }
        this.initialize.apply(this, args);
    };
    _.extend(Root.prototype, Backbone.Events, {
        initialize: function () {},
        about: {}
    });
    Root.extend = Backbone.View.extend;
    return Root;
});
