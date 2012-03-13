function Data() {
  Widget.call(this);
  this.DataServiceURI = Iris.dataURI();
}

Data.prototype = new Widget();

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

Data.prototype.render = function(divId, args) {
    var widget = this;
	var div = document.getElementById(divId);
	div.innerHTML = '';
	var path=args.hasOwnProperty('path') ? args['path'] : '/species/at/chromosomes';
	if (args.hasOwnProperty('API')) {
		this.DataServiceURI = args['API'];
	}else{
		this.DataServiceURI = '';
	}
	
	$.getJSON('/service/list', function (services) {
//		div.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(JSON.stringify(services, undefined, 4));
		var sel = document.createElement('select');
        var seen = {};
		for (var i in services) {
			var srv = services[i];
            if (seen[srv.name]) {
                continue;
            }
			var opt = document.createElement('option');
			opt.value = srv.uri;
			opt.text = srv.name;
			if (opt.value === widget.DataServiceURI) {
				opt.selected = true;
			}
			sel.add(opt, null);
            seen[srv.name] = 1;
		}
		var opt = document.createElement('option');
		opt.text="custom";
		opt.value="";
		sel.add(opt,null);

		div.appendChild(sel);
		var input = document.createElement('input');
		input.value = path;
		div.appendChild(input);
		var button = document.createElement('input');
		button.setAttribute("type", "button");
		button.setAttribute('value', 'load');
		button.onclick = function(){widget.render(divId, {API: sel.value, path: input.value})};
		div.appendChild(button);
		widget.getJSON(path, function(obj) {
			var str = JSON.stringify(obj, undefined, 4);
			div.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(str);
		});
	});
}

Data.prototype.getJSON = function(path, callback) {
    $.getJSON(this.DataServiceURI + path, callback);
}

Widget.registerWidget('data', Data);
