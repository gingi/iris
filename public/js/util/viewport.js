define(["jquery", "underscore", "util/progress"], function ($, _, Progress) {
    var viewportCounter = 1;
    var defaults = {
        width:  400,
        height: 400,
        parent: "body",
        title: "Viewport"
    };
    function Viewport(options) {
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        options.parent = $(options.parent);
        options.id = options.id || ["viewport", viewportCounter].join("-");
        viewportCounter++;
        
        var div = $("<div>")
            .addClass("viewport")
            .attr("id", options.id)
            .attr("data-title", options.title)
            .css("height", options.height)
            .css("width", options.width);
        options.parent.append(div);
        div.progress = new Progress({ element: div });
        return div;
    }
    return Viewport;
})