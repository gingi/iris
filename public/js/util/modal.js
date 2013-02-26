define(["jquery", "underscore", "text!/templates/modal.html"],
function ($, _, html) {
    var defaults = {
        element: "body",
        z: 3000,
        title: null,
        content: "",
        footer: ""
    };
    var template = _.template(html);
    var modalCounter = 1;
    function Modal(options) {
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        if (options.id == null) {
            options.id = "modal-" + modalCounter;
        }
        if (options.contentId == null) {
            options.contentId = options.id + "-content";
        }
        modalCounter++;
        var modal = $(template(options));
        modal.footer = function (content) {
            var footer = modal.find(".modal-footer");
            if (content) {
                footer.prepend(content);
            }
            return footer;
        }
        modal.body = function (content) {
            var body = modal.find(".modal-body");
            if (content) {
                body.empty().append(content);
            }
            return body;
        }
        modal.emptyBody = function () {
            modal.find(".modal-body").empty();
        }
        modal.init = function () {
            $(options.element).append(modal);
        }
        modal.show = function () {
            modal.modal({ backdrop: true });
        }
        return modal;
    }
    return Modal;
});