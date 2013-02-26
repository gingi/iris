define(["jquery", "underscore", "text!/templates/modal.html"],
function ($, _, html) {
    var defaults = {
        element: "body",
        z: 3000,
        title: null,
        content: "",
        footer: "",
        backdrop: true
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
        var modalBody   = modal.find(".modal-body");
        var modalFooter = modal.find(".modal-footer");
        var modalHeader = modal.find(".modal-header");
        modal.footer = function (content) {
            if (content) {
                modalFooter.prepend(content);
            }
            return modalFooter;
        }
        modal.body = function (content) {
            if (content) {
                modalBody.empty().append(content);
            }
            return modalBody;
        }
        modal.emptyBody = function () {
            modalBody.empty();
        }
        modal.init = function () {
            $(options.element).append(modal);
            if (options.width)  {
                modal.width(options.width)
                    .css("margin-left", -options.width/2);
            }
            if (options.height) {
                var bodyHeight =
                    options.height - modalFooter.height() - modalHeader.height();
                console.log("BodyHeight %d Options %d", bodyHeight, options.height, modalHeader.height())
                modal.css("top", ($("body").height() - options.height) / 2)
                modalBody.height(bodyHeight).css("max-height", bodyHeight)
            }
        }
        modal.show = function () {
            modal.modal({ backdrop: options.backdrop });
        }
        return modal;
    }
    return Modal;
});