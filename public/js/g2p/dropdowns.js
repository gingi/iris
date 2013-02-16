define(["util/dropdown"], function (DropDown) {
    function DropDowns(dataAPI) {
        var self = this;
        var dropdowns, dropDownFactory;
        var breadcrumbs;
        
        dropdowns = {
            genome: {
                name:       "Genomes",
                url:        dataAPI("/genome"),
                listeners:  ['experiment'],
                listParse:  function (response) {
                    return response.result;
                },
                parseItem: function (data, item) {
                    item.id    = data[0];
                    item.title = data[1];
                    item.trait = data[2] == 1;
                },
                fetchData: { haveTrait: 1 },
            },     
            experiment: {
                name: "Experiments",
                url:  function () {
                    return dataAPI("/genome/" + this.parentId + "/experiments")
                },
                listeners:  ['trait'],
                parent: 'genome',
                idAttribute: 'genome',
                array: 'experiments',
                listParse: function (data) {
                    this.parentId = data.genome;
                    return data;
                }
            },
            trait: {
                name: "Traits",
                url: function () {
                    return dataAPI("/experiment/" + this.parentId + "/traits");
                },
                parent: 'experiment',
                idAttribute: 'experiment',
                array: 'traits'
            }
        };

        dropDownFactory = new DropDown({
            container: "#nav-content",
            sortBy: function (item) { return item.title.toLowerCase(); },
            itemLink: function (item) {
                return "#" + item.type + "/" + item.id;
            }
        });
        
        dropdowns.genome.factory = new DropDown({
            container: "#nav-content",
            sortBy: function (item) {
                return item.trait ? "0" : "1" + item.title.toLowerCase();
            },
            itemLink: function (item) {
                return item.trait ? "#" + item.type + "/" + item.id : null;
            },
            itemTemplate: $("<script>").attr("type", "text/template").html(
                '<a href="<%= link %>"><%= title %></a>'
            )
        });

        function breadcrumb(type) {
            return $("<li>")
                .append($("<a>", { id: "breadcrumb-" + type }))
                .append($("<span>").addClass("divider").text("/"));
        }
        
        function init() {
            breadcrumbs = $("<ul>", {
                id: "dropdown-breadcrumbs"
            }).addClass("breadcrumb").css("display", "none");
            $("#datavis").before(breadcrumbs);
            
            for (var type in dropdowns) {
                var dd = dropdowns[type];
                var select;
                var factory = dd.factory || dropDownFactory;
                dd.view = factory.create(_.extend({
                    itemType:   type,
                    copyTarget: "#breadcrumb-" + type
                }, dd));
                breadcrumbs.append(breadcrumb(type));
            }
            $("li:last-child", breadcrumbs).children(".divider").remove();
            dropdowns.genome.view.fetch();
        }
        
        self.listen = function (type, id) {
            if (dropdowns[type].listeners == null) return;
            dropdowns[type].listeners.forEach(function (l) {
                setCollection = false;
                dropdowns[l].view.fetch({
                    data: { parentId: id },
                    success: function (collection, response) {
                        if (!setCollection) {
                            self.update(
                                type, id, response[dropdowns[type].parent]);
                            setCollection = true;
                        }
                    }
                });
            });
        };
        self.update = function (type, id, parentId) {
            var dd = dropdowns[type];
            if (dd.view.collection.length == 0) {
                dd.view.fetch({
                    data: { parentId: parentId },
                    success: function (collection, response) {
                        if (!dd.parent) return;
                        var parent = dropdowns[dd.parent];
                        self.update(
                            dd.parent,
                            response[dd.parent],
                            response[parent.idAttribute]
                        );
                        dd.view.select(id);
                    }
                });
            } else {
                dd.view.select(id);
            }
        };
    
        self.select = function (type, id) {
            breadcrumbs.show();
            dropdowns[type].view.select(id);
        };
        
        init();
        return self;
    }
    
    return DropDowns;
});