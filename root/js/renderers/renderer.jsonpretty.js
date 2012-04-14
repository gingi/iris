(function() {
    var schema = {
        properties: {
            target: {
                type: 'object',
                required: true
            },
            data: {
                required: true,
            }
        }
    };
	
    Iris.Renderer.extend({

        about: {
                name: "jsonpretty",
                author: "Andrew Olson,Jer-Ming Chia",
                version: "1.0",
                requires: [],
                options: {
                key: 'value',
                target: 'test',
                data: 'exampleData()'
                },
            dataFormat: "list of string"
        },
        exampleData: function() {
            var json = {
                "glossary": {
                    "title": "example glossary",
                    "GlossDiv": {
                        "title": "S",
                        "GlossList": {
                            "GlossEntry": {
                                "ID": "SGML",
                                "SortAs": "SGML",
                                "GlossTerm": "Standard Generalized Markup Language",
                                "Acronym": "SGML",
                                "Abbrev": "ISO 8879:1986",
                                "GlossDef": {
                                    "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                    "GlossSeeAlso": ["GML", "XML"]
                                },
                                "GlossSee": "markup"
                            }
                        }
                    }
                }
            };
            return json;
        },

        render: function(options) {

            var target = options.target;
            var opt = options;

            var check = window.json.validate(opt, schema);
            if (!check['valid']) {
                console.log(check['errors']);
                $.error(check['errors']);
            }

            var jsonpretty = syntaxHighlight(JSON.stringify(options.data, undefined, 4));
			target.appendChild(document.createElement('pre')).innerHTML = jsonpretty;
        }});
		
	   var syntaxHighlight =  function(json) {
	    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
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
}).call(this);
