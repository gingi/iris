define(["app/widget"], function (widget) {
	widget.about = {
		author: "Andrew Olson",
		name: "demo",
		description: "example widget"
	};
	var codeDiv, renderDiv;
	refresh = function(value) {
		require(['renderers/'+value], function(renderer) {
			var rsettings = renderer.prepare({element: renderDiv});
			renderer.render(rsettings);
			require(['renderers/code'], function(code) {
				var csettings = code.prepare({
					element: codeDiv,
					data: rsettings
				});
				code.render(csettings);
				code.updates.observe( function(usettings) {
					usettings.element = renderDiv;
					renderer.render(usettings); // these aren't the renderer you're looking for
				});
			});
		});
	};
	widget.display = function (element,args) {
		var e = $(element);
		// fill a selection box with the various renderers
		$.getJSON("/renderer",function (jslist) {
			var select = document.createElement("select");
			select.setAttribute("name","rendererSelect");
			select.setAttribute("id","rendererSelect");
			select.onchange=function() {
				var chosen = this.options[this.selectedIndex];
				if (chosen.value !== "0") {
					refresh(chosen.value);
				}
			};
			var option = document.createElement("option");
			option.setAttribute("value","0");
			option.innerHTML = "Select Renderer"
			select.appendChild(option);
			for (var i=0;i<jslist.length;i++) {
				var js = jslist[i].substring(0,jslist[i].length-3);
				option = document.createElement("option");
				option.setAttribute("value",js);
				option.innerHTML = js;
				select.appendChild(option);
			}
			var leftDiv = document.createElement("div");
			var rightDiv = document.createElement("div");
			leftDiv.setAttribute("style", "width: 50%; float: left; height: 30px; border: 1px solid black;");
			rightDiv.setAttribute("style", "width: 49%; float: left; height: 30px; border: 1px solid black; border-left: 0px;");
			leftDiv.innerHTML="Settings, courtesy of 'code' renderer";
			rightDiv.appendChild(select);
			codeDiv = document.createElement("div");
			renderDiv = document.createElement("div");
			codeDiv.setAttribute("id","code");
			codeDiv.setAttribute("name","code");
			codeDiv.setAttribute("style","width: 50%; float: left; height: 300px; border: 1px solid black;");
			renderDiv.setAttribute("style","width: 49%; float: left; height: 300px; border: 1px solid black; border-left: 0px;");
			e.append(leftDiv);
			e.append(rightDiv);
			e.append(codeDiv);
			e.append(renderDiv);
		});
	};

	return widget;
});
