(function() {
    Iris.Renderer.extend({
        about: {
            name: "listSelect",
            // key: "listselect",
            author: "Scott Devoid",
            version: "0.1",
            requires: ['cdmi.js', 'jquery.js', 'bootstrap-typeahead.js'],
            dataFormat: "list of string",
            defaults: {
                target: 'test',
                data: 'exampleData()',
                clickFn: function(x) {
                    return false;
                }
            }
        },
        exampleData: function() {
            return ['model', 'genome', 'sequence'];
        },

        render: function (options) {
            var data = options.data;
            var target = jQuery(options.target);
            var form = jQuery("<form>").addClass("form-horizontal").addClass("span12");

            var url = jQuery("<input>").attr("type", "text").attr("name", "url").addClass("span7").addClass("disabled").attr("disabled", "").attr("value", "http://bio-data-1.mcs.anl.gov/services/cdmi_api");
            form.append(makeFormRow("API location: ", url));
            target.append(form);
            var API = {
                "API": new CDMI_API("http://bio-data-1.mcs.anl.gov/services/cdmi_api"),
                "EntityAPI": new CDMI_EntityAPI("http://bio-data-1.mcs.anl.gov/services/cdmi_api")
            };
            var apiName, api, fn, API_functions = {
                "API": [],
                "EntityAPI": []
            },
                fns = [];
            for (apiName in API) {
                if (API.hasOwnProperty(apiName)) {
                    api = API[apiName];
                    for (fn in api) {
                        if (api.hasOwnProperty(fn) && typeof api[fn] === 'function' && !fn.match(/_async/)) {
                            API_functions[fn] = apiName;
                            fns.push(fn);
                        }
                    }
                }
            }
            var input = jQuery("<input></input>").attr("type", "text").addClass("span7").attr("name", "function");
            form.append(makeFormRow("Function: ", input));
            var args = jQuery("<input>").attr("type", "text").attr("name", "args").addClass("span7").attr("default", "[]");
            form.append(makeFormRow("Arguments", args));
            form.append(jQuery("<button>").addClass("btn").html("Query"));
            input.typeahead({
                source: fns,
                items: 10
            });
            var pre = $("<pre>").css("display", "none");
            target.append($("<div>").html(pre).addClass("span10"));
            form.bind("submit", form, function(e) {
                var fun = e.data.find('[name="function"]').attr('value');
                var args = e.data.find('[name="args"]').attr('value');
                args = JSON.parse(args);
                var apiName = API_functions[fun];
                var api = API[apiName];
                console.log(pre);
                pre.css("display", "block").html(JSON.stringify(api[fun].apply(this, args), undefined, 2));
                return false;
            });
        }
    });

    function makeFormRow(label, formDiv, helpBlock) {
        var div = jQuery("<div></div>");
        div.addClass("control-group").append(
        jQuery("<label></label>").addClass("control-label").html(label), jQuery("<div></div>").addClass("controls").html(formDiv));
        if (helpBlock) {
            div.append(helpBlock);
        }
        return div;
    }
})();
