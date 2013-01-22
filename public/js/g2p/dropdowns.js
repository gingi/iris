define(["util/dropdown"], function (DropDown) {
    function DropDowns(dataAPI) {
        var self = this;
        var dropdowns, dropDownFactory;
        
        dropdowns = {
            genome: {
                name:       "Genomes",
                url:        dataAPI("/genome"),
                listeners:  ['experiment'],
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
            container: "#g2pnav",
            template:  "#dropdownTemplate",
            sortBy: function (item) { return item.title.toLowerCase(); },
            itemLink: function (item) {
                return "#" + item.type + "/" + item.id;
            }
        });
        
        function init() {
            for (var type in dropdowns) {
                var dd = dropdowns[type];
                var select;
                dd.view = dropDownFactory.create({
                    name:       dd.name,
                    url:        dd.url,
                    itemType:   type,
                    array:      dd.array,
                    listParse:  dd.listParse
                });
            }
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
            dropdowns[type].view.select(id);
        };
        
        init();
        return self;
    }
    
    return DropDowns;
});