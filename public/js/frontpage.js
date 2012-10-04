require.config({
    paths: {
        jquery:       'lib/require-jquery',
    },
});

require(["jquery"], function ($) {
    $("a[data-content]").on("click", function () {
        $.ajax({
            url: $(this).data('content'),
            success: function (content) {
                $("#content").html(content);
            },
            error: function () {
                console.log("Ajax error:", arguments);
            }
        })
    });    
});