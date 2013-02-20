define(["jquery", "underscore"], function($, _) {
    var defaults = {
        position: { top: 20, left: 20 },
        element: "body",
        width: 300,
        height: 50,
        close: true
    }
	function HUD(options) {
		var self = this;
        options = options ? _.clone(options) : {}; 
        _.defaults(options, defaults);
        var $hud = $("<div>").addClass("hud")
            .css("width", options.width)
            .css("min-height", options.height)
            .css("display", "none");
        if (options.z != undefined) { $hud.css("z-index", options.z) };
        var $content = $("<div>").addClass("hud-content");
        if (options.close) {
            function closeButton() {
                var button = $("<button>").addClass("close").html("&times;");
                button.on("click", function () { self.dismiss() });
                return button;
            }
            $hud.append(closeButton());
        }
        if (options.title) {
            $hud.append($("<h4>", { id: "title" }).text(options.title));
        } else {
            $content.css("margin", "15px 0 0").css("padding", 0);
        }
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
            $hud.fadeOut()  ;
            self.trigger("dismiss", []);
        };
		return self;
	}
	return HUD;
});