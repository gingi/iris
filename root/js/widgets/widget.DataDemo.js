(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Data Demonstration",
                name: "DataDemo",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
      return [ this.loadRenderer('jsonpretty'), this.loadRenderer('table'), this.loadRenderer('treegraph') ];
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

      var btn1 = document.createElement("input");
      btn1.setAttribute("type", "button");
      btn1.setAttribute("class", "btn");
      btn1.setAttribute("value", "Abundance Profile ⇒ Table");
      btn1.onclick = function () {
	Iris._FrameBuilder.load_dataflow('abundance_profile').then( function () {
	    Iris._FrameBuilder.data_flow(Iris._FrameBuilder.get_dataflow('abundance_profile')).then( function () {
		Iris.Renderer.table.render( { target: rend_disp, data: { header: [ "Phylum", "Abundance" ], data: Iris._DataHandler.DataStore["matrix"]["example_profile1"] } });
		 document.getElementById('button2').style.display = "";
	      } );
	  } );
      }
      select_disp.appendChild(btn1);

      var span1 = document.createElement("span");
      span1.innerHTML = "<br><br>";
      select_disp.appendChild(span1);

      var btn2 = document.createElement("input");
      btn2.setAttribute("type", "button");
      btn2.setAttribute("class", "btn");
      btn2.setAttribute("id", "button2");
      btn2.setAttribute("style", "display: none;");
      btn2.setAttribute("value", "Abundance Table ⇒ Family Tree");
      btn2.onclick = function () {
	Iris._FrameBuilder.load_dataflow('table_group').then( function () {
	    Iris._FrameBuilder.data_flow(Iris._FrameBuilder.get_dataflow('table_group')).then( function () {
		Iris.Renderer.treegraph.render( { target: rend_disp, data: Iris._DataHandler.DataStore["matrix"]["example2"] });
	      } );
	  } );
      }
      select_disp.appendChild(btn2);

    };
      
})();
