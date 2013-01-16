define(['jquery', 'backbone', 'underscore', 'util/spin', 'backbone.localstorage'],
function($, Backbone, _, Spinner) {
    function addSpinner(el) {
        var opts = {
            length: 5,
            width: 2,
            radius: 5,
            corners: 1,
            rotate: 69,
            color: '#666',
            speed: 1.3,
            trail: 42
        };
        var spinner = new Spinner(opts).spin(el[0]);
    }
    
    function removeSpinner(el) {
        el.find(".spinner").remove();
    }
    
    function updateCopy(el) {
        el.find("#copy").text(el.find("li.active").text());
    }
    
    function DropDownMenu(options) {
        var self = this;
        options = (options || {});
        options.container = options.container ?
            $(options.container) : $("body");
        options.listTemplate = options.listTemplate ?
            $(options.listTemplate) : $("#ddListTemplate");
        options.itemTemplate = options.itemTemplate ?
            $(options.itemTemplate) : $("#ddItemTemplate")
        options.parseItem = (options.parseItem || function (data, item) {
            item.id    = data[0];
            item.title = data[1];
        });
        options.itemLink  = (options.itemLink  || function (item) {
            return "#" + item.id;
        });
        
        if (!options.itemTemplate.html()) {
            options.itemTemplate =
                $("<script>").attr("type", "text/template").html(
                    '<a href="<%= link %>"><%= title %></a>'
                );
        }
        if (!options.listTemplate.html()) {
            options.listTemplate = $("<script>").attr("type", "text/template").html(
                '<li class="dropdown">' +
                '<a class="dropdown-toggle" id="<%= label %>" ' +
                'data-toggle="dropdown"data-target="#" href="#">' +
                '<%= title %> <b class="caret"></b><br/>' +
                '<small id="copy" class="muted"></small></a>' +
                '<ul id="<%= listId %>" class="dropdown-menu" ' + 
                'role="menu" aria-labelledby="<%= label %>"></ul></li>');
        }
        var DDItem = Backbone.Model.extend({
            defaults: {
                title: null,
                link: null
            },
            parse: function (data) {
                this.parseItem(data, this);
                this.link = options.itemLink(this);
                return data;
            },
            parseItem: options.parseItem
        });
        var DDItemView = Backbone.View.extend({
            tagName: "li",
            template: _.template(options.itemTemplate.html()),
            events: {
                "click": "selectItem"
            },
            selectItem: function () {
                this.$el.parent().children().removeClass('active');
                this.$el.addClass('active');
                updateCopy(this.$el.parent().parent());
            },
            render: function() {
                this.$el.append(this.template(this.model));
                return this;
            }
        });

        var DDListView = Backbone.View.extend({
            el: options.container,
            template: _.template(options.listTemplate.html()),
            initialize: function() {
                this.collection.bind("sync", this.renderItems, this);
                this.render();
            },
            render: function() {
                this.container = $(this.template({
                    label:  this.options.label,
                    listId: this.options.listId,
                    title:  this.options.title
                })); 
                this.$el.append(this.container);
            },
            renderItems: function () {
                var $topics = this.$el.find("#" + this.options.listId);
                $topics.empty();
                if (this.collection.length) {
                    var items = options.sortBy
                        ? _.sortBy(this.collection.models, options.sortBy)
                        : this.collection.models;
                    _.each(items, function (item) {
                        var itemView = new DDItemView({ model: item });
                        $topics.append(itemView.render().el);
                    }, this);
                } else {
                    $topics.append($("<li>")
                        .css("padding", "5px")
                        .addClass("text-warning")
                        .text('No ' + this.options.name));
                }
            }
        });

        self.create = function (args) {
            args = (args || {});
            args.label = (args.label || args.name + "-label");
            args.title = (args.title || args.name);
            
            var itemParams = { type: args.itemType };
            if (args.parseItem) itemParams[parseItem] = args.parseItem;
            var TypedDDItem = DDItem.extend(itemParams);
            TypedDDItem.type = args.itemType;
            
            var listParams = { model: TypedDDItem };
            listParams.parse = function (data) {
                if (args.listParse) { args.listParse(data) }
                return args.array ? data[args.array] : data;
            }
            var ddList = new (Backbone.Collection.extend(listParams));
            ddList.url = args.url;
            var ddListView = new DDListView({
                collection: ddList,
                label:      args.label,
                title:      args.title,
                name:       args.name,
                listId:     args.name + '-select'
            });
            ddListView.fetch = function (options) {
                options = options ? _.clone(options) : {};
                var fetched = false;
                var spinTarget =
                    ddListView.$el.find("#" + this.options.listId).parent();
                setInterval(function () {
                    if (!fetched) {
                        addSpinner(spinTarget);
                        spinTarget.fadeTo(1, 0.2);
                    }
                }, 500);
                for (var opt in options.data) {
                    ddList[opt] = options.data[opt];
                }
                ddList.fetch({ data: options.data, success: function (collection, response, opts) {
                    removeSpinner(spinTarget);
                    spinTarget.fadeTo(1, 1);
                    fetched = true;
                    if (options.success) { options.success(collection, response, opts) };
                    return collection;
                }, error: function ()  { console.error(arguments); }});
                return this;
            };
            ddListView.select = function (selected) {
                function doSelect() {
                    var item = ddList.get(selected);
                    if (item)
                        ddListView.container.find("#copy").text(item.title);
                }
                doSelect();
                ddList.once("all", doSelect);
                return this;
            };
            return ddListView;
        }
    }
    return DropDownMenu;
});
