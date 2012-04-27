(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Datas-Flow Display",
                name: "DataFlowDisplay",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
    	return [ this.loadRenderer('jsonpretty') ];
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

      select_disp.innerHTML += "<input type='text' id='dataflow_command'>";
      
      var button = document.createElement("input");
      button.setAttribute("type", "button");
      button.setAttribute("class", "btn");
      button.setAttribute("value", "execute");
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

    };
      
})();
