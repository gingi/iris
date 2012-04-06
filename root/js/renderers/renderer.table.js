(function( $ ){

  var methods = {
  about : function() { 
      return {
      name: "table",
      author: "Tobias Paczian",
      version: "1.0",
      requires: [ 'dataTable.min.js' ],
      options: { 'width': null,
		 'height': null,
		 'target': 'table_space',
		 'data': 'example_data()' },
      classes: [  ],
      data_format: "list of list of 2-tuple of float"
      }
    },
  example_data : function() {
      return { data: [ [ "a1", "b1", "c1" ],
		       [ "a2", "b2", "c2" ],
		       [ "a3", "b3", "c3" ],
		       [ "a4", "b4", "c4" ],
		       [ "a5", "b5", "c5" ] ],
	       header: [ "col A", "col B", "col c" ] };
    },
  render : function( settings ) {
      
      this.options = { width: null,
		       height: null,
		       target: "table_space",
		       data: {} };
      $.extend (this.options, settings);
      
      var tdata = this.options.data.data;
      if (typeof(tdata) == 'string') {
	eval("tdata = "+tdata);
      }
      var header = this.options.data.header;
      if (! this.options.data.header) {
	header = tdata.shift();
      }
      var target = this.options.target;
      var defined_width = "";
      if (this.options.width) {
	defined_width = "width: "+this.options.width+"px; ";
      }
      var defined_height = "";
      if (this.options.height) {
	defined_height = "height: "+this.options.height+"px; ";
      }
      var html = "<table id='widget_data_table' class='display' cellspacing='0' cellpadding='0' border='0' style='"+defined_width+" "+defined_height+"'><thead><tr>";
      for (var l=0;l<header.length;l++) {
	html += "<th>"+header[l]+"</th>";
      }
      html += "</tr></thead><tbody>";
      for (var l=0;l<tdata.length;l++) {
	if (tdata[l][0].indexOf('__') > -1) {
	  tdata[l][0] = tdata[l][0].substr(3);
	}
	while (tdata[l].length < header.length) {
	  tdata[l].push("");
	}
	html += "<tr><td>" + tdata[l].join("</td><td>") + "</td></tr>";
      }
      html += "</tbody></table>";
      document.getElementById(target).innerHTML = html;
      
      var oTable = $('#widget_data_table').dataTable();
      oTable.selectedData = [];
      oTable.createDragData = function(data) {
	var drag_data = [];
	for (i=0;i<data.length;i++) {
	  var row = [];
	  for (h=0;h<data[i].childNodes.length;h++) {
	    row.push(data[i].childNodes[h].innerHTML);
	  }
	  drag_data.push(row);
	}
	return drag_data;
      }
      oTable[0].onmousedown = function(ev) {
	if (dragEnabled) {
	  ev = ev || window.event;
	  var mpos = mouseCoords(ev);
	  this.selectedData = [];
	  this.startSelect = ev.target;
	  this.startSelectY = mpos.y;
	}
      };
      oTable[0].onmouseup = function(ev) {
	if (dragEnabled) {
	  if (dragData) {
	    make_table(target, header, dragData);
	    this.startSelect = null;
	    disableDrag();
	  }
	  
	  if (this.startSelect) {
	    ev = ev || window.event;
	    var mpos = mouseCoords(ev);
	    if (this.startSelectY < mpos.y) {
	      var cnode = this.startSelect.parentNode;
	      this.selectedData.push(cnode);
	      while (cnode != ev.target.parentNode) {
		cnode = cnode.nextSibling;
		this.selectedData.push(cnode);
	      }
	    } else {
	      var cnode = ev.target.parentNode;
	      this.selectedData.push(cnode);
	      while (cnode != this.startSelect.parentNode) {
		cnode = cnode.nextSibling;
		this.selectedData.push(cnode);
	      }
	    }
	    dragData = oTable.createDragData(this.selectedData);
	    this.startSelect = null;
	  }
	}
      };
    }
  };
  
  $.fn.RendererTable = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.RendererTable' );
    }
  };

})( jQuery );
