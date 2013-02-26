define(["jquery", "underscore", "util/progress", "util/syntax", "util/modal",
    "jquery-ui"],
function ($, _, Progress, Syntax, Modal) {
    var viewportCounter = 1;
    var defaults = {
        height: 400,
        parent: "body",
        title: "Viewport",
        toolbox: true,
        maximize: true
    };
    var ExportModal = new Modal({
        title: "Data Export",
        contentId: "export-content"
    });
    ExportModal.footer(
        $("<a>", { href: "#", download: "export.json" })
            .addClass("btn btn-primary")
            .append($("<i>").addClass("icon-download-alt"))
            .append(" Download").click(function (e) {
                e.preventDefault();
                var uriContent =
                    "data:application/json," +
                    encodeURIComponent($("#export-content").text());
                window.open(uriContent, "export.json");
                return false;
            }
        )
    );
    ExportModal.init();
    $(".viewport")
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);
    
    function Viewport(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        options.parent = $(options.parent);
        if (!options.height && options.parent.height() > 0)
            options.height = options.parent.height();
        _.defaults(options, defaults);
        options.id = options.id || ["viewport", viewportCounter].join("-");
        viewportCounter++;
        
        var div = $("<div>")
            .addClass("viewport")
            .attr("data-title", options.title)
            .attr("id", options.id + "-wrapper")
            .height(options.height)
        if (options.classes) { div.addClass(options.classes); }
        var content = $("<div>")
            .addClass("viewport-content")
            .attr("id", options.id);
        content.progress = new Progress({ element: content });
        options.parent.append(div);
        div.append(content);
        content.height(div.height());

        if (options.toolbox) {
            self.toolbox = toolbox(options);
            div.append(self.toolbox);
            div.on("mouseenter", function () {
                if (self.toolbox._isShown) return;
                self.toolbox._isShown = true;
                self.toolbox.show('fast');
            })
            .on("mouseleave",  function () {
                self.toolbox._isShown = false;
                self.toolbox.hide('fast')
            });
            if (options.sortContainer) {
                var target = $(options.sortContainer);
                target.sortable({
                    containment: target,
                    handle: ".drag-button",
                    cancel: "",
                    tolerance: "pointer",
                    helper: "clone"
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
        content.addTool = function (tool) {
            return self.toolbox.find("#viewport-toolbox").append(
                $("<li>").append(tool)
            );
        }
        content.renderer = function (r) {
            self.renderer = r;
        }
        return content;
        
        function toolbox(options) {
            var div = $("<div>")
                .addClass("viewport-toolbox btn-group")
                .css("display", "none")
            div.append($("<button>", { "data-toggle": "dropdown" })
                .addClass("btn btn-mini")
                .html("<i class=\"icon-cog\"></i>")
            )
            if (options.maximize) {
                div.append($("<div>")
                    .addClass("btn btn-mini")
                    .html("<i class=\"icon-fullscreen\"></i>"))
            }
            if (options.sortContainer != null) {
                div.append($("<div>")
                    .addClass("btn btn-mini drag-button")
                    .html("<i class=\"icon-move\"></i>")
                    .click(self.maximize));
            }
            div.append($("<ul>", { id: "viewport-toolbox"})
                .addClass("dropdown-menu")
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