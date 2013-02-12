define(["jquery"], function ($) {
    function Blurb() {
        var div = $("<div>").addClass("hero-unit")
        .append($("<h4>").text("Wazzup Bitches!"));
    }
    return Blurb;
});