require.config({
    paths: {
        jQuery: 'jquery'
    }
});

define(['app'], function (Iris) {
    Iris.init();
});