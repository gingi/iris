define(['jquery', 'underscore', 'util/spin'], function (JQ, _, Spinner) {
    var _BAR = "bar", _SPIN = "spin";
    var defaults = {
        fade: true,
        spinner: {},
        progress: {},
        type: _SPIN,
        initialWidth: "100%"
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
    };
    var progressCounter = 0;
    function create(options, id) {
        if (options.type == Progress.SPIN) {
            var spinner = new Spinner(options.spinner);
            return {
                show: function (container) { spinner.spin(container[0]) },
                hide: function () {
                    spinner.stop();
                    if (options.fade) JQ("#" + id).remove();
                }
            };
        } else {
            var div = JQ("<div>")
                .addClass("progress progress-striped active")
                .css("display", "none")
                .append(JQ("<div>").addClass("bar")
                    .css("width", options.width));
            return {
                show: function (container, message) {
                    container.append(div);
                    if (message) {
                        div.find("#progress-message").remove();
                        div.append(JQ("<span>")
                            .attr("id", "progress-message")
                            .text(message)
                        );
                    }
                    div.fadeIn();
                },
                hide: function () {
                    div.fadeOut(function () {
                        if (options.fade) JQ("#" + id).remove();
                    });
                },
                width: function (percent) {
                    div.find(".bar").css("width", percent);
                }
            };
        }
    }
    function Progress(options) {
        progressCounter++;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        _.defaults(options.spinner, spinnerDefaults);
        options.width = options.initialWidth;
        var $el = JQ(options.element);
        var _id = "progress-container-" + progressCounter;
        var indicator;
        this.show = function (message) {
            var container;
            if (options.fade) {
                container = JQ("<div>")
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
                indicator = create(options, _id);
            }
            indicator.show(container, message);
        };
        this.progress = function (percent) {
            if (options.type == Progress.BAR) {
                if (!indicator) {
                    indicator = create(options);
                }
                indicator.width(percent);
            }
        };
        this.dismiss = function () {
            if (indicator) indicator.hide();
        };
        return this;
    }
    Progress.BAR  = _BAR;
    Progress.SPIN = _SPIN;
    return Progress;
});