(function () {
    widget = Iris.Widget.extend({
        about: function () {
            return {
                name: "RendererDemo",
                author: "Tobias Paczian",
                requires: [ ],
            };
        }
    });

    widet.setup = function () {
	var promise = this.loadRenderer('template');
	return [ promise ];
    }

    widget.display = function (div, args) {
        div.innerHTML = '';
        var rend_disp = document.createElement('div');
	rend_disp.setAttribute('id', 'renderer_display');
	rend_dist.setAttribute('style', "height: 600px;");
	div.appendChild(rend_disp);
	Iris.Renderer.Template.render( { target: rend_disp, data: Iris.Renderer.Template.exampleData() } );

	var select_disp = document.createElement('div');
	select_dist.setAttribute('style', "height: 150px;");
	div.appendChild(select_disp);

	var lb = document.createElement('select');
	lb.setAttribute('id', 'renderer_selection');
	for (i in Iris._FrameBuilder.available_renderers) {
	    lb.add(new Option(i, i), null);
	}
	select_disp.appendChild(lb);

	var btn = document.createElement('input');
	btn.setAttribute('type', 'button');
	btn.onclick = function () {
	    Iris._FrameBuilder.test_renderer( { renderer: document.getElementById('renderer_selection').options[document.getElementById('renderer_selection').selectedIndex].value, target: document.getElementById('renderer_display') } );
	};
	select_disp.appendChild(btn);

    };

})();
