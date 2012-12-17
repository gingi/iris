define(['jquery'], function ($) {
    var jq = $(this);
    return {
        emit: function (evt, data) {
            jq.trigger(evt, data);
            return this;
        },
        on: function (evt, callback) {
            jq.bind(evt, callback);
            return this;
        },
        off: function (evt, callback) {
            jq.unbind(evt, callback);
            return this;
        }
    };
});