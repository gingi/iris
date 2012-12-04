require.config({
    baseUrl: '/js/lib',
    paths: {
        require:      '../require',
        jquery:       'require-jquery',
        app:          '../app',
        iris:         '../iris',
        widgets:      '../widgets',
        renderers:    '../renderers',
        colorbrewer:  'd3/colorbrewer/colorbrewer',
        CM_mode:      'CodeMirror/mode',
        CM_util:      'CodeMirror/lib/util',
        CodeMirror:   'CodeMirror/lib/codemirror',
    },
    shim: {
        d3: { exports: 'd3' },
        CodeMirror: { exports: 'CodeMirror' }
    }
});