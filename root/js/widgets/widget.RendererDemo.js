(function () {
     widget = Iris.Widget.extend({
        about: function () {
            return {
                title: "Renderer Demo",
                name: "RendererDemo",
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
	Iris.Renderer.template.render({ target: rend_disp, data: Iris.Renderer.template.exampleData() } );

    	var select_disp = document.getElementById('renderer_select');
    	var lb = document.getElementById('renderer_selection');
        var availableRenderers = Iris._FrameBuilder.available_renderers;
    	for (i in availableRenderers) {
            console.log(availableRenderers[i]);
    	    lb.add(new Option(i, i), null);
    	}

        var btn = document.getElementById('select_button');
        btn.onclick = function () {
            var sel = document.getElementById('renderer_selection');
            var target = document.getElementById('renderer_display');
            target.innerHTML = '';
    	    Iris._FrameBuilder.test_renderer({
                renderer: sel.options[sel.selectedIndex].value,
                target: target
            });
    	};
    };
})();
