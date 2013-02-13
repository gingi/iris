define(["jquery", "underscore", "util/progress", "sortable"],
    function ($, _, Progress) {
    var viewportCounter = 1;
    var defaults = {
        width:  400,
        height: 400,
        parent: "body",
        title: "Viewport",
        toolbox: true
    };
    function toolbox(options) {
        var div = $("<div>", {
            style: [
                "position:absolute", "top:2px", "right:2px",
                "min-height:20px", "float:right", "z-index:100"
            ].join(";"),
            class: "viewport-toolbox btn-group"
        });
        div.append($("<button>")
            .addClass("btn btn-mini")
            .html("<i class=\"icon-cog\"></i>")
        )
        if (options.sortContainer != null) {
            div.append($("<div>")
                .addClass("btn btn-mini drag-button")
                .html("<i class=\"icon-move\"></i>"));
        }
        return div;
    } 
    function Viewport(options) {
        options = options ? _.clone(options) : {};
        if (!options.width)  { options.width  = options.parent.width();  }
        if (!options.height) { options.height = options.parent.height(); }
        _.defaults(options, defaults);
        options.parent = $(options.parent);
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
        div.progress = new Progress({ element: content });
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
        return content;
    }
    return Viewport;
})