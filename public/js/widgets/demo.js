define(["app/widget","renderers/code"], function (widget,code) {
	widget.about = {
		author: "Andrew Olson",
		name: "demo",
		description: "example widget"
	};
	var codeDiv, renderDiv, csettings, rsettings;
	var refresh = function(value) {
		require(['renderers/'+value], function(demo) {
			rsettings = demo.prepare({element: renderDiv});
			csettings.data = rsettings;
			code.render(csettings);
			demo.render(rsettings);
			code.jscode.observe( function(usettings) {
				$.extend(true,rsettings,usettings);
				demo.render(rsettings);
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
			leftDiv.innerHTML="Renderer settings";
			rightDiv.appendChild(select);
			codeDiv = document.createElement("div");
			renderDiv = document.createElement("div");
			codeDiv.setAttribute("id","code");
			codeDiv.setAttribute("name","code");
			codeDiv.setAttribute("style","width: 50%; float: left; height: 500px; border: 1px solid black;");
			renderDiv.setAttribute("style","width: 49%; float: left; height: 500px; border: 1px solid black; border-left: 0px;");
			e.append(leftDiv);
			e.append(rightDiv);
			e.append(codeDiv);
			e.append(renderDiv);
			csettings = code.prepare({element: codeDiv});
		});
	};

	return widget;
});
