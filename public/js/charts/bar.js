define(['d3', 'xcharts'], function (d3, xChart) {
    function BarChart(element) {
        var self = this;
        self.setData = function (data) {
            self.data = data;
        };
        self.display = function () {
            var chart = new xChart('bar', self.data, element);
        };
    }
    return BarChart;
})