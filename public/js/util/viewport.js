define([
    "jquery",
    "underscore",
    "util/progress",
    "util/syntax",
    "util/modal"
], function (JQ, _, Progress, Syntax, Modal) {
    var viewportCounter = 1;
    var defaults = {
        height: 400,
        parent: "body",
        title: "Viewport",
        toolbox: true,
        maximize: true,
        resizable: false,
        toolboxHides: false,
        sortContainer: null
    };
    var MaximizeModal = new Modal({
        backdrop: true,
        height: JQ(document).height() - 100,
        width:  JQ(document).width()  - 100
    });
    MaximizeModal.init();
    var ExportModal = new Modal({
        title: "Data Export",
        contentId: "export-content"
    });
    ExportModal.footer(
        JQ("<a>", { href: "#", download: "export.json" })
            .addClass("btn btn-primary")
            .append(JQ("<i>").addClass("fa fa-download-alt"))
            .append(" Download").click(function (e) {
                e.preventDefault();
                var uriContent =
                    "data:application/json," +
                    encodeURIComponent(JQ("#export-content").text());
                window.open(uriContent, "export.json");
                return false;
            }
        )
    );
    ExportModal.init();
    JQ(".viewport")
        .attr('unselectable', 'on')
        .css('user-select', 'none')
        .on('selectstart', false);

    /**
     * @class Viewport
     * A visual container for graphic elements. Includes a configurable toolbox
     * with various default functions, like maximization.
     * 
     * @constructor
     * 
     * @param {String|Number} id
     * @param {String|Object} parent
     * @param {String} title
     * @param {String} classes
     * @param {String|Number} height
     * @param {String|Number} width
     */
    function Viewport(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        options.parent = JQ(options.parent);
        _.defaults(options, defaults);
        options.id = options.id || ["viewport", viewportCounter].join("-");
        viewportCounter++;
        
        var $viewport = JQ("<div>")
            .addClass("viewport")
            .attr("data-title", options.title)
            .attr("id", options.id + "-wrapper")
            .css("min-height", options.height)
            .css("min-width", options.width);
        if (options.classes !== undefined) {
            $viewport.addClass(options.classes);
        }
        var content = JQ("<div>")
            .addClass("viewport-content")
            .attr("id", options.id);
        content.progress = new Progress({ element: content });
        options.parent.append($viewport);
        $viewport.append(content);
        content
            .css("min-height", $viewport.height())
            .css("min-width", $viewport.width());
        $viewport.css("width", "99%");
        $viewport.css("height", "99%");

        if (options.toolbox) {
            self.toolbox = createToolbox(options);
            $viewport.append(self.toolbox);
            if (options.toolboxHides) {
                self.toolbox.hide();
                $viewport.on("mouseenter", function (e) {
                    e.preventDefault();
                    if (self.toolbox._isShown) return;
                    self.toolbox._isShown = true;
                    self.toolbox.show('fast');
                }).on("mouseleave", function (e) {
                    e.preventDefault();
                    self.toolbox._isShown = false;
                    self.toolbox.hide('fast');
                }).on("click", function (e) {
                    JQ(this).find(".dropdown-menu").toggle();
                    e.stopPropagation();
                });
            }
            if (options.sortContainer !== null) {
                var target = JQ(options.sortContainer);
                // target.sortable({
                //     containment: target,
                //     handle: ".drag-button",
                //     cancel: "",
                //     tolerance: "pointer",
                //     helper: "clone"
                // });
                // target.disableSelection();
            }
        }
        content.showError = function (params) {
            params = params ? _.clone(params) : {};
            params.message = params.message || "Viewport error";
            content.empty();
            content.append(JQ("<div>").addClass("alert alert-error")
                .append(JQ("<h3>").text("Error"))
                .append(JQ("<span>").html(params.message)));
        };
        content.addTool = function (tool) {
            return self.toolbox.find("#viewport-toolbox").append(
                JQ("<li>").append(tool)
            );
        };
        content.renderer = function (r) {
            if (r !== undefined) {
                self.renderer = r;
            }
            return self.renderer;
        };
        content.toolbox = function () {
            return self.toolbox;
        };
        var viewportState;
        MaximizeModal.on("shown.bs.modal", function () {
            var placeholder = JQ("<div>", { style: "display:none"});
            $viewport.before(placeholder);
            viewportState = {
                placeholder: placeholder,
                height:      $viewport.height(),
                width:       $viewport.width()
            };
            $viewport.height(MaximizeModal.body().height() - 42);
            MaximizeModal.body($viewport);
            self.toolbox.find("#btn-maximize").find("i")
                .removeClass().addClass("fa fa-expand");
            resetRendererBounds();
        });
        MaximizeModal.on("hidden.bs.modal", function () {
            $viewport.width(viewportState.width);
            $viewport.height(viewportState.height);
            viewportState.placeholder.before($viewport);
            viewportState.placeholder.remove();
            MaximizeModal.emptyBody();
            self.toolbox.find("#btn-maximize").find("i")
                .removeClass().addClass("fa fa-expand");
            resetRendererBounds();
        });
        
        function createToolbox(options) {
            var $toolbox = JQ("<div>")
                .addClass("viewport-toolbox btn-group btn-group-sm");
            $toolbox.append(JQ("<div>").addClass("btn-group btn-group-sm")
                .append(JQ("<a>", { href: "#", "data-toggle": "dropdown" })
                    .addClass("btn btn-default")
                    .html(JQ("<i>", { class: "fa fa-cog" }))
                    .dropdown()
                ).append(JQ("<ul>", {
                    id: "viewport-toolbox",
                    class: "dropdown-menu"
                }).append(JQ("<li>")
                    .append(JQ("<a>", { href: "#" + window.location.hash })
                        .html(JQ("<i>", { class: "fa fa-download" })
                            .append(" Export data")))
                    .click(function (event) {
                        event.preventDefault();
                        if (self.renderer === null) { return; }
                        var exportData = Syntax(self.renderer.getData());
                        JQ("#export-content").empty().append(JQ("<pre>")
                            .html(exportData)
                        );
                        ExportModal.show();
                        return false;
                    }))
                )
            );
            if (options.maximize) {
                $toolbox.append(JQ("<div>", { id: "btn-maximize" })
                    .addClass("btn btn-default")
                    .html(JQ("<i>", { class: "fa fa-expand" }))
                    .click(function () {
                        MaximizeModal.toggle();
                    }));
            }
            if (options.sortContainer !== null) {
                $toolbox.append(JQ("<div>")
                    .addClass("btn btn-default drag-button")
                    .html(JQ("<i>", { class: "fa fa-arrows" })));
            }
            return $toolbox;
        }
        function resetRendererBounds() {
            if (self.renderer) {
                content.outerHeight($viewport.height());
                content.outerWidth($viewport.width());
                self.renderer.render();
            }
        }
        return content;
    }
    return Viewport;
});

