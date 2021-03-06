define(["jquery", "underscore", "backbone"], function (JQ, _, Backbone) {
    var defaults = {
        title: "Help",
        target: "#help-link",
        width: 300
    };
    function Help(options) {
        options = options ? _.clone(options) : {}
        _.defaults(options, defaults);
        var View = Backbone.View.extend({
            el: JQ(options.target),
            initialize: function () {
                this.render();
            },
            render: function () {
                require(["text!" + options.template], function (html) {
                    JQ("#help-link").click(function () {
                        return false;
                    })
                    JQ("#help-link").popover({
                        title: options.title,
                        content: html,
                        placement: "bottom",
                        html: true,
                        container: "body",
                        width: options.width
                    })
                })
            },
            show: function () {
                this.popover.popover("show");
            }
        });
        return new View();
    }

    return Help;
})