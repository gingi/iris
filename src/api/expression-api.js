

function PlantExpression(url) {

    var _url = url;


    this.getExperimentsByExperimentID = function(ids)
    {
	var resp = json_call_ajax_sync("PlantExpression.getExperimentsByExperimentID", [ids]);
//	var resp = json_call_sync("PlantExpression.getExperimentsByExperimentID", [ids]);
        return resp[0];
    }

    this.getExperimentsByExperimentID_async = function(ids, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getExperimentsByExperimentID", [ids], 1, _callback, _error_callback)
    }

    this.getExperimentsBySampleID = function(ids)
    {
	var resp = json_call_ajax_sync("PlantExpression.getExperimentsBySampleID", [ids]);
//	var resp = json_call_sync("PlantExpression.getExperimentsBySampleID", [ids]);
        return resp[0];
    }

    this.getExperimentsBySampleID_async = function(ids, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getExperimentsBySampleID", [ids], 1, _callback, _error_callback)
    }

    this.getEOSampleIDList = function(lst)
    {
	var resp = json_call_ajax_sync("PlantExpression.getEOSampleIDList", [lst]);
//	var resp = json_call_sync("PlantExpression.getEOSampleIDList", [lst]);
        return resp[0];
    }

    this.getEOSampleIDList_async = function(lst, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getEOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getPOSampleIDList = function(lst)
    {
	var resp = json_call_ajax_sync("PlantExpression.getPOSampleIDList", [lst]);
//	var resp = json_call_sync("PlantExpression.getPOSampleIDList", [lst]);
        return resp[0];
    }

    this.getPOSampleIDList_async = function(lst, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getPOSampleIDList", [lst], 1, _callback, _error_callback)
    }

    this.getAllPO = function()
    {
	var resp = json_call_ajax_sync("PlantExpression.getAllPO", []);
//	var resp = json_call_sync("PlantExpression.getAllPO", []);
        return resp[0];
    }

    this.getAllPO_async = function(_callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getAllPO", [], 1, _callback, _error_callback)
    }

    this.getAllEO = function()
    {
	var resp = json_call_ajax_sync("PlantExpression.getAllEO", []);
//	var resp = json_call_sync("PlantExpression.getAllEO", []);
        return resp[0];
    }

    this.getAllEO_async = function(_callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getAllEO", [], 1, _callback, _error_callback)
    }

    this.getPODescriptions = function(ids)
    {
	var resp = json_call_ajax_sync("PlantExpression.getPODescriptions", [ids]);
//	var resp = json_call_sync("PlantExpression.getPODescriptions", [ids]);
        return resp[0];
    }

    this.getPODescriptions_async = function(ids, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getPODescriptions", [ids], 1, _callback, _error_callback)
    }

    this.getEODescriptions = function(ids)
    {
	var resp = json_call_ajax_sync("PlantExpression.getEODescriptions", [ids]);
//	var resp = json_call_sync("PlantExpression.getEODescriptions", [ids]);
        return resp[0];
    }

    this.getEODescriptions_async = function(ids, _callback, _error_callback)
    {
	json_call_ajax_async("PlantExpression.getEODescriptions", [ids], 1, _callback, _error_callback)
    }

    function _json_call_prepare(url, method, params, async_flag)
    {
	var rpc = { 'params' : params,
		    'method' : method,
		    'version': "1.1",
	};
	
	var body = JSON.stringify(rpc);
	
	var http = new XMLHttpRequest();
	
	http.open("POST", url, async_flag);
	
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");
	//http.setRequestHeader("Content-length", body.length);
	//http.setRequestHeader("Connection", "close");
	return [http, body];
    }

    /*
     * JSON call using jQuery method.
     */

    function json_call_ajax_sync(method, params)
    {
        var rpc = { 'params' : params,
                    'method' : method,
                    'version': "1.1",
        };
        
        var body = JSON.stringify(rpc);
        var resp_txt;
	var code;
        
        var x = jQuery.ajax({       "async": false,
                                    dataType: "text",
                                    url: _url,
                                    success: function (data, status, xhr) { resp_txt = data; code = xhr.status },
				    error: function(xhr, textStatus, errorThrown) { resp_txt = xhr.responseText, code = xhr.status },
                                    data: body,
                                    processData: false,
                                    type: 'POST',
				    });

        var result;

        if (resp_txt)
        {
	    var resp = JSON.parse(resp_txt);
	    
	    if (code >= 500)
	    {
		throw resp.error;
	    }
	    else
	    {
		return resp.result;
	    }
        }
	else
	{
	    return null;
	}
    }

    function json_call_ajax_async(method, params, num_rets, callback, error_callback)
    {
        var rpc = { 'params' : params,
                    'method' : method,
                    'version': "1.1",
        };
        
        var body = JSON.stringify(rpc);
        var resp_txt;
	var code;
        
        var x = jQuery.ajax({       "async": true,
                                    dataType: "text",
                                    url: _url,
                                    success: function (data, status, xhr)
				{
				    resp = JSON.parse(data);
				    var result = resp["result"];
				    if (num_rets == 1)
				    {
					callback(result[0]);
				    }
				    else
				    {
					callback(result);
				    }
				    
				},
				    error: function(xhr, textStatus, errorThrown)
				{
				    if (xhr.responseText)
				    {
					resp = JSON.parse(xhr.responseText);
					if (error_callback)
					{
					    error_callback(resp.error);
					}
					else
					{
					    throw resp.error;
					}
				    }
				},
                                    data: body,
                                    processData: false,
                                    type: 'POST',
				    });

    }

    function json_call_async(method, params, num_rets, callback)
    {
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
    
    function json_call_sync(method, params)
    {
	var tup = _json_call_prepare(url, method, params, false);
	var http = tup[0];
	var body = tup[1];
	
	http.send(body);
	
	var resp_txt = http.responseText;
	
	var resp = JSON.parse(resp_txt);
	var result = resp["result"];
	    
	return result;
    }
}

