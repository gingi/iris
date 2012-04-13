(function() {
  var methods = {
  about : function () { 
      return {
          name: "listSelect",
          author: "Scott Devoid",
          version: "0.1",
          requires: [ 'cdmi.js', 'jquery.js', 'bootstrap-typeahead.js'],
          classes: [ ],
          data_format: "list of string"
      };
  },
  exampleData : function () {
      return ['model', 'genome', 'sequence'];
  },

  render : function ( settings ) {
      this.options = { 
         'target': 'test',
         'data': 'exampleData()',
         'clickFn' : function (x) { return false; }
      };
      jQuery.extend (this.options, settings);
      var data   = this.options.data;
      // FIXME: this.options.target should be an Element, not Id
      var target = jQuery(this.options.target);
      var form   = jQuery("<form>").addClass("form-horizontal").addClass("span12");
    
      var url = jQuery("<input>").attr("type", "text")
                                 .attr("name", "url")
                                 .addClass("span7")
                                 .addClass("disabled")
                                 .attr("disabled", "")
                                 .attr("value", "http://bio-data-1.mcs.anl.gov/services/cdmi_api");
      form.append(makeFormRow("API location: ", url));
      target.append(form);
      var API = {
          "API" : new CDMI_API("http://bio-data-1.mcs.anl.gov/services/cdmi_api"),
          "EntityAPI" :  new CDMI_EntityAPI("http://bio-data-1.mcs.anl.gov/services/cdmi_api")
      };
      var apiName, api, fn, API_functions = { "API" : [], "EntityAPI" : [] }, fns = [];
      for(apiName in API ) {
          if(API.hasOwnProperty(apiName)) {
              api = API[apiName];
              for ( fn in api ) {
                  if(api.hasOwnProperty(fn) && typeof api[fn] === 'function' && !fn.match(/_async/)) {
                      API_functions[fn] = apiName;
                      fns.push(fn);
                  }
              }
          }
      }
      var input  = jQuery("<input></input>").attr("type", "text").addClass("span7").attr("name", "function");
      form.append(makeFormRow("Function: ", input));
      var args = jQuery("<input>").attr("type", "text")
                                  .attr("name", "args")
                                  .addClass("span7")
                                  .attr("default", "[]");
      form.append(makeFormRow("Arguments", args));
      form.append(jQuery("<button>").addClass("btn").html("Query"));
      input.typeahead({source : fns, items : 10});
      var pre = $("<pre>").css("display", "none");
      target.append($("<div>").html(pre).addClass("span10"));
      form.bind("submit", form, function (e) { 
          var fun = e.data.find('[name="function"]').attr('value');
          var args = e.data.find('[name="args"]').attr('value');
          args = JSON.parse(args);
          var apiName = API_functions[fun];
          var api = API[apiName];
          console.log(pre);
          pre.css("display", "block").html(JSON.stringify(api[fun].apply(this, args), undefined, 2));
          return false;
      });
  }};

  function makeFormRow (label, formDiv, helpBlock) {
      var div = jQuery("<div></div>");
      div.addClass("control-group")
         .append(
            jQuery("<label></label>").addClass("control-label").html(label),
            jQuery("<div></div>").addClass("controls").html(formDiv)
         );
      if(helpBlock) {
          div.append(helpBlock);
      }
      return div;
  }

  if( typeof exports != 'undefined' ) {
      exports.about = methods.about;
      exports.render = methods.render;
  } else {
      jQuery.fn.RendererListSelect = function( method ) {
        if ( methods[method] ) {
          return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else {
          $.error( 'Method ' +  method + ' does not exist on jQuery.RendererLinegraph' );
        }
      };
      return methods;
  }
})();
