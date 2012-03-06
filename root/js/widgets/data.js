function Data() {
  Widget.call(this);
  this.DataServiceAPI = DataServiceAPI;
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
	var path=args.hasOwnProperty('path') ? args['path'] : '/data/chrlen?species=at';
	if (args.hasOwnProperty('API')) {
		this.DataServiceAPI = args['API'];
	}
	div.appendChild(document.createElement('pre')).innerHTML = path;
	this.getJSON(path, function(obj) {
		var str = JSON.stringify(obj, undefined, 4);
		div.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(str);
	});
};

Data.prototype.getJSON = function(path, callback) {
    $.getJSON(this.DataServiceAPI + path, callback);
};

Widget.registerWidget('data', Data);
