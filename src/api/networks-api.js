

function KBaseNetworks(url) {

    var _url = url;


    this.allDatasets = function()
    {
	var resp = json_call_ajax_sync("KBaseNetworks.allDatasets", []);
//	var resp = json_call_sync("KBaseNetworks.allDatasets", []);
        return resp[0];
    }

    this.allDatasets_async = function(_callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.allDatasets", [], 1, _callback, _error_callback)
    }

    this.allDatasetSources = function()
    {
	var resp = json_call_ajax_sync("KBaseNetworks.allDatasetSources", []);
//	var resp = json_call_sync("KBaseNetworks.allDatasetSources", []);
        return resp[0];
    }

    this.allDatasetSources_async = function(_callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.allDatasetSources", [], 1, _callback, _error_callback)
    }

    this.allNetworkTypes = function()
    {
	var resp = json_call_ajax_sync("KBaseNetworks.allNetworkTypes", []);
//	var resp = json_call_sync("KBaseNetworks.allNetworkTypes", []);
        return resp[0];
    }

    this.allNetworkTypes_async = function(_callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.allNetworkTypes", [], 1, _callback, _error_callback)
    }

    this.datasetSource2Datasets = function(datasetSourceRef)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.datasetSource2Datasets", [datasetSourceRef]);
//	var resp = json_call_sync("KBaseNetworks.datasetSource2Datasets", [datasetSourceRef]);
        return resp[0];
    }

    this.datasetSource2Datasets_async = function(datasetSourceRef, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.datasetSource2Datasets", [datasetSourceRef], 1, _callback, _error_callback)
    }

    this.taxon2Datasets = function(taxon)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.taxon2Datasets", [taxon]);
//	var resp = json_call_sync("KBaseNetworks.taxon2Datasets", [taxon]);
        return resp[0];
    }

    this.taxon2Datasets_async = function(taxon, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.taxon2Datasets", [taxon], 1, _callback, _error_callback)
    }

    this.networkType2Datasets = function(networkType)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.networkType2Datasets", [networkType]);
//	var resp = json_call_sync("KBaseNetworks.networkType2Datasets", [networkType]);
        return resp[0];
    }

    this.networkType2Datasets_async = function(networkType, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.networkType2Datasets", [networkType], 1, _callback, _error_callback)
    }

    this.entity2Datasets = function(entityId)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.entity2Datasets", [entityId]);
//	var resp = json_call_sync("KBaseNetworks.entity2Datasets", [entityId]);
        return resp[0];
    }

    this.entity2Datasets_async = function(entityId, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.entity2Datasets", [entityId], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetwork = function(datasetIds, geneId, edgeTypes)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.buildFirstNeighborNetwork", [datasetIds, geneId, edgeTypes]);
//	var resp = json_call_sync("KBaseNetworks.buildFirstNeighborNetwork", [datasetIds, geneId, edgeTypes]);
        return resp[0];
    }

    this.buildFirstNeighborNetwork_async = function(datasetIds, geneId, edgeTypes, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetwork", [datasetIds, geneId, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetworkLimtedByStrength = function(datasetIds, geneId, edgeTypes, cutOff)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.buildFirstNeighborNetworkLimtedByStrength", [datasetIds, geneId, edgeTypes, cutOff]);
//	var resp = json_call_sync("KBaseNetworks.buildFirstNeighborNetworkLimtedByStrength", [datasetIds, geneId, edgeTypes, cutOff]);
        return resp[0];
    }

    this.buildFirstNeighborNetworkLimtedByStrength_async = function(datasetIds, geneId, edgeTypes, cutOff, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetworkLimtedByStrength", [datasetIds, geneId, edgeTypes, cutOff], 1, _callback, _error_callback)
    }

    this.buildInternalNetwork = function(datasetIds, geneIds, edgeTypes)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.buildInternalNetwork", [datasetIds, geneIds, edgeTypes]);
//	var resp = json_call_sync("KBaseNetworks.buildInternalNetwork", [datasetIds, geneIds, edgeTypes]);
        return resp[0];
    }

    this.buildInternalNetwork_async = function(datasetIds, geneIds, edgeTypes, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.buildInternalNetwork", [datasetIds, geneIds, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildInternalNetworkLimitedByStrength = function(datasetIds, geneIds, edgeTypes, cutOff)
    {
	var resp = json_call_ajax_sync("KBaseNetworks.buildInternalNetworkLimitedByStrength", [datasetIds, geneIds, edgeTypes, cutOff]);
//	var resp = json_call_sync("KBaseNetworks.buildInternalNetworkLimitedByStrength", [datasetIds, geneIds, edgeTypes, cutOff]);
        return resp[0];
    }

    this.buildInternalNetworkLimitedByStrength_async = function(datasetIds, geneIds, edgeTypes, cutOff, _callback, _error_callback)
    {
	json_call_ajax_async("KBaseNetworks.buildInternalNetworkLimitedByStrength", [datasetIds, geneIds, edgeTypes, cutOff], 1, _callback, _error_callback)
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

    function json_call_ajax_sync(method, params) {
        var rpc = {
            'params': params,
            'method': method,
            'version': "1.1",
        };

        var body = JSON.stringify(rpc);
        var resp_txt;
        var code;

        var x = jQuery.ajax({
            dataType: "text",
            url: _url,
            success: function (data, status, xhr) {
                resp_txt = data;
                code = xhr.status
            },
            error: function(xhr, textStatus, errorThrown) {
                resp_txt = xhr.responseText; code = xhr.status
            },
            data: body,
            processData: false,
            type: 'POST',
        });

        var result;

        if (resp_txt) {
            var resp = JSON.parse(resp_txt);

            if (code >= 500) {
                throw resp.error;
            } else {
                return resp.result;
            }
        } else {
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
        
        jQuery.ajax({       "async": true,
                                    dataType: "json",
                                    url: _url,
                                    success: function (data, status, xhr)
				{
				    var result = data["result"];
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

