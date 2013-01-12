

function Ontology(url) {

    var _url = url;
    var deprecationWarningSent = false;
    
    function deprecationWarning() {
        if (!deprecationWarningSent) {
            console.log(
                "WARNING: '*_async' method names will be deprecated ",
                "on 2/4/2013. Please use the methods without the ",
                "'_async' suffix.");
            deprecationWarningSent = true;
        }
    }


    this.getGOIDList = function(sname, geneIDList, domainList, ecList, _callback, _error_callback) {
        json_call_ajax_async("Ontology.getGOIDList", [sname, geneIDList, domainList, ecList], 1, _callback, _error_callback)
    }

    this.getGOIDList_async = function(sname, geneIDList, domainList, ecList, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Ontology.getGOIDList", [sname, geneIDList, domainList, ecList], 1, _callback, _error_callback)
    }

    this.getGoDesc = function(goIDList, _callback, _error_callback) {
        json_call_ajax_async("Ontology.getGoDesc", [goIDList], 1, _callback, _error_callback)
    }

    this.getGoDesc_async = function(goIDList, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Ontology.getGoDesc", [goIDList], 1, _callback, _error_callback)
    }

    this.getGOEnrichment = function(sname, geneIDList, domainList, ecList, type, _callback, _error_callback) {
        json_call_ajax_async("Ontology.getGOEnrichment", [sname, geneIDList, domainList, ecList, type], 1, _callback, _error_callback)
    }

    this.getGOEnrichment_async = function(sname, geneIDList, domainList, ecList, type, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Ontology.getGOEnrichment", [sname, geneIDList, domainList, ecList, type], 1, _callback, _error_callback)
    }

    function _json_call_prepare(url, method, params, async_flag) {
        var rpc = {
            params:  params,
            method:  method,
            version: "1.1"
        };
    
        var body = JSON.stringify(rpc);
    
        var http = new XMLHttpRequest();
    
        http.open("POST", url, async_flag);
    
        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/json");
        return [http, body];
    }

    function json_call_ajax_async(method, params, num_rets, callback, error_callback) {
        var rpc = {
            params:  params,
            method:  method,
            version: "1.1",
        };
        
        var body = JSON.stringify(rpc);
        jQuery.ajax({
            dataType:    "text",
            url:         _url,
            data:        body,
            processData: false,
            type:        "POST",
            success: function (data, status, xhr) {
                try {
                    resp = JSON.parse(data);
                    var result = resp["result"];
                    if (num_rets == 1) {
                        callback(result[0]);
                    } else {
                        callback(result);
                    }
                } catch (err) {
                    error_callback({
                        status: 503,
                        error: err,
                        url: _url,
                        body: body
                    });
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr.responseText) {
                    resp = JSON.parse(xhr.responseText);
                    if (error_callback) {
                        error_callback(resp.error);
                    } else {
                        throw resp.error;
                    }
                }
            },
        });
    }

    function json_call_async(method, params, num_rets, callback) {
        var tup = _json_call_prepare(_url, method, params, true);
        var http = tup[0];
        var body = tup[1];
    
        http.onreadystatechange = function() {
            if (http.readyState == 4 && http.status == 200) {
            var resp_txt = http.responseText;
            var resp = JSON.parse(resp_txt);
            var result = resp["result"];
            if (num_rets == 1)
            {
                callback(result[0]);
            }
            else
            {
                callback(result);
            }
            }
        }
    
        http.send(body);
    }
}

