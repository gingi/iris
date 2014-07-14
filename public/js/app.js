require.config({
    baseUrl: '/js/lib',
    paths: {
        require:      '../require',
        jquery:       'require-jquery',
        app:          '../app',
        iris:         '../iris',
        widgets:      '../widgets',
        renderers:    '../renderers'
    },
    shim: {
        d3: { exports: 'd3' },
    }
});