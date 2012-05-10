require.config({
    paths: {
        jQuery: 'jquery'
    }
});

define(['app'], function (Iris) {
    Iris.init();
});

// var coreScripts = [ 'core', 'datahandler', 'framebuilder' ];
// 
// if (typeof require !== 'undefined') {
//     console.log("ServerMode");
//     var requirejs = require('requirejs');
//     console.log("requirejs", requirejs);
//     for (var i = 0; i < coreScripts.length; i++) {
//         var ret = require('/Users/pasternak/widget_lib/root/js/src/' + coreScripts[i] + '.js');
//         console.log(ret);
//     }
// } else {
//     console.log("ClientMode");
// 
//     function require(url) {
//         jQuery('<script/>').attr('src', url).appendTo('head');
//     }
// 
//     for (var i = 0; i < coreScripts.length; i++) {
//         require('/js/src/' + coreScripts[i] + '.js');
//     }
// }
// console.log("IrisDev");
// console.log(Iris);
