define(["jquery", "underscore", "text!templates/slider.html"],
function (JQ, _, template) {
    "use strict";
    var defaults = {
        title: null,
        slide: function () {},
        min: 0,
        max: 100,
        step: 1,
        value: 50,
        element: null,
        width: "100%",
        placement: "bottom"
    };
    function Slider(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        var datum = options.value;
        var tiptext = options.title ?
            function () { return options.title + ": " + datum.toFixed(2); } :
            function () { return datum.toFixed(2) };
        if (options.label === undefined) {
            options.label = options.title;
        }
        var callback = options.slide;
        function onSlide(event, ui) {
            datum = ui.value;
            callback(datum);
            self.$wrapper.find(".tooltip-inner").text(tiptext());
        }
        options.slide = onSlide;
        self.$wrapper = JQ(_.template(template, options));
        if (options.element !== undefined) {
            JQ(options.element).append(self.$wrapper);
        }
        self.$wrapper.find(".slider-label").append(options.label);
        self.$slider = self.$wrapper.find(".slider");
        self.$slider.tooltip({
            title: tiptext(),
            placement: options.placement
        });
        self.$slider.slider(options);
        return self;
    }
    Slider.prototype.element = function () { return this.$wrapper; };
    return Slider;
});