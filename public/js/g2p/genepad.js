define(['jquery', 'underscore', 'backbone', 'util/progress'],
function ($, _, Backbone, Progress) {
    var Gene = Backbone.Model.extend({
        urlTemplate: _.template("/data/feature/<%= name %>"),
        url: function () {
            return this.urlTemplate(this.toJSON());
        },
        defaults: {
            name: ""
        }
    });
    var GeneList = Backbone.Collection.extend({
        model: Gene,
    });
    
    var GenePad = Backbone.View.extend({
        collection: new GeneList,
        el: "#nav-content",
        events: {
            "click #btn-genepad-upload": "upload"
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            var li = $("<li>")
                .append($("<a>").text("Gene Pad"));
            this.$el.append(li);
            li.popover({
                content: $("<div>").css("padding", "8px")
                    .append($("<textarea>", {
                        id: "textarea-genepad",
                        placeholder: "List of genes",
                        rows: 3
                    }))
                    .append($("<div>").css("display", "inline-block")
                        .css("padding-top", 8)
                        .append($("<button>", { id: "btn-genepad-upload" })
                            .addClass("btn btn-primary btn-mini")
                            .html("<i class=\"icon-upload-alt\"></i>")))
                    .append($("<div>", { id: "genepad-progress"})
                        .css("width", "160px")
                        .addClass("progress-indicator")),
                placement: "bottom",
                html: true
            });
        },
        upload: function () {
            var progress = new Progress({
                type: Progress.BAR,
                element: $("#genepad-progress")
            });
            progress.progress("5%")
            progress.show();
            var genestr =
                $("#textarea-genepad").val().replace(/[^\w\s\|\.\-\@]/g, '');
            var genes = genestr.split(/,\s*|\s+/);
            if (genes.length == 0) return;
            var collection = this.collection;
            collection.reset(
                _.map(_.compact(genes), function (name) { return { name: name }
            }));
            var fetched = 1;
            var deferred = $.Deferred(), chained = deferred;
            collection.each(function (model) {
                chained = chained.then(function () {
                    var promise = $.Deferred();
                    model.fetch({ success: function () {
                        fetched++
                        progress.progress(fetched / genes.length * 100 + "%");
                        promise.resolve();
                    }});
                    return promise;
                });
            });
            chained.done(function () {
                collection.trigger("fetch");
                progress.dismiss();
            });
            deferred.resolve();
        }
    });
	return GenePad;
})
