define(["iris"], function (Iris) {
    var Widget = Iris.Widget.extend({
        about: {
            title: "Regulatory Network",
            name: "myRegulatoryNetwork",
            author: "Andrew Olson"
        },
        display: function (element, args) {
            args = (args || {});
            var myDiv = $(element);
            myDiv.append('network widget');
        }
    });
    return Widget;
});
