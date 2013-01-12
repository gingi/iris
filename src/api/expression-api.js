

function PlantExpression(url) {

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


    this.getRepIDBySampleID = function(ids, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getRepIDBySampleID", [ids], 1, _callback, _error_callback)
    }

    this.getRepIDBySampleID_async = function(ids, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getRepIDBySampleID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySeriesID = function(ids, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getExperimentsBySeriesID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySeriesID_async = function(ids, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getExperimentsBySeriesID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySampleID = function(ids, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getExperimentsBySampleID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySampleID_async = function(ids, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getExperimentsBySampleID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySampleIDnGeneID = function(ids, gl, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getExperimentsBySampleIDnGeneID", [ids, gl], 1, _callback, _error_callback)
    }

    this.getExperimentsBySampleIDnGeneID_async = function(ids, gl, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getExperimentsBySampleIDnGeneID", [ids, gl], 1, _callback, _error_callback)
    }

    this.getEOSampleIDList = function(lst, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getEOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getEOSampleIDList_async = function(lst, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getEOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getPOSampleIDList = function(lst, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getPOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getPOSampleIDList_async = function(lst, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getPOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getAllPO = function(_callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getAllPO", [], 1, _callback, _error_callback)
    }

    this.getAllPO_async = function(_callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getAllPO", [], 1, _callback, _error_callback)
    }

    this.getAllEO = function(_callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getAllEO", [], 1, _callback, _error_callback)
    }

    this.getAllEO_async = function(_callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getAllEO", [], 1, _callback, _error_callback)
    }

    this.getPODescriptions = function(ids, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getPODescriptions", [ids], 1, _callback, _error_callback)
    }

    this.getPODescriptions_async = function(ids, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getPODescriptions", [ids], 1, _callback, _error_callback)
    }

    this.getEODescriptions = function(ids, _callback, _error_callback) {
        json_call_ajax_async("PlantExpression.getEODescriptions", [ids], 1, _callback, _error_callback)
    }

    this.getEODescriptions_async = function(ids, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("PlantExpression.getEODescriptions", [ids], 1, _callback, _error_callback)
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

