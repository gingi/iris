(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Renderer Demo",
                name: "rendererdemo",
                author: "Tobias Paczian",
                requires: [ ]
            };
        }
    });

    widget.setup = function () {
    	return [ this.loadRenderer('template') ];
    }

    widget.display = function (div, args) {
        div.innerHTML = '<div id="renderer_display" style="height: 450px;" class="well"></div><div class="well" id="renderer_select" style="height: 40px;"><select id="renderer_selection"></select><input type="button" value="select" id="select_button" class="btn"></div>';
        var rend_disp = document.getElementById('renderer_display');
	Iris.Renderer.template.render( { target: rend_disp, data: Iris.Renderer.template.exampleData() } );

	var select_disp = document.getElementById('renderer_select');
	var lb = document.getElementById('renderer_selection');
	for (i in Iris._FrameBuilder.available_renderers) {
	    lb.add(new Option(i, i), null);
	}

	var btn = document.getElementById('select_button');
	btn.onclick = function () {
	    Iris._FrameBuilder.test_renderer( { renderer: document.getElementById('renderer_selection').options[document.getElementById('renderer_selection').selectedIndex].value, target: document.getElementById('renderer_display') } );
	};

    };

})();
