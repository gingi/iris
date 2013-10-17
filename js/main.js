$(function () {
    $("#main-content > h1").each(function () {
        $("#sidebar-menu").append(
            $("<li>").append(
                $("<a>", { href: "#" + $(this).prop("id") })
                    .append($(this).text())
            )
        );
    });
    $("#main-content").scrollspy({ target: "#sidebar" });
    $("#sidebar").affix({
        offset: {
            top: 50,
            bottom: function () {
                return (this.bottom = $("#footer").outerHeight(true));
            }
        }
    });
});
