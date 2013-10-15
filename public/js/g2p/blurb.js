define(["jquery"], function (JQ) {
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    function bounce(el, times, speed) {
        var distance = "5px";
        for(i = 0; i < times; i++) {
            el.animate({ marginTop: '-='+distance }, speed)
                .animate({ marginTop: '+='+distance }, speed);
        }        
    }
    
    loadCss("/css/bootstrap-arrows.css");
    function Blurb(parent, router) {
        parent = JQ(parent);
        var div = JQ("<div>").addClass("jumbotron").css("min-height", 400)
            .append(JQ("<div>").append(JQ("<img>", {
                src: "/img/g2p-icon.png",
                class: "logo"
            })))
            .append(JQ("<div>")
            .append(JQ("<h2>").text("The Genotype Phenotype Workbench"))
            .append(JQ("<p>").text(
                "Find the needle in the haystack! Explore various data " +
                "sets stored in KBase using genome-wide association studies " +
                "as a starting point."))
            .append(JQ("<div>").css("margin", "40px auto 0")
                .css("text-align", "center")
                .append(JQ("<button>").addClass("btn btn-large btn-primary")
                    .text("Get started").click(function () {
                        var button = JQ(this);
                        var target = JQ("#Genomes-label");
                        require(['bootstrap-arrows'], function () {
                            var arrow = JQ("<span>")
                                .css("position", "absolute")
                                .css("top",
                                    target.offset().top + target.height() + 15)
                                .css("left",
                                    target.offset().left + target.width() / 2)
                                .css("z-index", 2000)
                                .addClass("arrow-warning-large");
                            JQ("body").append(arrow);
                            bounce(arrow, 5, 300);
                            setTimeout(function () {
                                arrow.fadeOut(function () {
                                    arrow.remove();
                                })
                            }, 2000);
                        })
                    }))
                .append(JQ("<span>").css("margin", "0 15px").text("or"))
                .append(JQ("<button>").addClass("btn btn-large")
                    .text("See an example").click(function () {
                        router.navigate("#trait/kb|g.3907.trait.0", true)
                    })
                ))
            )
        parent.append(div);
        parent.append(JQ("<div>").addClass("row")
        .append(section(6, "Credits")
            .append(JQ("<p>").html(
                "The Genotype Phenotype Workbench was developed by the KBase Team. " +
                "For questions and comments email " +
                "<a href=\"help@kbase.us\">help@kbase.us</a>."
            ))
            .append(JQ("<p>").text("This project relies on user input and " +
                "testing, so please contact us with any suggestions "+
                " or comments.")))
            .append(section(3, "Related Links")
                .append(link("/", "<strong>KBase Datavis Library<strong>"))
                .append(link("https://github.com/gingi/kbase-datavis", "<strong>Project @ GitHub<strong>"))
                .append(link("http://www.kbase.us", "KBase Homepage"))
                .append(link("http://www.kbase.us/labs", "KBase Labs"))
                .append(link("http://www.kbase.us/developer-zone", "KBase Developer Zone"))
            )
            .append(section(3, "Documentation")
                .append(link("#", "Using the workbench", "question-sign")
                    .click(function () {
                        JQ("#help-link").popover('show');
                        return false;
                    }))
                .append(link("http://www.youtube.com/watch?v=Qa0T3wn3ADg",
                    "Watch a 3-minute screencast", "facetime-video"))
                .append(JQ("<br/>"))
                .append(JQ("<h3>").text("Change Log"))
                .append(JQ("<ul>").addClass("mini")
                    .append(JQ("<li>").text(
                        "Gene Pad for selecting your own set of genes"))
                    .append(JQ("<li>").text(
                        "Filtered genes are highlighted in the network"))
                    .append(JQ("<li>").text(
                        "Highlight gene locations in the Manhattan Plot"))
                )
            )
        )
        
        function link(url, title, icon) {
            icon = icon || "external-link";
            return JQ("<a>").attr("href", url).html(title).append("<br/>")
                .before(JQ("<span>").css("width", "25px")
                    .css("display", "inline-block")
                    .html("<i class=\"icon-" + icon + "\"></i>  "));
        }
        
        function section(size, heading) {
            return JQ("<div>").addClass("col-md-"+size)
                .append(JQ("<h3>").text(heading));
        }
            
        function developerTable() {
            var developers = [
                [ "Shiran Pasternak", "Developer", "shiran at cshl.edu" ],
                [ "Ranjan Priya", "Scientist", "pranjan at utk.edu" ],
                [ "Sunita Kumari", "Scientist", "kumari at cshl.edu" ]
            ];
            for (var i in developers) {
                developers[i][0] =
                    "<i class='icon-user'></i> " + developers[i][0]; 
                developers[i][2] =
                    "<i class='icon-envelope-alt'></i> " + developers[i][2];
            }
            var table = JQ("<table>").addClass("table contact-table")
            var thead = JQ("<thead>");
            var tbody = JQ("<tbody>");
            table.append(thead);
            table.append(tbody);
            "Name Role Email".split(" ").forEach(function (h) {
                thead.append(JQ("<th>").text(h))
            });
            developers.forEach(function (d) {
                var tr = JQ("<tr>");
                d.forEach(function (it) { tr.append(JQ("<td>").html(it) )});
                tbody.append(tr);
            });
            return table;
        }        
        return this;
    }
    return Blurb;
});