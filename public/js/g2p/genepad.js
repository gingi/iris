define(['jquery', 'underscore', 'backbone', 'util/progress'],
function (JQ, _, Backbone, Progress) {
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
    
    function popoverContent() {
        return JQ("<div>").css("padding", "8px")
            .append(JQ("<textarea>", {
                id: "textarea-genepad",
                placeholder: "List of genes",
                rows: 3
            }))
            .append(JQ("<div>").css("display", "inline-block")
                .css("padding-top", 8)
                .append(JQ("<button>", { id: "btn-genepad-upload" })
                    .addClass("btn btn-primary btn-mini")
                    .html("<i class=\"icon-upload-alt\"></i>")))
            .append(JQ("<div>", { id: "genepad-progress"})
                .css("width", "160px")
                .addClass("progress-indicator"))
    }
    
    var GenePad = Backbone.View.extend({
        collection: new GeneList,
        el: "#nav-content",
        events: {
            "click #btn-genepad-upload": "startPad"
        },
        initialize: function (options) {
            options = options ? _.clone(options) : {};
            this.render();
        },
        render: function () {
            var li = JQ("<li>")
                .append(JQ("<a>").text("Gene Pad"));
            this.$el.append(li);
            this.popoverContent = popoverContent();
            li.popover({
                content: this.popoverContent,
                placement: "bottom",
                html: true
            });
        },
        upload: function (genes) {
            var progress = new Progress({
                type: Progress.BAR,
                element: JQ("#genepad-progress")
            });
            progress.progress("5%")
            progress.show();
            var collection = this.collection;
            collection.reset(
                _.map(_.compact(genes), function (name) { return { name: name }
            }));
            var fetched = 1;
            var deferred = JQ.Deferred(), chained = deferred;
            collection.each(function (model) {
                chained = chained.then(function () {
                    var promise = JQ.Deferred();
                    model.fetch({ success: function () {
                        fetched++
                        progress.progress(fetched /
                            genes.length * 100 + "%");
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
        },
        startPad: function () {
            var genestr =
                JQ("#textarea-genepad").val()
                    .replace(/[^\w\s\|\.\-\@]/g, '')
                    .replace(/^\s+|\s+JQ/, '')
                    .replace(/,\s*|\s+/g, ',');
            this.router.navigate("#genepad/" + genestr, true);
        },
        setGenes: function (genestr) {
            this.genesInput = genestr.split(",");
            this.updateTextarea();
            this.upload(this.genesInput);
        },
        updateTextarea: function () {
            this.popoverContent.find("#textarea-genepad")
                .val(this.genesInput.join("\n"));
        },
        setRouter: function (router) {
            this.router = router;
        }
    });
	return GenePad;
})
