var Histogram = {
    _init: function(histogram_data) {
        $(this).histogram_v({
            subject: 'GO Term',
            title: ['Title'],
            showPercentage: true,
            showSubValue: false,
            legend: true,
            bars: histogram_data,
        });
    }
};
// $.widget('iris.go_histogram', Histogram);