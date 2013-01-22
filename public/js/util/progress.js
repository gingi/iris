define(['jquery', 'underscore', 'util/spin'], function ($, _, Spinner) {
    var defaults = {
        fade: true,
        spinner: {}
    };
    var spinnerDefaults = {
        length: 5,
        width: 2,
        radius: 5,
        corners: 1,
        rotate: 69,
        color: '#666',
        speed: 1.3,
        trail: 42
    }
    var spinCounter = 0;
    function Spin(options) {
        spinCounter++;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        _.defaults(options.spinner, spinnerDefaults);
        var $el = $(options.element);
        var _id = "spin-container-" + spinCounter;
        var spinner;
        this.show = function () {
            var container;
            if (options.fade) {
                container = $("<div>")
                    .attr("id", _id)
                    .css("z-index", 5)
                    .css("background-color", "rgba(100%, 100%, 100%, 0.8)")
                    .css("position", "absolute")
                    .css("top", 0)
                    .css("left", 0)
                    .height($el.height())
                    .width($el.width());
                $el.append(container);
            } else {
                container = $el;
            }
            if (!spinner) {
                spinner = new Spinner(options.spinner);
            }
            spinner.spin(container[0]);
        };
        this.dismiss = function () {
            if (spinner) spinner.stop()
            if (options.fade) {
                $("#" + _id).remove();
            }
        };
        return this;
    }
    return Spin;
});