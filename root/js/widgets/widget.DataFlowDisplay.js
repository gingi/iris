(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Data Flow Display",
                name: "DataFlowDisplay",
                author: "Tobias Paczian",
                requires: []
            };
        }
    });

    widget.setup = function () {
      return [ this.loadRenderer('jsonpretty'), this.load_all_flows() ];
    }

    widget.display = function (div, args) {
      var rend_disp;
      var select_disp;

      var current_data = null;

      if (div.selector) {
	select_disp = div.selector;
	rend_disp = div.renderer;
      } else {
	rend_disp = document.createElement("div");
	select_disp = document.createElement("div");
	div.appendChild(select_disp);
	div.appendChild(rend_disp);
      }

      select_disp.innerHTML += "<input class='span2' type='text' id='dataflow_command'>";
      
      var button = document.createElement("a");
      button.setAttribute("href", "#");
      button.setAttribute("class", "btn btn-small");
      button.innerHTML = "<i class='icon-forward'></i>";
      button.onclick = function () {
	var flow = { current_step: 0,
		   params: {},
		   internal_params: {},
		   steps: [ JSON.parse(document.getElementById('dataflow_command').value) ] };
	Iris._FrameBuilder.data_flow(flow).then( function () {
	    rend_disp.innerHTML = "";
	    if (confirm("display results?")) {
	      Iris.Renderer.jsonpretty.render( { target: rend_disp, data: Iris._DataHandler.DataStore[flow.steps[0]["name"]][flow.steps[0]["id"]] } );
	    }
	  });
      };
      
      select_disp.appendChild(button);
      
      var span1 = document.createElement("span");
      var flow_list = "";
      var loaded = Iris._FrameBuilder.available_dataflows;
      for (i in loaded) {
	flow_list += "<option title='"+Iris._FrameBuilder.dataflows[i].description+"'>"+i+"</option>";
      }
      var flow_select = document.createElement("select");
      flow_select.setAttribute("class", "span2");
      flow_select.setAttribute("id", "loaded_dataflows");
      flow_select.innerHTML = flow_list;
      span1.innerHTML = "<br><b>Available Data Flows<b><br>";
      span1.appendChild(flow_select)
      var flow_button = document.createElement("a");
      flow_button.setAttribute("href", "#");
      flow_button.setAttribute("class", "btn btn-small");
      flow_button.innerHTML = "<i class='icon-forward'></i>";
      flow_button.onclick = function () {
	Iris._FrameBuilder.data_flow(Iris._FrameBuilder.get_dataflow(flow_select.options[flow_select.selectedIndex].value)).then( function () {
	    rend_disp.innerHTML = "";
	    alert("data flow execution complete");
	  });
      }
      span1.appendChild(flow_button);
            
      select_disp.appendChild(span1);

    };

    widget.load_all_flows = function () {
      var avail = Iris._FrameBuilder.available_dataflows;
      var promise = jQuery.Deferred();
      var promises = [];
      for (i in avail) {
	promises.push(Iris._FrameBuilder.load_dataflow(i));
      }
      jQuery.when.apply(this, promises).then(function() {
	  promise.resolve();
	});
      
      return promise;
    }
      
})();
