define(function () {
    var Util = {};

    Util.each = function (array, func) {
        for (var i = 0; i < array.length; i++) {
            func(array[i]);
        }
        return array;
    };

    Util.extend = function (object) {
        Util.each(arguments, function (src) {
            for (var key in src) {
                if (! object.hasOwnProperty(key)) {
                    object[key] = src[key];
                }
            }
        });
        return object;
    };
    
    Util.keys = function (object) {
        if (object !== Object(object)) throw new TypeError('Invalid object');
        var keys = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                keys[keys.length] = key;
            }
        }
        return keys;
    };

    // Retrieve the values of an object's properties.
    Util.values = function (object) {
        var values = [];
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                values[values.length] = object[key];
            }
        }
        return values;
    };
    
    Util.validate = function (obj, schema) {
        return window.json.validate(obj, schema);
    }

    function capitalize(string) {
        if (string == null || string == "") return string;
        return string[0].toUpperCase() + string.slice(1);
    }

    Util.normalizeName = function (string) {
        // var capitalized = capitalize(string);
        return string.split(/\s/).join('');
    };    
    
    Util.syntaxHighlight = function (json) {
        json = json
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g
            , function (match) {
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

    return Util;
});