require.config({
    paths: {
        jquery:       'lib/require-jquery',
    },
});

require(["jquery"], function ($) {
    $("a[data-content]").on("click", function () {
        console.log("Clicked ", $(this).data('content'));
        $.ajax({
            url: $(this).data('content'),
            success: function (content) {
                console.log(content);
                $("#content").html(content);
            },
            error: function () {
                console.log("Ajax error:", arguments);
            }
        })
    });    
});