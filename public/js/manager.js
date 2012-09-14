// manager.js
//
// Module for managing client-side exchange of data.
// Shiran Pasternak <shiran@cshl.edu>
// Copyright (c) Cold Spring Harbor Laboratory 2011

function Manager() {
    this.widgets = [];
}

Manager.prototype.register = function(id, obj) {
    this.widgets[id] = obj;
    console.log("Adding widget", id, obj);
}

Manager.prototype.notify = function(id, data) {
    for (widget in this.widgets) {
        if (widget != id) {
            var obj = this.widgets[widget];
            if ( obj.src ) {
                $("#"+widget).load( obj.src + '&where=[' + data + ']');
            }
            else {
                $("#"+widget).html("<div class=\"alert-message info\">"+data+"</div>");
            }
        }
    }
}
