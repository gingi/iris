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
            var dimensions = [];
            _.each(this.columns, function (d, i) {
                if (d.role === "dimension")
                    dimensions.push({ index: i, name: d.name });
            });
            controlPanel.append(dimSelector(this, "X Axis", 0, dimensions));
            controlPanel.append(dimSelector(this, "Y Axis", 1, dimensions));
            controlPanel.append(dimSelector(this, "Radius", 2, dimensions));
            controlPanel.append(dimSelector(this, "Color",  3, dimensions));
            toolbox.prepend(controlPanelToggle(controlPanel));
            this.scatter.render();
        },
        exampleData: function () {
            return {
                data: [
                    ["Clayton Kershaw", 236.0, 164, 55, 48, 52, 232, 1.77778],
                    ["Jose Fernandez", 172.2, 111, 47, 42, 58, 187, 2],
                    ["Matt Harvey", 178.1, 135, 46, 45, 31, 191, 1.8],
                    ["Anibal Sanchez", 182.0, 156, 56, 52, 54, 202, 1.75],
                    ["Zack Greinke", 177.2, 152, 54, 52, 46, 148, 3.75],
                    ["Bartolo Colon", 190.1, 193, 60, 56, 29, 117, 3],
                    ["Hisashi Iwakuma", 219.2, 179, 69, 65, 42, 185, 2.33333],
                    ["Madison Bumgarner", 201.1, 146, 68, 62, 62, 199, 1.44444],
                    ["Yu Darvish", 209.2, 145, 68, 66, 80, 277, 1.44444],
                    ["Cliff Lee", 222.2, 193, 77, 71, 32, 222, 1.75],
                    ["Max Scherzer", 214.1, 152, 73, 69, 56, 240, 7],
                    ["Adam Wainwright", 241.2, 223, 83, 79, 35, 219, 2.11111],
                    ["Stephen Strasburg", 183.0, 136, 71, 61, 56, 191, 0.888889],
                    ["Hyun-Jin Ryu", 192.0, 182, 67, 64, 49, 154, 1.75],
                    ["Felix Hernandez", 204.1, 185, 74, 69, 46, 216, 1.2],
                    ["Shelby Miller", 173.1, 152, 65, 59, 57, 169, 1.66667],
                    ["Chris Sale", 214.1, 184, 81, 73, 46, 226, 0.785714],
                    ["Andrew Cashner", 175.0, 151, 68, 60, 47, 128, 1.11111],
                    ["Travis Wood", 200.0, 163, 73, 69, 66, 144, 0.75],
                    ["Kris Medlen", 197.0, 194, 77, 68, 47, 157, 1.25],
                    ["James Shields", 228.2, 215, 82, 80, 68, 196, 1.44444],
                    ["Mat Latos", 210.2, 197, 82, 74, 58, 187, 2],
                    ["Julio Teheran", 185.2, 173, 69, 66, 45, 170, 1.75],
                    ["Mike Minor", 204.2, 177, 79, 73, 46, 181, 1.44444],
                    ["Ervin Santana", 211.0, 190, 85, 76, 51, 161, 0.9],
                    ["Jordan Zimmermann", 213.1, 192, 81, 77, 40, 161, 2.11111],
                    ["A.J. Burnett", 191.0, 165, 79, 70, 67, 209, 0.909091],
                    ["Ubaldo Jimenez", 182.2, 163, 75, 67, 80, 194, 1.44444],
                    ["Hiroki Kuroda", 201.1, 191, 79, 74, 43, 150, 0.846154],
                    ["David Price", 186.2, 178, 78, 69, 27, 151, 1.25],
                    ["Kyle Lohse", 198.2, 196, 78, 74, 36, 125, 1.1],
                    ["Gio Gonzalez", 195.2, 169, 79, 73, 76, 192, 1.375],
                    ["Mike Leake", 192.1, 193, 78, 72, 48, 122, 2],
                    ["C.J. Wilson", 212.1, 200, 93, 80, 85, 188, 2.42857],
                    ["Patrick Corbin", 208.1, 189, 81, 79, 54, 178, 1.75],
                    ["Derek Holland", 213.0, 210, 90, 81, 64, 189, 1.11111],
                    ["Justin Masterson", 193.0, 156, 75, 74, 76, 195, 1.4],
                    ["Justin Verlander", 218.1, 212, 94, 84, 75, 217, 1.08333],
                    ["Jhoulys Chacin", 197.1, 188, 82, 76, 61, 126, 1.4],
                    ["Homer Bailey", 209.0, 181, 85, 81, 54, 199, 0.916667],
                    ["Jorge De La Rosa", 167.2, 170, 70, 65, 62, 112, 2.66667],
                    ["Jose Quintana", 200.0, 188, 83, 78, 56, 164, 1.28571],
                    ["Jeff Locke", 166.1, 146, 69, 65, 84, 125, 1.42857],
                    ["John Lackey", 189.1, 179, 80, 74, 40, 161, 0.769231],
                    ["Wade Miley", 202.2, 201, 88, 80, 66, 147, 1],
                    ["Cole Hamels", 220.0, 205, 94, 88, 50, 202, 0.571429],
                    ["Dillon Gee", 199.0, 208, 84, 80, 47, 142, 1.09091],
                    ["Doug Fister", 208.2, 229, 91, 85, 44, 159, 1.55556],
                    ["Ricky Nolasco", 199.1, 195, 90, 82, 46, 165, 1.18182],
                    ["Chris Tillman", 206.1, 184, 87, 85, 68, 179, 2.28571],
                    ["Andy Pettitte", 185.1, 198, 85, 77, 48, 128, 1],
                    ["Jon Lester", 213.1, 209, 94, 89, 67, 177, 1.875],
                    ["Miguel Gonzalez", 171.1, 157, 81, 72, 53, 120, 1.375],
                    ["Bronson Arroyo", 202.0, 199, 88, 85, 34, 124, 1.16667],
                    ["A.J. Griffin", 200.0, 171, 91, 85, 54, 171, 1.4],
                    ["Scott Feldman", 181.2, 159, 87, 78, 56, 132, 1],
                    ["Eric Stults", 203.2, 219, 97, 89, 40, 131, 0.846154],
                    ["Lance Lynn", 201.2, 189, 92, 89, 76, 198, 1.5],
                    ["Jarrod Parker", 197.0, 178, 92, 87, 63, 134, 1.5],
                    ["Matt Cain", 184.1, 158, 85, 82, 55, 158, 0.8],
                    ["Jeremy Guthrie", 211.2, 236, 99, 95, 59, 111, 1.25],
                    ["Mark Buehrle", 203.2, 223, 100, 94, 51, 139, 1.2],
                    ["Kevin Correia", 185.1, 218, 89, 86, 45, 101, 0.692308],
                    ["Bud Norris", 176.2, 196, 89, 82, 67, 147, 0.833333],
                    ["Yovani Gallardo", 180.2, 180, 92, 84, 66, 144, 1.2],
                    ["R.A. Dickey", 224.2, 207, 113, 105, 71, 177, 1.07692],
                    ["Rick Porcello", 177.0, 185, 87, 85, 42, 142, 1.625],
                    ["Felix Doubront", 162.1, 161, 84, 78, 71, 139, 1.83333],
                    ["Jeff Samardzija", 213.2, 210, 109, 103, 78, 214, 0.615385],
                    ["Wily Peralta", 183.1, 187, 107, 89, 73, 129, 0.733333],
                    ["Tim Lincecum", 197.2, 184, 102, 96, 76, 193, 0.714286],
                    ["Ryan Dempster", 171.1, 170, 97, 87, 79, 157, 0.888889],
                    ["Jerome Williams", 169.1, 181, 93, 86, 55, 107, 0.9],
                    ["Dan Haren", 169.2, 179, 92, 88, 31, 151, 0.714286],
                    ["Kyle Kendrick", 182.0, 207, 104, 95, 47, 110, 0.769231],
                    ["CC Sabathia", 211.0, 224, 122, 112, 65, 175, 1.07692],
                    ["Ian Kennedy", 181.1, 180, 108, 99, 73, 163, 0.7],
                    ["Edwin Jackson", 175.1, 197, 110, 97, 59, 135, 0.444444],
                    ["Jeremy Hellickson", 174.0, 185, 103, 100, 50, 135, 1.2],
                    ["Joe Saunders", 183.0, 232, 117, 107, 61, 107, 0.6875],
                ],
                columns: [
                    { name: "Name", role: "label" },
                    { name: "Innings Pitched", role: "dimension" },
                    { name: "Hits", role: "dimension" },
                    { name: "Runs", role: "dimension" },
                    { name: "Earned Runs", role: "dimension" },
                    { name: "Walks", role: "dimension" },
                    { name: "Strikeouts", role: "dimension" },
                    { name: "Win/Loss", role: "dimension" },
                ]
            }
        }
    });
    function dimNames(columns) {
        return _.map(
            _.filter(columns,
                function (d) { return (d.role === "dimension"); }),
                function (d) { return d.name; });
    }
    function dimSelector(plot, title, index, dimensions) {
        var active = dimensions[index];
        var dropdown = $(_.template(DropdownTmpl, {
            title: title,
            items: []
        }));
        var $ul = dropdown.find(".dropdown-menu");
        _.each(dimensions, function (c) {
            var item =
                $("<li>", { role: "presentation", "data-index": c.index })
                    .append($("<a>", {
                        role: "menuitem", tabindex: -1, href: "#"
                    }).text(c.name));
            if (c.index == active.index)
                item.addClass("active");
            $ul.append(item);
        });
        var items = $ul.find("li");
        dropdown.addClass("control-item");
        dropdown.children("button").addClass("btn-default btn-sm");
        var updateTitle = function (i) {
            _.each(dimensions, function (d) {
                if (d.index == i)
                    dropdown.find("button > .title")
                        .html(title + ": <b>" + d.name + "</b>");
            });
        };
        updateTitle(active.index);
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