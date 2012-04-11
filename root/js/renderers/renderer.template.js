(function( jQuery ) {

  var methods = {
  about : function () {
      return {
      name: "template",
      author: "Tobias Paczian",
      version: "1.0",
      requires: [ ],
      options: { 'key': 'value',
		 'target': 'test',
		 'data': 'example_data()' },
      classes: [ ],
      data_format: "list of string" }
    },
  example_data : function () {
      return [ "A", "B", "C" ];
    },
  render : function ( settings ) {

      var options = { key: "value",
		       target: "test",
		       data: [] };
      jQuery.extend (options, settings);

      var target = document.getElementById(options.target);
      var opt = options;
      target.innerHTML = "";

      var html = "";
      var data = options.data;
      for (i=0;i<data.length;i++) {
	html += data[i];
      }
      target.innerHTML = html;
    }
  };

  jQuery.fn.RendererTemplate = function( method ) {
    if ( methods[method] ) {
      return methods[method](arguments[1]);
    } else {
      jQuery.error( 'Method ' +  method + ' does not exist on jQuery.RendererTemplate' );
    }
  };

})( jQuery );
