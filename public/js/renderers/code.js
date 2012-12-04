define(["app/renderer", "CodeMirror", "app/event"], function (renderer, CodeMirror, Observable) {
	renderer.updates = new Observable;
	renderer.about = {
		name: "code",
		author: "Andrew Olson",
		description: "JSON/javascript code editor"
	};
	renderer.schema = {
		properties: {
			element: { type: 'any', required: true },
			data: { type: 'any', required: true },
		}
	};
	renderer.exampleData = function () {
		return {
			Employees: [
				{
					firstName: "Steve",
					lastName: "Jobs"
				},
				{
					firstName: "Bill",
					lastName: "Gates"
				}
			],
			sqrt: function(x) {return Math.sqrt(x)}
		};
	};
	renderer.setup = function (settings) {
		var link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = "/js/lib/CodeMirror/lib/codemirror.css";
		document.getElementsByTagName("head")[0].appendChild(link);
	};
	renderer.stringify = function (obj,p) {
		var t = typeof (obj);
		if (t != "object" || obj === null) {
			// simple data type
			if (t == "string") obj = '"'+obj+'"';
			return String(obj);
		}
		else {
			// recurse array or object
			var n, v, json = [], arr = (obj && obj.constructor == Array);
			for (n in obj) {
				if (!(p === 0 && n === "element")) { // avoid DOM cycles
					v = obj[n]; t = typeof(v);
					if (t == "string") v = '"'+v+'"';
					else if (t == "object" && v !== null) v = this.stringify(v,n);
					json.push((arr ? "" : '"' + n + '":') + String(v));
				}
			}
			return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
		}
	};
	// implement JSON.parse de-serialization
	renderer.parse = function (str) {
		if (str === "") str = '""';
		eval("var p=" + str + ";");
		renderer.updates.update(p);
	};
	renderer.render = function (settings) {
		var element = $(settings.element);
		element.empty();
		var width = (element.width() || 800);
		var height = (element.height() || 500);
		var code = this;
		require(["CM_mode/javascript/javascript","CM_util/formatting"], function(CM_mode,fmt) {
			var textarea = document.createElement("textarea");
			textarea.setAttribute("id","code");
			textarea.setAttribute("name","code");
			textarea.value = code.stringify(settings.data,0);
			settings.element.appendChild(textarea);
			code.editor = CodeMirror.fromTextArea(textarea, {
				mode: "javascript",
				lineNumbers: true,
				onKeyEvent: function() {
					clearTimeout(code.delay);
					code.delay = setTimeout( function()
					{
						var val = code.editor.getValue();
						code.parse(val);
					}, 1000);
				}
			});
			CodeMirror.commands["selectAll"](code.editor);
			code.editor.autoFormatRange(code.editor.getCursor(true), code.editor.getCursor(false));
			code.editor.setCursor(0,0);
		});
	};
	return renderer;
});