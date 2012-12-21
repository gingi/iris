

function Genotype_PhenotypeAPI(url) {

    var _url = url;


    this.get_experiments = function(kb_genome)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.get_experiments", [kb_genome]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.get_experiments", [kb_genome]);
        return resp[0];
    }

    this.get_experiments_async = function(kb_genome, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.get_experiments", [kb_genome], 1, _callback, _error_callback)
    }

    this.get_traits = function(kb_study_experiment)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.get_traits", [kb_study_experiment]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.get_traits", [kb_study_experiment]);
        return resp[0];
    }

    this.get_traits_async = function(kb_study_experiment, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.get_traits", [kb_study_experiment], 1, _callback, _error_callback)
    }

    this.traits_to_variations = function(trait, pvaluecutoff)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.traits_to_variations", [trait, pvaluecutoff]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.traits_to_variations", [trait, pvaluecutoff]);
        return resp[0];
    }

    this.traits_to_variations_async = function(trait, pvaluecutoff, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_variations", [trait, pvaluecutoff], 1, _callback, _error_callback)
    }

    this.chromosome_position_from_variation_details = function(variation_details)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.chromosome_position_from_variation_details", [variation_details]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.chromosome_position_from_variation_details", [variation_details]);
        return resp[0];
    }

    this.chromosome_position_from_variation_details_async = function(variation_details, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.chromosome_position_from_variation_details", [variation_details], 1, _callback, _error_callback)
    }

    this.traits_to_genes = function(trait, pvaluecutoff, distance)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.traits_to_genes", [trait, pvaluecutoff, distance]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.traits_to_genes", [trait, pvaluecutoff, distance]);
        return resp[0];
    }

    this.traits_to_genes_async = function(trait, pvaluecutoff, distance, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_genes", [trait, pvaluecutoff, distance], 1, _callback, _error_callback)
    }

    this.variations_to_genes = function(chromosomal_positions, distance)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.variations_to_genes", [chromosomal_positions, distance]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.variations_to_genes", [chromosomal_positions, distance]);
        return resp[0];
    }

    this.variations_to_genes_async = function(chromosomal_positions, distance, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.variations_to_genes", [chromosomal_positions, distance], 1, _callback, _error_callback)
    }

    this.find_common_snps = function(trait_list_pvalue)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.find_common_snps", [trait_list_pvalue]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.find_common_snps", [trait_list_pvalue]);
        return resp[0];
    }

    this.find_common_snps_async = function(trait_list_pvalue, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.find_common_snps", [trait_list_pvalue], 1, _callback, _error_callback)
    }

    this.selected_locations_to_genes = function(trait, pmin, pmax, chromosomal_locations, distance)
    {
	var resp = json_call_ajax_sync("Genotype_PhenotypeAPI.selected_locations_to_genes", [trait, pmin, pmax, chromosomal_locations, distance]);
//	var resp = json_call_sync("Genotype_PhenotypeAPI.selected_locations_to_genes", [trait, pmin, pmax, chromosomal_locations, distance]);
        return resp[0];
    }

    this.selected_locations_to_genes_async = function(trait, pmin, pmax, chromosomal_locations, distance, _callback, _error_callback)
    {
	json_call_ajax_async("Genotype_PhenotypeAPI.selected_locations_to_genes", [trait, pmin, pmax, chromosomal_locations, distance], 1, _callback, _error_callback)
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

