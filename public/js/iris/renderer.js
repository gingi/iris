/**
 * @class Renderer
 * @extends Root
 *
 * A base class that handles the display of specific data.
 *
 *     @example
 *     // Create instance
 *     var renderer = new Iris.Renderer({ foo: "bar" });
 * Or:
 *
 *     @example
 *     // Extend Iris.Renderer
 *     var MyRenderer = Iris.Renderer.extend({
 *         render: function () {}
 *     });
 *     var renderer = new MyRenderer({ element: "#datavis" }); 
 * 
 * @singleton
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
         * @method render
         * Renders a data visualization.
         * @param {Object} args Runtime rendering arguments.
         */
        render: function (args) {
            console.log(this.about.name +
                ": render() function not implemented");
        },

        /**
         * @method update
         * Updates the visualization. Used for handling changes to underlying
         * data.
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
         * @method getData
         * Get the data used for rendering.
         * @return {Object} The data
         */
        getData: function () {
            return this.data;
        },

        /**
         * @method set
         * Set renderer options.
         * @param {Object} args - key-value pair of options.
         */
        set: function (args) {
        }
        /**
         * @method register
         * @inheritdoc Root#register
         * @param {String} name The name of the renderer
         * @param {Object} renderer The renderer to register
         */
    };

    return Root.extend(renderer);
});