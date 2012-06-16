define(["src/util"], function (Util) {
	var Renderer = {};
    Renderer.extend = function (spec) {
        spec = (spec || {});
        var renderer = Util.extend({}, spec);
        Util.extend(renderer, Renderer);
        if (renderer.about.name) {
            Renderer[renderer.about.name] = renderer;
        }

        var tmpRender = renderer.render;
        renderer.render = function (settings) {
            settings = (settings || {});
            if (renderer.about) {
                if (renderer.about.defaults) {
                    Util.extend(settings, renderer.about.defaults);
                }
                if (renderer.about.setDefaults) {
                    Util.extend(settings, renderer.about.setDefaults());
                }
            }
            
            if (renderer.about.schema != null) {
                var check = Util.validate(settings, renderer.about.schema);
                if (check['valid']) {
                    console.log("automatic validation", renderer.about.name);
                    return tmpRender(settings);
                } else {
                    console.log(check['errors']);
                    return check['errors'];
                }
            }
            return tmpRender(settings);
        };
        return renderer;
    };
	return Renderer;
});