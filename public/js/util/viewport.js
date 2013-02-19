define(["jquery", "underscore", "util/progress", "util/syntax", "sortable"],
    function ($, _, Progress, Syntax) {
    var viewportCounter = 1;
    var defaults = {
        width:  400,
        height: 400,
        parent: "body",
        title: "Viewport",
        toolbox: true
    };
    var ExportModal;
    (function addExportModal() {
        ExportModal = $("<div>").addClass("modal fade hide")
        .append($("<div>").addClass("modal-header")
            .append($("<h3>").text("Data Export")))
        .append($("<div>", { id: "export-content" }).addClass("modal-body")
            .css("min-height", "300px").css("min-width", "400px"))
        .append($("<div>").addClass("modal-footer")
            .append($("<button>", {
                 type: "button", "data-dismiss": "modal", "aria-hidden": true
             }).addClass("btn").text("Close")).click(function () {
                 $("#export-content").empty();
             })
        );
        $("body").append(ExportModal);
    })();
    $(".viewport")
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    
    function Viewport(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        options.parent = $(options.parent);
        if (!options.width && options.parent.width() > 0)
            options.width = options.parent.width();
        if (!options.height && options.parent.height() > 0)
            options.height = options.parent.height();
        _.defaults(options, defaults);
        options.id = options.id || ["viewport", viewportCounter].join("-");
        viewportCounter++;
        
        var div = $("<div>")
            .addClass("viewport")
            .attr("data-title", options.title)
            .attr("id", options.id + "-wrapper")
            .css("height", options.height)
            .css("width", options.width);
        var content = $("<div>")
            .attr("id", options.id)
            .css("height", options.height)
            .css("width", options.width);
        div.append(content);
        content.progress = new Progress({ element: content });
        options.parent.append(div);
        if (options.toolbox) {
            div.append(toolbox(options));
            if (options.sortContainer) {
                var target = $(options.sortContainer);
                target.sortable({
                    containment: target,
                    handle: ".drag-button",
                    cancel: "",
                    tolerance: "pointer"
                });
                target.disableSelection()
            }
        }
        content.showError = function (params) {
            params = params ? _.clone(params) : {};
            params.message = params.message || "Viewport error";
            content.empty();
            content.append($("<div>").addClass("alert alert-error")
                .append($("<h3>").text("Error"))
                .append($("<span>").html(params.message)));
        }
        content.renderer = function (r) {
            self.renderer = r;
        }
        return content;
        function toolbox(options) {
            var div = $("<div>", {
                style: [
                    "position:absolute", "top:2px", "right:2px",
                    "min-height:20px", "float:right", "z-index:100"
                ].join(";"),
                class: "viewport-toolbox btn-group"
            });
            div.append($("<button>", { "data-toggle": "dropdown" })
                .addClass("btn btn-mini")
                .html("<i class=\"icon-cog\"></i>")
            )
            if (options.sortContainer != null) {
                div.append($("<div>")
                    .addClass("btn btn-mini drag-button")
                    .html("<i class=\"icon-move\"></i>"));
            }
            div.append($("<ul>").addClass("dropdown-menu")
                .append($("<li>").html($("<a>", { href: window.location.hash })
                    .html("<i class=\"icon-download-alt\"></i> Export data"))
                    .click(function () {
                        if (self.renderer == null) {
                            return;
                        }
                        var exportData = Syntax(self.renderer.getData());
                        $("#export-content").empty().append($("<pre>")
                        .html(exportData)
                        );
                        ExportModal.modal({ backdrop: true });
                        return false;
                    }))
            );
            return div;
        } 
    }
    return Viewport;
})