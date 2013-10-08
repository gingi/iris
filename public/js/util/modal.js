define(["jquery", "underscore", "text!templates/modal.html", "bootstrap"],
function (JQ, _, html) {
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
        var modal = JQ(template(options));
        var modalBody   = modal.find(".modal-body");
        var modalFooter = modal.find(".modal-footer");
        var modalHeader = modal.find(".modal-header");
        var dialog      = modal.find(".modal-dialog");
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
            if (options.element === undefined) {
                throw new Error("Nothing to which to append modal");
            }
            JQ(options.element).append(modal);
            if (options.width)  {
                dialog.width(options.width);
            }
            if (options.height) {
                var top = (JQ("body").height() - options.height);
                dialog.outerHeight(options.height);
                modalBody.outerHeight(dialog.innerHeight()
                    - modalHeader.outerHeight()
                    - modalFooter.outerHeight()
                    - top);
            }
        }
        modal.show = function () {
            modal.modal({ backdrop: options.backdrop });
        }
        modal.toggle = function () {
            modal.modal("toggle");
        }
        return modal;
    }
    return Modal;
});