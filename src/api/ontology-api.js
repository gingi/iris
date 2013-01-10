

function Ontology(url) {

    var _url = url;


    this.getGOIDList = function(sname, geneIDList, domainList, ecList)
    {
	var resp = json_call_ajax_sync("Ontology.getGOIDList", [sname, geneIDList, domainList, ecList]);
//	var resp = json_call_sync("Ontology.getGOIDList", [sname, geneIDList, domainList, ecList]);
        return resp[0];
    }

    this.getGOIDList_async = function(sname, geneIDList, domainList, ecList, _callback, _error_callback)
    {
	json_call_ajax_async("Ontology.getGOIDList", [sname, geneIDList, domainList, ecList], 1, _callback, _error_callback)
    }

    this.getGoDesc = function(goIDList)
    {
	var resp = json_call_ajax_sync("Ontology.getGoDesc", [goIDList]);
//	var resp = json_call_sync("Ontology.getGoDesc", [goIDList]);
        return resp[0];
    }

    this.getGoDesc_async = function(goIDList, _callback, _error_callback)
    {
	json_call_ajax_async("Ontology.getGoDesc", [goIDList], 1, _callback, _error_callback)
    }

    this.getGOEnrichment = function(sname, geneIDList, domainList, ecList, type)
    {
	var resp = json_call_ajax_sync("Ontology.getGOEnrichment", [sname, geneIDList, domainList, ecList, type]);
//	var resp = json_call_sync("Ontology.getGOEnrichment", [sname, geneIDList, domainList, ecList, type]);
        return resp[0];
    }

    this.getGOEnrichment_async = function(sname, geneIDList, domainList, ecList, type, _callback, _error_callback)
    {
	json_call_ajax_async("Ontology.getGOEnrichment", [sname, geneIDList, domainList, ecList, type], 1, _callback, _error_callback)
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

