/**
 * A base class that handles the display of specific data.
 *
 * @class Renderer
 *
 * @example
 *     // Create instance
 *     var renderer = new Iris.Renderer({ foo: "bar" });
 *
 * @example
 *     // Extend Iris.Renderer
 *     var MyRenderer = Iris.Renderer.extend({
 *         render: function () {}
 *     });
 *     var renderer = new MyRenderer({ element: "#datavis" }); 
 *
 * @module iris
 */
define(["iris/root", "iris/util", "underscore"], function (Root, Util, _) {
    var renderer = {
        schema: { // uses revalidator.js to check args
            properties: {
                data:    { required: true, type: 'any' },
                element: { required: true, type: 'any' }
            }
        },
        defaults: {
            element: "body"
        },

        /**
         * Returns example data, used to demo renderer.
         * @method exampleData
         * @deprecated
         */
        exampleData: function () {
            console.log(this.about.name +
                ": exampleData() function not implemented");
        },

        setup: function (args) {
            // renderer specific initialization code such as loading css
        },

        /**
         * Renders a data visualization.
         * @method render
         * @param {Object} args Runtime rendering arguments.
         */
        render: function (args) {
            console.log(this.about.name +
                ": render() function not implemented");
        },

        /**
         * Updates the visualization. Used for handling changes to underlying
         * data.
         * @method update
         * @param {Object} args Runtime update arguments.
         */
        update: function (args) {
            console.log(this.about.name +
                ": update() function not implemented");
        },

        setData: function (data) {
            this.data = data;
        },

        /**
         * Get the data used for rendering.
         * @method getData
         * @return {object} data - The data
         */
        getData: function () {
            return this.data;
        },

        /**
         * Set renderer options.
         * @method set
         * @param {Object} args - key-value pair of options.
         */
        set: function (args) {
            
        },

        /**
         * Prepare for rendering.
         * @method prepare
         * @deprecated
         * @example
         *     // minimum usage
         *     renderer.render(renderer.prepare(args));
         * @param {Object} [args] Prepare arguments
         */
        prepare: function (args) {
            var renderer = this;
            args = (args || {});
            // extend args with default values
            _.defaults(args, renderer.defaults);
            // use example data if not defined
            if (args.data === null) {
                args.data = renderer.exampleData();
            }
            // validate args
            if (renderer.schema) {
                var check = Util.validate(args, renderer.schema);
                if (check.valid) {
                } else {
                    console.log("validation failed",check.errors);
                    throw Error(check.errors);
                }
            }
            // renderer specific initialization
            renderer.setup(args);
            return args;
        }
    };

    /**
     * @class Renderer
     * @constructor
     */
    return Root.extend(renderer);
});