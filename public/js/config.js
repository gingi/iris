requirejs.config({
    baseUrl: '/js',
    shim: {
        jquery:      { exports: '$' },
        d3:          { exports: 'd3' },
        underscore:  { exports: '_' },
        colorbrewer: { exports: 'colorbrewer'},
        backbone:    {
            exports: 'Backbone',
            deps: [ 'underscore', 'jquery' ]
        },
        'backbone.localstorage': {
            exports: 'Backbone',
            deps: [ 'backbone' ]
        }
    },
});
