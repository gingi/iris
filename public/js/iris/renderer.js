/**
 * Iris.Renderer. A base class that handles the display of specific data.
 *
 * @module iris/renderer
 */
define(["iris/root", "iris/util", "underscore"], function (Root, Util, _) {
    return Root.extend({
        schema: { // uses revalidator.js to check args
            properties: {
                data:    { required: true, type: 'any' },
                element: { required: true, type: 'any' }
            }
        },
        defaults: {
            // defaults extend args passed to other functions
        },
        setDefaults: function () {
             // defaults defined at run time
        },
        exampleData: function () {
            console.log(this.about.name + ": exampleData() function not implemented");
        },
        setup: function (args) {
            // renderer specific initialization code such as loading css
        },
        render: function (args) {
            console.log(this.about.name + ": render() function not implemented");
        },
        update: function (args) {
            console.log(this.about.name + ": update() function not implemented");
        },
        setData: function (data) {
            this.data = data;
        },
        getData: function () {
            return this.data;
        },
        // always call renderer.prepare() before calling renderer.render()
        // min usage: renderer.render(renderer.prepare(args));
        prepare: function (args) {
            var renderer = this;
            args = (args || {});
            // extend args with default values
            _.defaults(args, renderer.defaults);
            _.defaults(args, renderer.setDefaults());
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
    });
});