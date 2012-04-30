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

      // var span1 = document.createElement("span");
//       span1.innerHTML = "<br><br><table><tr><td><b>action</b></td><td><select id='dataflow_action'><option>merge</option><option>group</option></select></td></tr><tr><td><b>input resource</b></td><td><input type='text' id='dataflow_resource></td></tr><tr><td><b>input id</b></td><td><input type='text' id='dataflow_input_ids'></td></tr><tr><td><b>output resource</b></td><td><input type='text' id='dataflow_name'></td></tr><tr><td><b>output id</b></td><td><input type='text' id='dataflow_id'></td></tr></table><table id='merge_table'><tr><td><b>data</b></td><td><input type='text' id='dataflow_data'></td></tr><tr><td><b>subselect</b></td><td><input type='text' id='dataflow_subselect'></td></tr><tr><td><b>merge on</b></td><td><input type='text' id='dataflow_merge_on'></td></tr><tr><td><b>merge type</b></td><td><select id='dataflow_merge_type'><option>append column</option><option>single column</option><option>join</option></select></td></tr></table><br><input type='button' class='btn' value='create flow step'>";
      
//       select_disp.appendChild(span1);

    };
      
})();
