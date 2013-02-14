define(["jquery", "backbone", "underscore"], function ($, Backbone, _) {
    var Example = Backbone.Model.extend({
        defaults: { nodes: "", datasets: "", title: "" }
    });
    
    var ExampleTemplate = _.template(
        "<li><a href=\"#nodes/<%= nodes %>/datasets/<%= datasets %>\">" +
        "<%= title %></a></li>"
    );
    
    var examples = new Backbone.Collection();
    examples
    // .add({
    //     nodes: "kb|g.21765.CDS.3832,kb|g.21765.CDS.1709,kb|g.21765.CDS.71",
    //     datasets: "kb|netdataset.regprecise.301,kb|netdataset.modelseed.5",
    //     title: "Glyoxylate bypass subsystem (<em>E. coli</em>)"
    // })
    .add({
        nodes: "kb|g.20848.CDS.837,kb|g.20848.CDS.3186,kb|g.20848.CDS.537",
        datasets: "kb|netdataset.regprecise.1,kb|dataset.mak1",
        title: "Arginine metabolism (<em>Shenwalla</em>)"
    })
    .add({
        nodes: "kb|g.1870.peg.3322,kb|g.1870.peg.1532,kb|g.1870.peg.2087",
        datasets: "kb|netdataset.regprecise.301,kb|netdataset.modelseed.1697,kb|netdataset.ppi.7",
        title: "Fatty acid degradation (<em>E. coli</em>)"
    });
    var Navbar = Backbone.View.extend({
        template: _.template("<li class=\"dropdown\">" +
                "<a class=\"dropdown-toggle\" id=\"dLabel\"" +
                    "data-toggle=\"dropdown\"" +
                    "data-target=\"#\" href=\"#\"><%= title %>" +
                "<b class=\"caret\"></b></a>" +
                "<ul id=\"example-links\" class=\"dropdown-menu\" " +
                    "role=\"menu\" aria-labelledby=\"dLabel\"></ul></li>"),
        initialize: function () {
            this.render();
        },
        render: function () {
            var dd = this.template({ title: "Examples" });
            this.$el.append(dd);
            dd = $("#example-links");
            examples.forEach(function (example) {
                dd.append(ExampleTemplate(example.toJSON()));
            });
            return this;
        }
    })
    return Navbar;
})