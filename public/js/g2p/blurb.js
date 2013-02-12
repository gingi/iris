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
    function Blurb(router) {
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
        return div;
    }
    return Blurb;
});