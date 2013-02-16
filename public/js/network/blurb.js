define(["jquery"], function ($) {
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
        var parent = $(options.parent);
        var router = $(options.router);
        var blurb = $("<div>", { id: "blurb"});
        parent.append(blurb);
        var div = $("<div>").addClass("hero-unit").css("min-height", 300)
            .append($("<img>", {
                src: "/img/network-icon.png",
                class: "logo"
            }))
            .append($("<h2>").text("The Network Workbench"))
            .append($("<p>").text(
                "Explore KBase networks using dynamic visualizations. " +
                "Navigate among sets of genes and clusters over a variety " +
                "of network data sets available for microbes, plants, and " + 
                "metagenomic communities."))
            .append($("<div>").addClass("span4 offset3").css("margin-top", 40)
                .append($("<button>").addClass("btn btn-large btn-primary")
                    .text("Get started").click(function () {
                        var button = $(this);
                        var target = $("#dLabel");
                        require(['bootstrap-arrows'], function () {
                            var arrow = $("<span>")
                                .css("position", "absolute")
                                .css("top",
                                    target.offset().top + target.height() + 15)
                                .css("left",
                                    target.offset().left + target.width() / 2)
                                .css("z-index", 2000)
                                .addClass("arrow-warning-large");
                            $("body").append(arrow);
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
        blurb.append($("<div>").addClass("row")
            .append(section(6, "Developers")
                .append(developerTable())
                .append($("<small>").text("This project relies on user input and " +
                    "testing, so please contact us with any suggestions "+
                    " or comments.")))
            .append(section(3, "Related Links")
                .append(link("/", "<strong>KBase Datavis Library<strong>"))
                .append(link("https://bitbucket.org/gingi/kbase-datavis", "<strong>Project @ Bitbucket<strong>"))
                .append(link("http://www.kbase.us", "KBase Homepage"))
                .append(link("http://www.kbase.us/labs", "KBase Labs"))
                .append(link("http://www.kbase.us/developer-zone", "KBase Developer Zone"))
            )
            .append(section(3, "Documentation")
                .append($("<p>").text("Coming soon!"))
            )
        )
        
        function link(url, title) {
            return $("<a>").attr("href", url).html(title).append("<br/>")
                .before("<i class=\"icon-external-link\"></i>  ");
        }
        
        function section(size, heading) {
            return $("<div>").addClass("span"+size)
                .append($("<h3>").text(heading));
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
            var table = $("<table>").addClass("table contact-table")
            var thead = $("<thead>");
            var tbody = $("<tbody>");
            table.append(thead);
            table.append(tbody);
            "Name Role Email".split(" ").forEach(function (h) {
                thead.append($("<th>").text(h))
            });
            developers.forEach(function (d) {
                var tr = $("<tr>");
                d.forEach(function (it) { tr.append($("<td>").html(it) )});
                tbody.append(tr);
            });
            return table;
        }
        return blurb;
    }
    return Blurb;
});