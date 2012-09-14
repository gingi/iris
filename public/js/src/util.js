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
				object[key] = src[key];
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
    
    return Util;
});