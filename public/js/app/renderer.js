define(["app/core","app/util"], function (Iris,Util) {
	var Renderer = Iris.Renderer = {
		about: {},
		exampleData: function () {},
		render: function (settings) {},
		prepare: function (settings) {
			var renderer = this;
			settings = (settings || {});
			if (renderer.about.defaults) {
				Util.extend(settings, renderer.about.defaults);
			}
			if (renderer.about.setDefaults) {
				Util.extend(settings, renderer.about.setDefaults());
			}
			if (renderer.about.schema != null) {
				var check = Util.validate(settings, renderer.about.schema);
				if (check['valid']) {
					console.log("automatic validation", renderer.about.name);
					return settings;
				} else {
					console.log("validation failed",check['errors']);
					throw Error(check['errors']);
				}
			}
			if (settings.data == null) {
				settings.data = renderer.exampleData();
			}
			return settings;
		}
    };
    return Renderer;
});