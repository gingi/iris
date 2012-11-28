define(['jquery'], function ($) {
    var API = function () {};
    API.prototype.getNetwork = function (key, success, failure) {
        $.ajax({
            url: '/data/network/' + key,
            success: function (data) {
                if (success) { success(data) }
            },
            failure: function () {
                if (failure) { failure() }
            }
        });
    };
    return API;
});