/**
 * @class Root
 * 
 * Root class for all Iris classes.
 * 
 * @singleton
 */
define(["backbone", "underscore"], function (Backbone, _) {
    /** 
     * @constructor
     * @param {Object} options Constructor options.
     */
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
        /**
         * @method initialize
         * Initializes the object. Invoked after constructor has already
         * processed parameters.
         */
        initialize: function () {},
        about: {}
    });

    /**
     * Extends the class.
     * @method extend
     * @param {Object} object
     *        A hash of functions and object that extend the class
     * @return {Object} A new subclass of this class.
     */
    Root.extend = Backbone.View.extend;
    return Root;
});
