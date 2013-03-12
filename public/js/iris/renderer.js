define(["iris/root", "iris/util"], function (Root, Util) {
    function Renderer() {};
    Renderer.prototype = {
        constructor: Renderer,
        about: {
            name: "base",
            author: "shanje",
            description: "Renderer base class"
        },
        schema: { // uses revalidator.js to check settings
            properties: {
                data: { required: true, type: 'any' },
                element: { required: true, type: 'any' }
            }
        },
        defaults: {
            // defaults extend settings passed to other functions
        },
        setDefaults: function () {
             // defaults defined at run time
        },
        exampleData: function () {
            console.log(this.about.name + ": exampleData() function not implemented");
        },
        setup: function (settings) {
            // renderer specific initialization code such as loading css
        },
        render: function (settings) {
            console.log(this.about.name + ": render() function not implemented");
        },
        update: function (settings) {
            console.log(this.about.name + ": update() function not implemented");
        },
        // always call renderer.prepare() before calling renderer.render()
        // min usage: renderer.render(renderer.prepare(settings));
        prepare: function (settings) {
            var renderer = this;
            settings = (settings || {});
            // extend settings with default values
            Util.extend(settings, renderer.defaults);
            Util.extend(settings, renderer.setDefaults());
            // use example data if not defined
            if (settings.data == null) {
                settings.data = renderer.exampleData();
            }
            // validate settings
            if (renderer.schema) {
                var check = Util.validate(settings, renderer.schema);
                if (check['valid']) {
                } else {
                    console.log("validation failed",check['errors']);
                    throw Error(check['errors']);
                }
            }
            // renderer specific initialization
            renderer.setup(settings);
            return settings;
        }
    };
    return Renderer;
});