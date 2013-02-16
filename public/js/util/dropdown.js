define(['jquery', 'backbone', 'underscore',
    'util/progress', 'backbone.localstorage'],
function($, Backbone, _, Progress) {
    var defaults = {
        container:    "body",
        listTemplate: "#ddListTemplate",
        itemTemplate: "#ddItemTemplate",
        copyTemplate: "#ddCopyTemplate",
        copyTarget:   null
    };
    
    function DropDownMenu(options) {
        var self = this;
        options = options ? _.clone(options) : {};
        _.defaults(options, defaults);
        options.container    = $(options.container);
        options.listTemplate = $(options.listTemplate);
        options.itemTemplate = $(options.itemTemplate);
        options.copyTemplate = $(options.copyTemplate);
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
            options.listTemplate = $("<script>")
                .attr("type", "text/template").html(
                '<li class="dropdown">' +
                '<a class="dropdown-toggle" id="<%= label %>" ' +
                'data-toggle="dropdown"data-target="#" href="#">' +
                '<%= title %> <b class="caret"></b></a>' +
                '<ul id="<%= listId %>" class="dropdown-menu" ' + 
                'role="menu" aria-labelledby="<%= label %>"></ul></li>');
        }
        if (!options.copyTemplate.html()) {
            options.copyTemplate = $("<script>").attr("type", "text/template")
                .html('<br/><small id="copy" class="muted"></small>');
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
                $(this.options.copyTarget).text(this.$el.text());
            },
            render: function() {
                this.$el.append(this.template(this.model));
                if (this.model.link == null) {
                    this.$el.addClass("disabled");
                }
                return this;
            }
        });

        var DDListView = Backbone.View.extend({
            el: options.container,
            itemView: DDItemView,
            template: _.template(options.listTemplate.html()),
            initialize: function() {
                this.collection.bind("sync", this.renderItems, this);
                if (this.options.copyTarget == null) {
                    $("#" + this.options.label)
                        .append(_.template(options.copyTemplate.html())());
                    this.options.copyTarget =
                        $("#" + this.options.label).find("#copy");
                }
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
            updateCopy: function (text) {
                $(this.options.copyTarget).text(text);
            },
            renderItems: function () {
                var $topics = this.$el.find("#" + this.options.listId);
                $topics.empty();
                if (this.collection.length) {
                    var items = options.sortBy
                        ? _.sortBy(this.collection.models, options.sortBy)
                        : this.collection.models;
                    _.each(items, function (item) {
                        var itemView = new this.itemView({
                            model: item, copyTarget: this.options.copyTarget
                        });
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
            args = args ? _.clone(args) : {};
            args.label = (args.label || args.name + "-label");
            args.title = (args.title || args.name);
            
            var itemParams = { type: args.itemType };
            if (args.parseItem) { itemParams.parseItem = args.parseItem; }
            var TypedDDItem = DDItem.extend(itemParams);
            TypedDDItem.type = args.itemType;
            
            var listParams = { model: TypedDDItem };
            listParams.parse = function (response) {
                if (args.listParse) { response = args.listParse(response) }
                return args.array && response != null
                    ? response[args.array] : response;
            }
            var ddList = new (Backbone.Collection.extend(listParams));
            var copyTarget = args.copyTarget || options.copyTarget;
            ddList.url = args.url;
            var ddListView = new DDListView({
                collection: ddList,
                label:      args.label,
                title:      args.title,
                name:       args.name,
                listId:     args.name + '-select',
                copyTarget: copyTarget
                
            });
            ddListView.fetch = function (options) {
                options = options ? _.clone(options) : {};
                var fetched = false;
                var spinTarget =
                    ddListView.$el.find("#" + this.options.listId).parent();
                var progress = new Progress({ element: spinTarget });
                setTimeout(function () {
                    if (!fetched) progress.show();
                }, 500);
                for (var opt in options.data) {
                    ddList[opt] = options.data[opt];
                }
                ddList.fetch({
                    success: function (collection, response, opts) {
                        progress.dismiss();
                        fetched = true;
                        if (options.success) {
                            options.success(collection, response, opts)
                        };
                        return collection;
                    },
                    error: function () {
                        console.error(arguments);
                    },
                    data: args.fetchData
                });
                return this;
            };
            ddListView.select = function (selected) {
                function doSelect() {
                    var item = ddList.get(selected);
                    if (item) 
                        ddListView.updateCopy(item.title);
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
