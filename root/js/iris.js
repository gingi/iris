/*
 * iris.js
 *
 * For now, just some utility functions shared by one or more widgets...
 *
 * Copyright 2012 Ware Lab, Cold Spring Harbor Laboratory
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&;]" + name + "=([^&;#]*)";
    var regex = new RegExp(regexS);

    // TODO: Parsing query parameters does not work when delegated as a
    // subrequest unless the enclosing URL query matches exactly these
    // parameters. Need to more elegantly fetch parameters from the request,
    // possibly both GET and POST.
    var results = regex.exec(window.location.search);
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
}
