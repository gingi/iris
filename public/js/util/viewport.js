define([
    "jquery",
    "underscore",
    "util/progress",
    "util/syntax",
    "util/modal",
    "jquery-ui"
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
        height: JQ("body").height() - 100,
        width: JQ("body").width() - 100
    });
    MaximizeModal.init();
    var ExportModal = new Modal({
        title: "Data Export",
        contentId: "export-content"
    });
    ExportModal.footer(
        JQ("<a>", { href: "#", download: "export.json" })
            .addClass("btn btn-primary")
            .append(JQ("<i>").addClass("icon-download-alt"))
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
        if (!options.height && options.parent.height() > 0)
            options.height = options.parent.height();
        _.defaults(options, defaults);
        options.id = options.id || ["viewport", viewportCounter].join("-");
        viewportCounter++;
        
        var div = JQ("<div>")
            .addClass("viewport")
            .attr("data-title", options.title)
            .attr("id", options.id + "-wrapper")
            .css("min-height", options.height)
            .css("min-width", options.width);
        if (options.classes) { div.addClass(options.classes); }
        var content = JQ("<div>")
            .addClass("viewport-content")
            .attr("id", options.id);
        content.progress = new Progress({ element: content });
        options.parent.append(div);
        div.append(content);
        content
            .css("min-height", div.height())
            .css("min-width", div.width());
        div.css("width", "99%");
        div.css("height", "99%");

        if (options.toolbox) {
            self.toolbox = createToolbox(options);
            div.append(self.toolbox);
            if (options.toolboxHides) {
                self.toolbox.hide();
                div.on("mouseenter", function (e) {
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
                target.sortable({
                    containment: target,
                    handle: ".drag-button",
                    cancel: "",
                    tolerance: "pointer",
                    helper: "clone"
                });
                target.disableSelection();
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
            self.renderer = r;
        };
        content.toolbox = function () {
            return self.toolbox;
        };        
        return content;
        
        function createToolbox(options) {
            var div = JQ("<div>")
                .addClass("viewport-toolbox btn-group btn-group-sm");
            div.append(JQ("<div>").addClass("btn-group btn-group-sm")
                .append(JQ("<a>", { href: "#", "data-toggle": "dropdown" })
                    .addClass("btn btn-default")
                    .html(JQ("<i>", { class: "icon icon-cog" }))
                    .dropdown()
                ).append(JQ("<ul>", {
                    id: "viewport-toolbox",
                    class: "dropdown-menu"
                }).append(JQ("<li>")
                    .append(JQ("<a>", { href: "#" + window.location.hash })
                        .html(JQ("<i>", { class: "icon icon-download-alt" })
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
                div.append(JQ("<div>", { id: "btn-maximize" })
                    .addClass("btn btn-default")
                    .html(JQ("<i>", { class: "icon-resize-full" }))
                    .click(toggleMaximize));
            }
            if (options.sortContainer !== null) {
                div.append(JQ("<div>")
                    .addClass("btn btn-default drag-button")
                    .html(JQ("<i>", { class: "icon-move" })));
            }
            return div;
        }
        function toggleMaximize() {
            MaximizeModal.toggle();
            function minimize () {
                div.outerHeight(options.parent.height() - 10);
                div.outerWidth(options.parent.width()   - 10);
                options.parent.append(div);
                MaximizeModal.emptyBody();
                MaximizeModal.shown = false;
                self.toolbox.find("#btn-maximize").find("i")
                    .removeClass().addClass("icon-resize-full");
            }
            if (MaximizeModal.shown) {
                minimize();
            } else {
                div.height(MaximizeModal.body().height() - 42);
                MaximizeModal.body(div);
                MaximizeModal.shown = true;
                MaximizeModal.on("hidden", minimize);
                self.toolbox.find("#btn-maximize").find("i")
                    .removeClass().addClass("icon-resize-small");
            }
            if (self.renderer) {
                setTimeout(function () {
                    content.outerHeight(div.height());
                    content.outerWidth(div.width());
                    self.renderer.render();
                }, 1000);
            }
        }
    }
    return Viewport;
});