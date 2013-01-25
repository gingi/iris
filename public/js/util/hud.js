define(["jquery", "underscore"], function($, _) {
    var defaults = {
        position: { top: 20, left: 20 },
        element: "body"
    }
	function HUD(options) {
		var self = this;
        options = options ? _.clone(options) : {}; 
        _.defaults(options, defaults);
        var $hud = $("<div>").addClass("hud").css("display", "none");
        var $content = $("<div>").addClass("hud-content");
        function closeButton() {
            var button = $("<button>").addClass("close").html("&times;");
            button.on("click", function () { self.dismiss() });
            return button;
        }
        $hud.append(closeButton());
        $hud.append($content);
        for (var prop in options.position) {
            $hud.css(prop, options.position[prop]);
        }
        $(options.element).append($hud);
        if (options.width) { $hud.width(options.width) }
        $.extend(this, $content);
        
		self.show = function () {
		    $hud.fadeIn();
		}
        self.dismiss = function () {
            $hud.fadeOut();
            self.trigger("dismiss", []);
        }
		return self;
	}
	return HUD;
});