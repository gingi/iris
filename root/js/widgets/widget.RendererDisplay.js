(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Renderer Display",
                name: "RendererDisplay",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
    	return [  this.loadRenderer('template') ];
    }

    widget.display = function (div, args) {
      var rend_disp;
      var select_disp;
      var select_list;

      if (div.selector) {
	select_disp = div.selector;
	rend_disp = div.renderer;
      } else {
	rend_disp = document.createElement("div");
	select_disp = document.createElement("div");
	div.appendChild(select_disp);
	div.appendChild(rend_disp);
      }

      select_list = document.createElement("select");
      select_list.setAttribute("id", "renderer_select_list");
      var select_button = document.createElement("input");
      select_button.setAttribute("type", "button");
      select_button.setAttribute("value", "load");
      select_button.setAttribute("class", "btn");
      select_disp.appendChild(select_list);
      select_disp.appendChild(select_button);
      
      Iris.Renderer.template.render( { target: rend_disp, data: Iris.Renderer.template.exampleData() } );
      
      for (i in Iris._FrameBuilder.available_renderers) {
	select_list.add(new Option(i, i), null);
      }
      
      select_button.onclick = function () {
	Iris._FrameBuilder.test_renderer( { renderer: select_list.options[select_list.selectedIndex].value, target: rend_disp } );
      };
      
    };
    
})();
