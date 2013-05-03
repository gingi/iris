/**
 * A base class that handles the display of specific data.
 *
 * @module iris/renderer
 *
 * @example
 * // Create instance
 * var renderer = new Iris.Renderer({ foo: "bar" });
 *
 * @example
 * // Extend Iris.Renderer
 * var MyRenderer = Iris.Renderer.extend({
 *     render: function () {}
 * });
 * var renderer = new MyRenderer({ element: "#datavis" }); 
 */
define(["iris/root", "iris/util", "underscore"], function (Root, Util, _) {
    /**
     * @constructor
     * @alias module:iris/renderer
     */
    var renderer = {
        schema: { // uses revalidator.js to check args
            properties: {
                data:    { required: true, type: 'any' },
                element: { required: true, type: 'any' }
            }
        },
        /** Renderer defaults */
        defaults: {
            element: "body"
        },

        /**
         * Returns example data, used to demo renderer.
         * @instance
         * @virtual
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
         * @instance
         * @abtract
         * @param {hash} args - Runtime rendering arguments.
         */
        render: function (args) {
            console.log(this.about.name +
                ": render() function not implemented");
        },

        /**
         * Updates the visualization. Used for handling changes to underlying
         * data.
         * @instance
         * @virtual
         * @param {hash} args - runtime update arguments.
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
         * @instance
         * @return {object} data - The data
         */
        getData: function () {
            return this.data;
        },

        /**
         * Set renderer options.
         * @instance
         * @param {hash} args - key-value pair of options.
         */
        set: function (args) {
            
        },

        /**
         * Prepare for rendering.
         * @instance
         * @deprecated
         * @example
         * // min usage
         * renderer.render(renderer.prepare(args));
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

    return Root.extend(renderer);
});