

function Genotype_PhenotypeAPI(url) {

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


    this.get_experiments = function(kb_genome, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.get_experiments", [kb_genome], 1, _callback, _error_callback)
    }

    this.get_experiments_async = function(kb_genome, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.get_experiments", [kb_genome], 1, _callback, _error_callback)
    }

    this.get_traits = function(kb_study_experiment, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.get_traits", [kb_study_experiment], 1, _callback, _error_callback)
    }

    this.get_traits_async = function(kb_study_experiment, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.get_traits", [kb_study_experiment], 1, _callback, _error_callback)
    }

    this.traits_to_variations = function(trait, pvaluecutoff, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_variations", [trait, pvaluecutoff], 1, _callback, _error_callback)
    }

    this.traits_to_variations_async = function(trait, pvaluecutoff, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_variations", [trait, pvaluecutoff], 1, _callback, _error_callback)
    }

    this.chromosome_position_from_variation_details = function(variation_details, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.chromosome_position_from_variation_details", [variation_details], 1, _callback, _error_callback)
    }

    this.chromosome_position_from_variation_details_async = function(variation_details, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.chromosome_position_from_variation_details", [variation_details], 1, _callback, _error_callback)
    }

    this.traits_to_genes = function(trait, pvaluecutoff, distance, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_genes", [trait, pvaluecutoff, distance], 1, _callback, _error_callback)
    }

    this.traits_to_genes_async = function(trait, pvaluecutoff, distance, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.traits_to_genes", [trait, pvaluecutoff, distance], 1, _callback, _error_callback)
    }

    this.variations_to_genes = function(chromosomal_positions, distance, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.variations_to_genes", [chromosomal_positions, distance], 1, _callback, _error_callback)
    }

    this.variations_to_genes_async = function(chromosomal_positions, distance, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.variations_to_genes", [chromosomal_positions, distance], 1, _callback, _error_callback)
    }

    this.find_common_snps = function(trait_list_pvalue, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.find_common_snps", [trait_list_pvalue], 1, _callback, _error_callback)
    }

    this.find_common_snps_async = function(trait_list_pvalue, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.find_common_snps", [trait_list_pvalue], 1, _callback, _error_callback)
    }

    this.selected_locations_to_genes = function(trait, pmin, pmax, chromosomal_locations, distance, _callback, _error_callback) {
        json_call_ajax_async("Genotype_PhenotypeAPI.selected_locations_to_genes", [trait, pmin, pmax, chromosomal_locations, distance], 1, _callback, _error_callback)
    }

    this.selected_locations_to_genes_async = function(trait, pmin, pmax, chromosomal_locations, distance, _callback, _error_callback) {
        deprecationWarning();
        json_call_ajax_async("Genotype_PhenotypeAPI.selected_locations_to_genes", [trait, pmin, pmax, chromosomal_locations, distance], 1, _callback, _error_callback)
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

