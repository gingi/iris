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
    function Blurb(options) {
        options = options || {};
        var parent = JQ(options.parent);
        var router = JQ(options.router);
        var blurb = JQ("<div>", { id: "blurb"});
        parent.append(blurb);
        var div = JQ("<div>").addClass("jumbotron").css("min-height", 400)
            .append(JQ("<img>", {
                src: "/img/network-icon.png",
                class: "logo"
            }))
            .append(JQ("<h2>").text("The Network Workbench"))
            .append(JQ("<p>").text(
                "Explore KBase networks using dynamic visualizations. " +
                "Navigate among sets of genes and clusters over a variety " +
                "of network data sets available for microbes, plants, and " + 
                "metagenomic communities."))
            .append(JQ("<div>").css("margin-top", 40)
                .css("text-align", "center")
                .append(JQ("<button>").addClass("btn btn-large btn-primary")
                    .text("Get started").click(function () {
                        var button = JQ(this);
                        var target = JQ("#dLabel");
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
                            target.click(function () {
                                arrow.remove();
                            })
                            bounce(arrow, 5, 300);
                            setTimeout(function () {
                                arrow.fadeOut(function () {
                                    arrow.remove();
                                })
                            }, 2000);
                        })
                    }))
                )
        blurb.append(div);
        blurb.append(JQ("<div>").addClass("row")
            .append(section(6, "Credits")
                .append(JQ("<p>").html(
                    "The Network Workbench was developed by the KBase Team. " +
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
                [ "Pavel Novichkov", "Scientist", "psnovichkov at lbl.gov" ]
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
        return blurb;
    }
    return Blurb;
});