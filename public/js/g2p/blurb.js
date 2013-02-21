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
    function Blurb(parent, router) {
        parent = $(parent);
        var div = $("<div>").addClass("hero-unit").css("min-height", 300)
            .append($("<img>", {
                src: "/img/g2p-icon.png",
                class: "logo"
            }))
            .append($("<h2>").text("The Genotype Phenotype Workbench"))
            .append($("<p>").text(
                "Find the needle in the haystack! Explore various data " +
                "sets stored in KBase using genome-wide association studies " +
                "as a starting point."))
            .append($("<div>").addClass("span4 offset2").css("margin-top", 40)
                .append($("<button>").addClass("btn btn-large btn-primary")
                    .text("Get started").click(function () {
                        var button = $(this);
                        var target = $("#Genomes-label");
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
                .append($("<span>").css("margin", "0 15px").text("or"))
                .append($("<button>").addClass("btn btn-large")
                    .text("See an example").click(function () {
                        router.navigate("#trait/kb|g.3907.trait.0", true)
                    }))
                )
        parent.append(div);
        parent.append($("<div>").addClass("row")
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
                .append(link("#", "Using the workbench", "question-sign")
                    .click(function () {
                        $("#help-link").popover('show');
                        return false;
                    }))
                .append(link("http://www.youtube.com/watch?v=Qa0T3wn3ADg",
                    "Watch a 3-minute screencast", "facetime-video"))
                .append($("<br/>"))
                .append($("<h3>").text("Change Log"))
                .append($("<ul>").addClass("mini")
                    .append($("<li>").text(
                        "Gene Pad for selecting your own set of genes"))
                    .append($("<li>").text(
                        "Filtered genes are highlighted in the network"))
                    .append($("<li>").text(
                        "Highlight gene locations in the Manhattan Plot"))
                )
            )
        )
        
        function link(url, title, icon) {
            icon = icon || "external-link";
            return $("<a>").attr("href", url).html(title).append("<br/>")
                .before($("<span>").css("width", "25px")
                    .css("display", "inline-block")
                    .html("<i class=\"icon-" + icon + "\"></i>  "));
        }
        
        function section(size, heading) {
            return $("<div>").addClass("span"+size)
                .append($("<h3>").text(heading));
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
        return this;
    }
    return Blurb;
});