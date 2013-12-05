$(function () {
    $("#main-content > :header").each(function () {
        $("#sidebar-menu").append(
            $("<li>").append(
                $("<a>", {
                    href: "#" + $(this).prop("id"),
                    class: "menu-item-" + this.nodeName.toLowerCase()
                }).append($(this).text())
            )
        );
    });
    $("#main-content").scrollspy({ target: "#sidebar" });
    $("#sidebar").affix({
        offset: {
            top: 300,
            bottom: function () {
                return (this.bottom = $("#footer").outerHeight(true));
            }
        }
    });
});
