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
        options.itemSelect = options.itemSelect || function (item, $el) {
            $el.parents("li.dropdown").find("#copy").text(item.title);
        }
        
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
                title: "blank",
            },
            parse: function (data) {
                options.parseItem(data, this);
                this.link = options.itemLink(this);
                return data;
            }
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
                this.model.select(this.model, this.$el);
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
                this.$el.append(this.template({
                    label:  this.options.label,
                    listId: this.options.listId,
                    title:  this.options.title
                }));
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
            args.itemSelect = (args.itemSelect || options.itemSelect);
            
            var TypedDDItem = DDItem.extend({
                type:   args.itemType,
                select: args.itemSelect
            })
            TypedDDItem.type = args.itemType;
            var ddList = new (Backbone.Collection.extend({
                model: TypedDDItem
            }));
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
                for (var opt in options) {
                    ddList[opt] = options[opt];
                }
                ddList.fetch({ success: function () {
                    removeSpinner(spinTarget);
                    spinTarget.fadeTo(1, 1);
                    fetched = true;
                }});
            };
            return ddListView;
        }
    }
    return DropDownMenu;
});
