

function KBaseNetworks(url) {

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


    this.allDatasets = function(_callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.allDatasets", [], 1, _callback, _error_callback)
    }

    this.allDatasets_async = function(_callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.allDatasets", [], 1, _callback, _error_callback)
    }

    this.allDatasetSources = function(_callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.allDatasetSources", [], 1, _callback, _error_callback)
    }

    this.allDatasetSources_async = function(_callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.allDatasetSources", [], 1, _callback, _error_callback)
    }

    this.allNetworkTypes = function(_callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.allNetworkTypes", [], 1, _callback, _error_callback)
    }

    this.allNetworkTypes_async = function(_callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.allNetworkTypes", [], 1, _callback, _error_callback)
    }

    this.datasetSource2Datasets = function(datasetSourceRef, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.datasetSource2Datasets", [datasetSourceRef], 1, _callback, _error_callback)
    }

    this.datasetSource2Datasets_async = function(datasetSourceRef, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.datasetSource2Datasets", [datasetSourceRef], 1, _callback, _error_callback)
    }

    this.taxon2Datasets = function(taxon, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.taxon2Datasets", [taxon], 1, _callback, _error_callback)
    }

    this.taxon2Datasets_async = function(taxon, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.taxon2Datasets", [taxon], 1, _callback, _error_callback)
    }

    this.networkType2Datasets = function(networkType, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.networkType2Datasets", [networkType], 1, _callback, _error_callback)
    }

    this.networkType2Datasets_async = function(networkType, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.networkType2Datasets", [networkType], 1, _callback, _error_callback)
    }

    this.entity2Datasets = function(entityId, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.entity2Datasets", [entityId], 1, _callback, _error_callback)
    }

    this.entity2Datasets_async = function(entityId, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.entity2Datasets", [entityId], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetwork = function(datasetIds, entityIds, edgeTypes, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetwork", [datasetIds, entityIds, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetwork_async = function(datasetIds, entityIds, edgeTypes, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetwork", [datasetIds, entityIds, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetworkLimtedByStrength = function(datasetIds, entityIds, edgeTypes, cutOff, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetworkLimtedByStrength", [datasetIds, entityIds, edgeTypes, cutOff], 1, _callback, _error_callback)
    }

    this.buildFirstNeighborNetworkLimtedByStrength_async = function(datasetIds, entityIds, edgeTypes, cutOff, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.buildFirstNeighborNetworkLimtedByStrength", [datasetIds, entityIds, edgeTypes, cutOff], 1, _callback, _error_callback)
    }

    this.buildInternalNetwork = function(datasetIds, geneIds, edgeTypes, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.buildInternalNetwork", [datasetIds, geneIds, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildInternalNetwork_async = function(datasetIds, geneIds, edgeTypes, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.buildInternalNetwork", [datasetIds, geneIds, edgeTypes], 1, _callback, _error_callback)
    }

    this.buildInternalNetworkLimitedByStrength = function(datasetIds, geneIds, edgeTypes, cutOff, _callback, _error_callback) {
        json_call_ajax_async("KBaseNetworks.buildInternalNetworkLimitedByStrength", [datasetIds, geneIds, edgeTypes, cutOff], 1, _callback, _error_callback)
    }

    this.buildInternalNetworkLimitedByStrength_async = function(datasetIds, geneIds, edgeTypes, cutOff, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("KBaseNetworks.buildInternalNetworkLimitedByStrength", [datasetIds, geneIds, edgeTypes, cutOff], 1, _callback, _error_callback)
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

