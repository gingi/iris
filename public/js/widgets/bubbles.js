define(["iris", "underscore", "jquery", "renderers/scatter", "util/viewport",
    "text!templates/dropdown.html"],
function (Iris, _, $, Scatter, Viewport, DropdownTmpl) {
    var bubbleCounter = 1;
    var BubblePlot = Iris.Widget.extend({
        about: {
            title: "Bubble Plot",
            name: "BubblePlot",
            author: "Shiran Pasternak",
            description: "Explore four-dimensional data"
        },
        defaults: {
            element: "body"
        },
        initialize: function () {
            this.viewportId = "bubble-plot-" + bubbleCounter++;
        },
        setData: function (data) {
            this.columns = data.columns;
            this.data = data;
        },
        display: function () {
            this.viewport = new Viewport({
                parent: this.options.element,
                id: this.viewportId,
                title: "Bubble Plot"
            });
            this.scatter = new Scatter({
                element: "#" + this.viewportId
            });
            this.viewport.renderer(this.scatter);
            this.scatter.setData(this.data);
            var toolbox = this.viewport.toolbox();
            var controlPanel = $("<div>", { class: "control-panel" });
            toolbox.parent().append(controlPanel);
            controlPanel.append(dimSelector(this, "X Axis", 0));
            controlPanel.append(dimSelector(this, "Y Axis", 1));
            controlPanel.append(dimSelector(this, "Radius", 2));
            controlPanel.append(dimSelector(this, "Color",  3));
            toolbox.prepend(controlPanelToggle(controlPanel));
            this.scatter.render();
        },
        exampleData: function () {
            return {
                data: [
                    [64, 49, 154, 1.75],
                    [48, 52, 232, 1.77778],
                    [71, 32, 222, 1.75],
                    [69, 56, 240, 7],
                    [79, 35, 219, 2.11111],
                    [61, 56, 191, 0.888889],
                    [69, 46, 216, 1.2],
                    [59, 57, 169, 1.66667],
                    [73, 46, 226, 0.785714],
                    [60, 47, 128, 1.11111],
                    [69, 66, 144, 0.75],
                    [42, 58, 187, 2],
                    [68, 47, 157, 1.25],
                    [80, 68, 196, 1.44444],
                    [74, 58, 187, 2],
                    [66, 45, 170, 1.75],
                    [73, 46, 181, 1.44444],
                    [76, 51, 161, 0.9],
                    [77, 40, 161, 2.11111],
                    [70, 67, 209, 0.909091],
                    [67, 80, 194, 1.44444],
                    [74, 43, 150, 0.846154],
                    [45, 31, 191, 1.8],
                    [69, 27, 151, 1.25],
                    [74, 36, 125, 1.1],
                    [73, 76, 192, 1.375],
                    [72, 48, 122, 2],
                    [80, 85, 188, 2.42857],
                    [79, 54, 178, 1.75],
                    [81, 64, 189, 1.11111],
                    [74, 76, 195, 1.4],
                    [84, 75, 217, 1.08333],
                    [76, 61, 126, 1.4],
                    [52, 54, 202, 1.75],
                    [81, 54, 199, 0.916667],
                    [52, 46, 148, 3.75],
                    [56, 29, 117, 3],
                    [65, 42, 185, 2.33333],
                    [62, 62, 199, 1.44444],
                    [66, 80, 277, 1.44444]
                ],
                columns: [
                    "Earned Runs",
                    "Walks",
                    "Strikeouts",
                    "Win/Loss"
                ]
            }
        }
    });
    function dimSelector(plot, title, index) {
        var i = 0;
        var dropdown = $(_.template(DropdownTmpl, {
            title: title,
            items: plot.columns
        }));
        var items = dropdown.find(".dropdown-menu > li");
        dropdown.addClass("control-item");
        dropdown.children("button").addClass("btn-default btn-sm");
        items.filter(":eq(" + index + ")").addClass("active");
        var updateTitle = function (index) {
            dropdown.find("button > .title")
                .html(title + ": <b>" + plot.columns[index] + "</b>");
        }
        updateTitle(index);
        items.each(function () {
            $(this).data("index", i++);
        });
        items.on("click", function () {
            var i = $(this).data("index");
            plot.scatter.setDimension(index, i);
            updateTitle(i);
            plot.scatter.update();
            items.removeClass("active");
            $(this).addClass("active");
        });
        return dropdown;
    }
    function controlPanelToggle(panel) {
        var button = $("<button>", { class: "btn btn-default btn-sm" });
        button.append($("<i>", { class: "fa fa-caret-square-o-right" }));
        var icons = {
            true: "fa-caret-square-o-right",
            false: "fa-caret-square-o-left"
        };
        var shown = true;
        button.click(function () {
            shown = !shown;
            button.find("i")
                .removeClass(icons[!shown])
                .addClass(icons[shown]);
            panel.css("display", shown ? "" : "none");
        });
        return button;
    }
    
    return BubblePlot;
});