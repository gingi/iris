define(['jquery', 'underscore', 'util/spin'], function ($, _, Spinner) {
    var _BAR = "bar", _SPIN = "spin";
    var defaults = {
        fade: true,
        spinner: {},
        type: _SPIN
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
    var progressCounter = 0;
    function create(options) {
        if (options.type == Progress.SPIN) {
            var spinner = new Spinner(options.spinner);
            return {
                show: function (container) { spinner.spin(container[0]) },
                hide: function ()          { spinner.stop() }
            };
        } else {
            var div = $("<div>")
                .addClass("progress progress-striped active")
                .css("display", "none")
                .append($("<div>").addClass("bar").css("width", "100%"));
            return {
                show: function (container) {
                    container.append(div);
                    div.fadeIn();
                },
                hide: function () { div.fadeOut(); }
            };
        }
    }
    function Progress(options) {
        progressCounter++;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        _.defaults(options.spinner, spinnerDefaults);
        var $el = $(options.element);
        var _id = "progress-container-" + progressCounter;
        var indicator;
        this.show = function () {
            var container;
            if (options.fade) {
                container = $("<div>")
                    .attr("id", _id)
                    .css("z-index", 30)
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
            if (!indicator) {
                indicator = create(options);
            }
            indicator.show(container);
        };
        this.dismiss = function () {
            if (indicator) indicator.hide();
            if (options.fade) {
                $("#" + _id).remove();
            }
        };
        return this;
    }
    Progress.BAR  = _BAR;
    Progress.SPIN = _SPIN;
    return Progress;
});