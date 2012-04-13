

function CDMI_API(url) {

    var _url = url;


    this.fids_to_annotations = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_annotations", [fids]);
        return resp[0];
    }

    this.fids_to_annotations_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_annotations", [fids], 1, _callback)
    }

    this.fids_to_functions = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_functions", [fids]);
        return resp[0];
    }

    this.fids_to_functions_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_functions", [fids], 1, _callback)
    }

    this.fids_to_literature = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_literature", [fids]);
        return resp[0];
    }

    this.fids_to_literature_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_literature", [fids], 1, _callback)
    }

    this.fids_to_protein_families = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_protein_families", [fids]);
        return resp[0];
    }

    this.fids_to_protein_families_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_protein_families", [fids], 1, _callback)
    }

    this.fids_to_roles = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_roles", [fids]);
        return resp[0];
    }

    this.fids_to_roles_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_roles", [fids], 1, _callback)
    }

    this.fids_to_subsystems = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_subsystems", [fids]);
        return resp[0];
    }

    this.fids_to_subsystems_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_subsystems", [fids], 1, _callback)
    }

    this.fids_to_co_occurring_fids = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_co_occurring_fids", [fids]);
        return resp[0];
    }

    this.fids_to_co_occurring_fids_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_co_occurring_fids", [fids], 1, _callback)
    }

    this.fids_to_locations = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_locations", [fids]);
        return resp[0];
    }

    this.fids_to_locations_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_locations", [fids], 1, _callback)
    }

    this.locations_to_fids = function(region_of_dna_strings)
    {
	var resp = json_call_sync("CDMI_API.locations_to_fids", [region_of_dna_strings]);
        return resp[0];
    }

    this.locations_to_fids_async = function(region_of_dna_strings, _callback)
    {
	json_call_async("CDMI_API.locations_to_fids", [region_of_dna_strings], 1, _callback)
    }

    this.locations_to_dna_sequences = function(locations)
    {
	var resp = json_call_sync("CDMI_API.locations_to_dna_sequences", [locations]);
        return resp[0];
    }

    this.locations_to_dna_sequences_async = function(locations, _callback)
    {
	json_call_async("CDMI_API.locations_to_dna_sequences", [locations], 1, _callback)
    }

    this.proteins_to_fids = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.proteins_to_fids", [proteins]);
        return resp[0];
    }

    this.proteins_to_fids_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.proteins_to_fids", [proteins], 1, _callback)
    }

    this.proteins_to_protein_families = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.proteins_to_protein_families", [proteins]);
        return resp[0];
    }

    this.proteins_to_protein_families_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.proteins_to_protein_families", [proteins], 1, _callback)
    }

    this.proteins_to_literature = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.proteins_to_literature", [proteins]);
        return resp[0];
    }

    this.proteins_to_literature_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.proteins_to_literature", [proteins], 1, _callback)
    }

    this.proteins_to_functions = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.proteins_to_functions", [proteins]);
        return resp[0];
    }

    this.proteins_to_functions_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.proteins_to_functions", [proteins], 1, _callback)
    }

    this.proteins_to_roles = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.proteins_to_roles", [proteins]);
        return resp[0];
    }

    this.proteins_to_roles_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.proteins_to_roles", [proteins], 1, _callback)
    }

    this.roles_to_proteins = function(roles)
    {
	var resp = json_call_sync("CDMI_API.roles_to_proteins", [roles]);
        return resp[0];
    }

    this.roles_to_proteins_async = function(roles, _callback)
    {
	json_call_async("CDMI_API.roles_to_proteins", [roles], 1, _callback)
    }

    this.roles_to_subsystems = function(roles)
    {
	var resp = json_call_sync("CDMI_API.roles_to_subsystems", [roles]);
        return resp[0];
    }

    this.roles_to_subsystems_async = function(roles, _callback)
    {
	json_call_async("CDMI_API.roles_to_subsystems", [roles], 1, _callback)
    }

    this.roles_to_protein_families = function(roles)
    {
	var resp = json_call_sync("CDMI_API.roles_to_protein_families", [roles]);
        return resp[0];
    }

    this.roles_to_protein_families_async = function(roles, _callback)
    {
	json_call_async("CDMI_API.roles_to_protein_families", [roles], 1, _callback)
    }

    this.fids_to_coexpressed_fids = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_coexpressed_fids", [fids]);
        return resp[0];
    }

    this.fids_to_coexpressed_fids_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_coexpressed_fids", [fids], 1, _callback)
    }

    this.protein_families_to_fids = function(protein_families)
    {
	var resp = json_call_sync("CDMI_API.protein_families_to_fids", [protein_families]);
        return resp[0];
    }

    this.protein_families_to_fids_async = function(protein_families, _callback)
    {
	json_call_async("CDMI_API.protein_families_to_fids", [protein_families], 1, _callback)
    }

    this.protein_families_to_proteins = function(protein_families)
    {
	var resp = json_call_sync("CDMI_API.protein_families_to_proteins", [protein_families]);
        return resp[0];
    }

    this.protein_families_to_proteins_async = function(protein_families, _callback)
    {
	json_call_async("CDMI_API.protein_families_to_proteins", [protein_families], 1, _callback)
    }

    this.protein_families_to_functions = function(protein_families)
    {
	var resp = json_call_sync("CDMI_API.protein_families_to_functions", [protein_families]);
        return resp[0];
    }

    this.protein_families_to_functions_async = function(protein_families, _callback)
    {
	json_call_async("CDMI_API.protein_families_to_functions", [protein_families], 1, _callback)
    }

    this.protein_families_to_co_occurring_families = function(protein_families)
    {
	var resp = json_call_sync("CDMI_API.protein_families_to_co_occurring_families", [protein_families]);
        return resp[0];
    }

    this.protein_families_to_co_occurring_families_async = function(protein_families, _callback)
    {
	json_call_async("CDMI_API.protein_families_to_co_occurring_families", [protein_families], 1, _callback)
    }

    this.co_occurrence_evidence = function(pairs_of_fids)
    {
	var resp = json_call_sync("CDMI_API.co_occurrence_evidence", [pairs_of_fids]);
        return resp[0];
    }

    this.co_occurrence_evidence_async = function(pairs_of_fids, _callback)
    {
	json_call_async("CDMI_API.co_occurrence_evidence", [pairs_of_fids], 1, _callback)
    }

    this.contigs_to_sequences = function(contigs)
    {
	var resp = json_call_sync("CDMI_API.contigs_to_sequences", [contigs]);
        return resp[0];
    }

    this.contigs_to_sequences_async = function(contigs, _callback)
    {
	json_call_async("CDMI_API.contigs_to_sequences", [contigs], 1, _callback)
    }

    this.contigs_to_lengths = function(contigs)
    {
	var resp = json_call_sync("CDMI_API.contigs_to_lengths", [contigs]);
        return resp[0];
    }

    this.contigs_to_lengths_async = function(contigs, _callback)
    {
	json_call_async("CDMI_API.contigs_to_lengths", [contigs], 1, _callback)
    }

    this.contigs_to_md5s = function(contigs)
    {
	var resp = json_call_sync("CDMI_API.contigs_to_md5s", [contigs]);
        return resp[0];
    }

    this.contigs_to_md5s_async = function(contigs, _callback)
    {
	json_call_async("CDMI_API.contigs_to_md5s", [contigs], 1, _callback)
    }

    this.md5s_to_genomes = function(md5s)
    {
	var resp = json_call_sync("CDMI_API.md5s_to_genomes", [md5s]);
        return resp[0];
    }

    this.md5s_to_genomes_async = function(md5s, _callback)
    {
	json_call_async("CDMI_API.md5s_to_genomes", [md5s], 1, _callback)
    }

    this.genomes_to_md5s = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_md5s", [genomes]);
        return resp[0];
    }

    this.genomes_to_md5s_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.genomes_to_md5s", [genomes], 1, _callback)
    }

    this.genomes_to_contigs = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_contigs", [genomes]);
        return resp[0];
    }

    this.genomes_to_contigs_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.genomes_to_contigs", [genomes], 1, _callback)
    }

    this.genomes_to_fids = function(genomes, types_of_fids)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_fids", [genomes, types_of_fids]);
        return resp[0];
    }

    this.genomes_to_fids_async = function(genomes, types_of_fids, _callback)
    {
	json_call_async("CDMI_API.genomes_to_fids", [genomes, types_of_fids], 1, _callback)
    }

    this.genomes_to_taxonomies = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_taxonomies", [genomes]);
        return resp[0];
    }

    this.genomes_to_taxonomies_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.genomes_to_taxonomies", [genomes], 1, _callback)
    }

    this.genomes_to_subsystems = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_subsystems", [genomes]);
        return resp[0];
    }

    this.genomes_to_subsystems_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.genomes_to_subsystems", [genomes], 1, _callback)
    }

    this.subsystems_to_genomes = function(subsystems)
    {
	var resp = json_call_sync("CDMI_API.subsystems_to_genomes", [subsystems]);
        return resp[0];
    }

    this.subsystems_to_genomes_async = function(subsystems, _callback)
    {
	json_call_async("CDMI_API.subsystems_to_genomes", [subsystems], 1, _callback)
    }

    this.subsystems_to_fids = function(subsystems, genomes)
    {
	var resp = json_call_sync("CDMI_API.subsystems_to_fids", [subsystems, genomes]);
        return resp[0];
    }

    this.subsystems_to_fids_async = function(subsystems, genomes, _callback)
    {
	json_call_async("CDMI_API.subsystems_to_fids", [subsystems, genomes], 1, _callback)
    }

    this.subsystems_to_roles = function(subsystems, aux)
    {
	var resp = json_call_sync("CDMI_API.subsystems_to_roles", [subsystems, aux]);
        return resp[0];
    }

    this.subsystems_to_roles_async = function(subsystems, aux, _callback)
    {
	json_call_async("CDMI_API.subsystems_to_roles", [subsystems, aux], 1, _callback)
    }

    this.subsystems_to_spreadsheets = function(subsystems, genomes)
    {
	var resp = json_call_sync("CDMI_API.subsystems_to_spreadsheets", [subsystems, genomes]);
        return resp[0];
    }

    this.subsystems_to_spreadsheets_async = function(subsystems, genomes, _callback)
    {
	json_call_async("CDMI_API.subsystems_to_spreadsheets", [subsystems, genomes], 1, _callback)
    }

    this.all_roles_used_in_models = function()
    {
	var resp = json_call_sync("CDMI_API.all_roles_used_in_models", []);
        return resp[0];
    }

    this.all_roles_used_in_models_async = function(_callback)
    {
	json_call_async("CDMI_API.all_roles_used_in_models", [], 1, _callback)
    }

    this.complexes_to_complex_data = function(complexes)
    {
	var resp = json_call_sync("CDMI_API.complexes_to_complex_data", [complexes]);
        return resp[0];
    }

    this.complexes_to_complex_data_async = function(complexes, _callback)
    {
	json_call_async("CDMI_API.complexes_to_complex_data", [complexes], 1, _callback)
    }

    this.genomes_to_genome_data = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.genomes_to_genome_data", [genomes]);
        return resp[0];
    }

    this.genomes_to_genome_data_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.genomes_to_genome_data", [genomes], 1, _callback)
    }

    this.fids_to_regulon_data = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_regulon_data", [fids]);
        return resp[0];
    }

    this.fids_to_regulon_data_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_regulon_data", [fids], 1, _callback)
    }

    this.regulons_to_fids = function(regulons)
    {
	var resp = json_call_sync("CDMI_API.regulons_to_fids", [regulons]);
        return resp[0];
    }

    this.regulons_to_fids_async = function(regulons, _callback)
    {
	json_call_async("CDMI_API.regulons_to_fids", [regulons], 1, _callback)
    }

    this.fids_to_feature_data = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_feature_data", [fids]);
        return resp[0];
    }

    this.fids_to_feature_data_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_feature_data", [fids], 1, _callback)
    }

    this.equiv_sequence_assertions = function(proteins)
    {
	var resp = json_call_sync("CDMI_API.equiv_sequence_assertions", [proteins]);
        return resp[0];
    }

    this.equiv_sequence_assertions_async = function(proteins, _callback)
    {
	json_call_async("CDMI_API.equiv_sequence_assertions", [proteins], 1, _callback)
    }

    this.fids_to_atomic_regulons = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_atomic_regulons", [fids]);
        return resp[0];
    }

    this.fids_to_atomic_regulons_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_atomic_regulons", [fids], 1, _callback)
    }

    this.atomic_regulons_to_fids = function(atomic_regulons)
    {
	var resp = json_call_sync("CDMI_API.atomic_regulons_to_fids", [atomic_regulons]);
        return resp[0];
    }

    this.atomic_regulons_to_fids_async = function(atomic_regulons, _callback)
    {
	json_call_async("CDMI_API.atomic_regulons_to_fids", [atomic_regulons], 1, _callback)
    }

    this.fids_to_protein_sequences = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_protein_sequences", [fids]);
        return resp[0];
    }

    this.fids_to_protein_sequences_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_protein_sequences", [fids], 1, _callback)
    }

    this.fids_to_proteins = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_proteins", [fids]);
        return resp[0];
    }

    this.fids_to_proteins_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_proteins", [fids], 1, _callback)
    }

    this.fids_to_dna_sequences = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_dna_sequences", [fids]);
        return resp[0];
    }

    this.fids_to_dna_sequences_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_dna_sequences", [fids], 1, _callback)
    }

    this.roles_to_fids = function(roles, genomes)
    {
	var resp = json_call_sync("CDMI_API.roles_to_fids", [roles, genomes]);
        return resp[0];
    }

    this.roles_to_fids_async = function(roles, genomes, _callback)
    {
	json_call_async("CDMI_API.roles_to_fids", [roles, genomes], 1, _callback)
    }

    this.reactions_to_complexes = function(reactions)
    {
	var resp = json_call_sync("CDMI_API.reactions_to_complexes", [reactions]);
        return resp[0];
    }

    this.reactions_to_complexes_async = function(reactions, _callback)
    {
	json_call_async("CDMI_API.reactions_to_complexes", [reactions], 1, _callback)
    }

    this.reaction_strings = function(reactions, name_parameter)
    {
	var resp = json_call_sync("CDMI_API.reaction_strings", [reactions, name_parameter]);
        return resp[0];
    }

    this.reaction_strings_async = function(reactions, name_parameter, _callback)
    {
	json_call_async("CDMI_API.reaction_strings", [reactions, name_parameter], 1, _callback)
    }

    this.roles_to_complexes = function(roles)
    {
	var resp = json_call_sync("CDMI_API.roles_to_complexes", [roles]);
        return resp[0];
    }

    this.roles_to_complexes_async = function(roles, _callback)
    {
	json_call_async("CDMI_API.roles_to_complexes", [roles], 1, _callback)
    }

    this.complexes_to_roles = function(complexes)
    {
	var resp = json_call_sync("CDMI_API.complexes_to_roles", [complexes]);
        return resp[0];
    }

    this.complexes_to_roles_async = function(complexes, _callback)
    {
	json_call_async("CDMI_API.complexes_to_roles", [complexes], 1, _callback)
    }

    this.fids_to_subsystem_data = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_subsystem_data", [fids]);
        return resp[0];
    }

    this.fids_to_subsystem_data_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_subsystem_data", [fids], 1, _callback)
    }

    this.representative = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.representative", [genomes]);
        return resp[0];
    }

    this.representative_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.representative", [genomes], 1, _callback)
    }

    this.otu_members = function(genomes)
    {
	var resp = json_call_sync("CDMI_API.otu_members", [genomes]);
        return resp[0];
    }

    this.otu_members_async = function(genomes, _callback)
    {
	json_call_async("CDMI_API.otu_members", [genomes], 1, _callback)
    }

    this.fids_to_genomes = function(fids)
    {
	var resp = json_call_sync("CDMI_API.fids_to_genomes", [fids]);
        return resp[0];
    }

    this.fids_to_genomes_async = function(fids, _callback)
    {
	json_call_async("CDMI_API.fids_to_genomes", [fids], 1, _callback)
    }

    this.text_search = function(input, start, count, entities)
    {
	var resp = json_call_sync("CDMI_API.text_search", [input, start, count, entities]);
        return resp[0];
    }

    this.text_search_async = function(input, start, count, entities, _callback)
    {
	json_call_async("CDMI_API.text_search", [input, start, count, entities], 1, _callback)
    }

    function _json_call_prepare(url, method, params, async_flag)
    {
	var rpc = { 'params' : params,
		    'method' : method,
		    'version': "1.1",
	}
	
	var body = JSON.stringify(rpc);
	
	var http = new XMLHttpRequest();
	
	http.open("POST", url, async_flag);
	
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", body.length);
	http.setRequestHeader("Connection", "close");
	return [http, body];
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



function CDMI_EntityAPI(url) {

    var _url = url;


    this.get_entity_AlignmentTree = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_AlignmentTree", [ids, fields]);
        return resp[0];
    }

    this.get_entity_AlignmentTree_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_AlignmentTree", [ids, fields], 1, _callback)
    }

    this.query_entity_AlignmentTree = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_AlignmentTree", [qry, fields]);
        return resp[0];
    }

    this.query_entity_AlignmentTree_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_AlignmentTree", [qry, fields], 1, _callback)
    }

    this.all_entities_AlignmentTree = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_AlignmentTree", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_AlignmentTree_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_AlignmentTree", [start, count, fields], 1, _callback)
    }

    this.get_entity_Annotation = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Annotation", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Annotation_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Annotation", [ids, fields], 1, _callback)
    }

    this.query_entity_Annotation = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Annotation", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Annotation_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Annotation", [qry, fields], 1, _callback)
    }

    this.all_entities_Annotation = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Annotation", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Annotation_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Annotation", [start, count, fields], 1, _callback)
    }

    this.get_entity_AtomicRegulon = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_AtomicRegulon", [ids, fields]);
        return resp[0];
    }

    this.get_entity_AtomicRegulon_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_AtomicRegulon", [ids, fields], 1, _callback)
    }

    this.query_entity_AtomicRegulon = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_AtomicRegulon", [qry, fields]);
        return resp[0];
    }

    this.query_entity_AtomicRegulon_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_AtomicRegulon", [qry, fields], 1, _callback)
    }

    this.all_entities_AtomicRegulon = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_AtomicRegulon", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_AtomicRegulon_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_AtomicRegulon", [start, count, fields], 1, _callback)
    }

    this.get_entity_Attribute = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Attribute", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Attribute_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Attribute", [ids, fields], 1, _callback)
    }

    this.query_entity_Attribute = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Attribute", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Attribute_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Attribute", [qry, fields], 1, _callback)
    }

    this.all_entities_Attribute = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Attribute", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Attribute_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Attribute", [start, count, fields], 1, _callback)
    }

    this.get_entity_Biomass = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Biomass", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Biomass_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Biomass", [ids, fields], 1, _callback)
    }

    this.query_entity_Biomass = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Biomass", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Biomass_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Biomass", [qry, fields], 1, _callback)
    }

    this.all_entities_Biomass = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Biomass", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Biomass_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Biomass", [start, count, fields], 1, _callback)
    }

    this.get_entity_BiomassCompound = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_BiomassCompound", [ids, fields]);
        return resp[0];
    }

    this.get_entity_BiomassCompound_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_BiomassCompound", [ids, fields], 1, _callback)
    }

    this.query_entity_BiomassCompound = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_BiomassCompound", [qry, fields]);
        return resp[0];
    }

    this.query_entity_BiomassCompound_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_BiomassCompound", [qry, fields], 1, _callback)
    }

    this.all_entities_BiomassCompound = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_BiomassCompound", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_BiomassCompound_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_BiomassCompound", [start, count, fields], 1, _callback)
    }

    this.get_entity_Compartment = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Compartment", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Compartment_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Compartment", [ids, fields], 1, _callback)
    }

    this.query_entity_Compartment = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Compartment", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Compartment_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Compartment", [qry, fields], 1, _callback)
    }

    this.all_entities_Compartment = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Compartment", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Compartment_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Compartment", [start, count, fields], 1, _callback)
    }

    this.get_entity_Complex = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Complex", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Complex_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Complex", [ids, fields], 1, _callback)
    }

    this.query_entity_Complex = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Complex", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Complex_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Complex", [qry, fields], 1, _callback)
    }

    this.all_entities_Complex = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Complex", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Complex_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Complex", [start, count, fields], 1, _callback)
    }

    this.get_entity_Compound = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Compound", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Compound_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Compound", [ids, fields], 1, _callback)
    }

    this.query_entity_Compound = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Compound", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Compound_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Compound", [qry, fields], 1, _callback)
    }

    this.all_entities_Compound = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Compound", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Compound_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Compound", [start, count, fields], 1, _callback)
    }

    this.get_entity_Contig = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Contig", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Contig_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Contig", [ids, fields], 1, _callback)
    }

    this.query_entity_Contig = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Contig", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Contig_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Contig", [qry, fields], 1, _callback)
    }

    this.all_entities_Contig = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Contig", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Contig_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Contig", [start, count, fields], 1, _callback)
    }

    this.get_entity_ContigChunk = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ContigChunk", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ContigChunk_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ContigChunk", [ids, fields], 1, _callback)
    }

    this.query_entity_ContigChunk = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ContigChunk", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ContigChunk_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ContigChunk", [qry, fields], 1, _callback)
    }

    this.all_entities_ContigChunk = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ContigChunk", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ContigChunk_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ContigChunk", [start, count, fields], 1, _callback)
    }

    this.get_entity_ContigSequence = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ContigSequence", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ContigSequence_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ContigSequence", [ids, fields], 1, _callback)
    }

    this.query_entity_ContigSequence = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ContigSequence", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ContigSequence_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ContigSequence", [qry, fields], 1, _callback)
    }

    this.all_entities_ContigSequence = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ContigSequence", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ContigSequence_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ContigSequence", [start, count, fields], 1, _callback)
    }

    this.get_entity_CoregulatedSet = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_CoregulatedSet", [ids, fields]);
        return resp[0];
    }

    this.get_entity_CoregulatedSet_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_CoregulatedSet", [ids, fields], 1, _callback)
    }

    this.query_entity_CoregulatedSet = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_CoregulatedSet", [qry, fields]);
        return resp[0];
    }

    this.query_entity_CoregulatedSet_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_CoregulatedSet", [qry, fields], 1, _callback)
    }

    this.all_entities_CoregulatedSet = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_CoregulatedSet", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_CoregulatedSet_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_CoregulatedSet", [start, count, fields], 1, _callback)
    }

    this.get_entity_Diagram = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Diagram", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Diagram_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Diagram", [ids, fields], 1, _callback)
    }

    this.query_entity_Diagram = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Diagram", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Diagram_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Diagram", [qry, fields], 1, _callback)
    }

    this.all_entities_Diagram = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Diagram", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Diagram_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Diagram", [start, count, fields], 1, _callback)
    }

    this.get_entity_EcNumber = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_EcNumber", [ids, fields]);
        return resp[0];
    }

    this.get_entity_EcNumber_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_EcNumber", [ids, fields], 1, _callback)
    }

    this.query_entity_EcNumber = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_EcNumber", [qry, fields]);
        return resp[0];
    }

    this.query_entity_EcNumber_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_EcNumber", [qry, fields], 1, _callback)
    }

    this.all_entities_EcNumber = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_EcNumber", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_EcNumber_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_EcNumber", [start, count, fields], 1, _callback)
    }

    this.get_entity_Experiment = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Experiment", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Experiment_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Experiment", [ids, fields], 1, _callback)
    }

    this.query_entity_Experiment = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Experiment", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Experiment_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Experiment", [qry, fields], 1, _callback)
    }

    this.all_entities_Experiment = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Experiment", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Experiment_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Experiment", [start, count, fields], 1, _callback)
    }

    this.get_entity_Family = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Family", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Family_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Family", [ids, fields], 1, _callback)
    }

    this.query_entity_Family = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Family", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Family_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Family", [qry, fields], 1, _callback)
    }

    this.all_entities_Family = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Family", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Family_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Family", [start, count, fields], 1, _callback)
    }

    this.get_entity_Feature = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Feature", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Feature_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Feature", [ids, fields], 1, _callback)
    }

    this.query_entity_Feature = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Feature", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Feature_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Feature", [qry, fields], 1, _callback)
    }

    this.all_entities_Feature = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Feature", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Feature_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Feature", [start, count, fields], 1, _callback)
    }

    this.get_entity_Genome = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Genome", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Genome_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Genome", [ids, fields], 1, _callback)
    }

    this.query_entity_Genome = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Genome", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Genome_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Genome", [qry, fields], 1, _callback)
    }

    this.all_entities_Genome = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Genome", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Genome_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Genome", [start, count, fields], 1, _callback)
    }

    this.get_entity_Identifier = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Identifier", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Identifier_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Identifier", [ids, fields], 1, _callback)
    }

    this.query_entity_Identifier = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Identifier", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Identifier_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Identifier", [qry, fields], 1, _callback)
    }

    this.all_entities_Identifier = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Identifier", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Identifier_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Identifier", [start, count, fields], 1, _callback)
    }

    this.get_entity_Media = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Media", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Media_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Media", [ids, fields], 1, _callback)
    }

    this.query_entity_Media = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Media", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Media_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Media", [qry, fields], 1, _callback)
    }

    this.all_entities_Media = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Media", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Media_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Media", [start, count, fields], 1, _callback)
    }

    this.get_entity_Model = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Model", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Model_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Model", [ids, fields], 1, _callback)
    }

    this.query_entity_Model = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Model", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Model_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Model", [qry, fields], 1, _callback)
    }

    this.all_entities_Model = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Model", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Model_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Model", [start, count, fields], 1, _callback)
    }

    this.get_entity_ModelCompartment = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ModelCompartment", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ModelCompartment_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ModelCompartment", [ids, fields], 1, _callback)
    }

    this.query_entity_ModelCompartment = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ModelCompartment", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ModelCompartment_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ModelCompartment", [qry, fields], 1, _callback)
    }

    this.all_entities_ModelCompartment = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ModelCompartment", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ModelCompartment_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ModelCompartment", [start, count, fields], 1, _callback)
    }

    this.get_entity_OTU = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_OTU", [ids, fields]);
        return resp[0];
    }

    this.get_entity_OTU_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_OTU", [ids, fields], 1, _callback)
    }

    this.query_entity_OTU = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_OTU", [qry, fields]);
        return resp[0];
    }

    this.query_entity_OTU_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_OTU", [qry, fields], 1, _callback)
    }

    this.all_entities_OTU = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_OTU", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_OTU_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_OTU", [start, count, fields], 1, _callback)
    }

    this.get_entity_PairSet = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_PairSet", [ids, fields]);
        return resp[0];
    }

    this.get_entity_PairSet_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_PairSet", [ids, fields], 1, _callback)
    }

    this.query_entity_PairSet = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_PairSet", [qry, fields]);
        return resp[0];
    }

    this.query_entity_PairSet_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_PairSet", [qry, fields], 1, _callback)
    }

    this.all_entities_PairSet = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_PairSet", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_PairSet_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_PairSet", [start, count, fields], 1, _callback)
    }

    this.get_entity_Pairing = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Pairing", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Pairing_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Pairing", [ids, fields], 1, _callback)
    }

    this.query_entity_Pairing = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Pairing", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Pairing_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Pairing", [qry, fields], 1, _callback)
    }

    this.all_entities_Pairing = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Pairing", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Pairing_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Pairing", [start, count, fields], 1, _callback)
    }

    this.get_entity_ProbeSet = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ProbeSet", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ProbeSet_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ProbeSet", [ids, fields], 1, _callback)
    }

    this.query_entity_ProbeSet = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ProbeSet", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ProbeSet_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ProbeSet", [qry, fields], 1, _callback)
    }

    this.all_entities_ProbeSet = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ProbeSet", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ProbeSet_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ProbeSet", [start, count, fields], 1, _callback)
    }

    this.get_entity_ProteinSequence = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ProteinSequence", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ProteinSequence_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ProteinSequence", [ids, fields], 1, _callback)
    }

    this.query_entity_ProteinSequence = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ProteinSequence", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ProteinSequence_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ProteinSequence", [qry, fields], 1, _callback)
    }

    this.all_entities_ProteinSequence = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ProteinSequence", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ProteinSequence_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ProteinSequence", [start, count, fields], 1, _callback)
    }

    this.get_entity_Publication = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Publication", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Publication_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Publication", [ids, fields], 1, _callback)
    }

    this.query_entity_Publication = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Publication", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Publication_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Publication", [qry, fields], 1, _callback)
    }

    this.all_entities_Publication = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Publication", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Publication_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Publication", [start, count, fields], 1, _callback)
    }

    this.get_entity_Reaction = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Reaction", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Reaction_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Reaction", [ids, fields], 1, _callback)
    }

    this.query_entity_Reaction = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Reaction", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Reaction_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Reaction", [qry, fields], 1, _callback)
    }

    this.all_entities_Reaction = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Reaction", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Reaction_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Reaction", [start, count, fields], 1, _callback)
    }

    this.get_entity_ReactionRule = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_ReactionRule", [ids, fields]);
        return resp[0];
    }

    this.get_entity_ReactionRule_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_ReactionRule", [ids, fields], 1, _callback)
    }

    this.query_entity_ReactionRule = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_ReactionRule", [qry, fields]);
        return resp[0];
    }

    this.query_entity_ReactionRule_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_ReactionRule", [qry, fields], 1, _callback)
    }

    this.all_entities_ReactionRule = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_ReactionRule", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_ReactionRule_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_ReactionRule", [start, count, fields], 1, _callback)
    }

    this.get_entity_Reagent = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Reagent", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Reagent_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Reagent", [ids, fields], 1, _callback)
    }

    this.query_entity_Reagent = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Reagent", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Reagent_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Reagent", [qry, fields], 1, _callback)
    }

    this.all_entities_Reagent = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Reagent", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Reagent_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Reagent", [start, count, fields], 1, _callback)
    }

    this.get_entity_Requirement = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Requirement", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Requirement_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Requirement", [ids, fields], 1, _callback)
    }

    this.query_entity_Requirement = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Requirement", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Requirement_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Requirement", [qry, fields], 1, _callback)
    }

    this.all_entities_Requirement = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Requirement", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Requirement_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Requirement", [start, count, fields], 1, _callback)
    }

    this.get_entity_Role = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Role", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Role_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Role", [ids, fields], 1, _callback)
    }

    this.query_entity_Role = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Role", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Role_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Role", [qry, fields], 1, _callback)
    }

    this.all_entities_Role = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Role", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Role_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Role", [start, count, fields], 1, _callback)
    }

    this.get_entity_SSCell = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_SSCell", [ids, fields]);
        return resp[0];
    }

    this.get_entity_SSCell_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_SSCell", [ids, fields], 1, _callback)
    }

    this.query_entity_SSCell = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_SSCell", [qry, fields]);
        return resp[0];
    }

    this.query_entity_SSCell_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_SSCell", [qry, fields], 1, _callback)
    }

    this.all_entities_SSCell = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_SSCell", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_SSCell_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_SSCell", [start, count, fields], 1, _callback)
    }

    this.get_entity_SSRow = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_SSRow", [ids, fields]);
        return resp[0];
    }

    this.get_entity_SSRow_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_SSRow", [ids, fields], 1, _callback)
    }

    this.query_entity_SSRow = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_SSRow", [qry, fields]);
        return resp[0];
    }

    this.query_entity_SSRow_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_SSRow", [qry, fields], 1, _callback)
    }

    this.all_entities_SSRow = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_SSRow", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_SSRow_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_SSRow", [start, count, fields], 1, _callback)
    }

    this.get_entity_Scenario = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Scenario", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Scenario_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Scenario", [ids, fields], 1, _callback)
    }

    this.query_entity_Scenario = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Scenario", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Scenario_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Scenario", [qry, fields], 1, _callback)
    }

    this.all_entities_Scenario = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Scenario", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Scenario_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Scenario", [start, count, fields], 1, _callback)
    }

    this.get_entity_Source = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Source", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Source_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Source", [ids, fields], 1, _callback)
    }

    this.query_entity_Source = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Source", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Source_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Source", [qry, fields], 1, _callback)
    }

    this.all_entities_Source = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Source", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Source_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Source", [start, count, fields], 1, _callback)
    }

    this.get_entity_Subsystem = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Subsystem", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Subsystem_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Subsystem", [ids, fields], 1, _callback)
    }

    this.query_entity_Subsystem = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Subsystem", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Subsystem_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Subsystem", [qry, fields], 1, _callback)
    }

    this.all_entities_Subsystem = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Subsystem", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Subsystem_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Subsystem", [start, count, fields], 1, _callback)
    }

    this.get_entity_SubsystemClass = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_SubsystemClass", [ids, fields]);
        return resp[0];
    }

    this.get_entity_SubsystemClass_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_SubsystemClass", [ids, fields], 1, _callback)
    }

    this.query_entity_SubsystemClass = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_SubsystemClass", [qry, fields]);
        return resp[0];
    }

    this.query_entity_SubsystemClass_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_SubsystemClass", [qry, fields], 1, _callback)
    }

    this.all_entities_SubsystemClass = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_SubsystemClass", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_SubsystemClass_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_SubsystemClass", [start, count, fields], 1, _callback)
    }

    this.get_entity_TaxonomicGrouping = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_TaxonomicGrouping", [ids, fields]);
        return resp[0];
    }

    this.get_entity_TaxonomicGrouping_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_TaxonomicGrouping", [ids, fields], 1, _callback)
    }

    this.query_entity_TaxonomicGrouping = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_TaxonomicGrouping", [qry, fields]);
        return resp[0];
    }

    this.query_entity_TaxonomicGrouping_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_TaxonomicGrouping", [qry, fields], 1, _callback)
    }

    this.all_entities_TaxonomicGrouping = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_TaxonomicGrouping", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_TaxonomicGrouping_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_TaxonomicGrouping", [start, count, fields], 1, _callback)
    }

    this.get_entity_Variant = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Variant", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Variant_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Variant", [ids, fields], 1, _callback)
    }

    this.query_entity_Variant = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Variant", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Variant_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Variant", [qry, fields], 1, _callback)
    }

    this.all_entities_Variant = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Variant", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Variant_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Variant", [start, count, fields], 1, _callback)
    }

    this.get_entity_Variation = function(ids, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_entity_Variation", [ids, fields]);
        return resp[0];
    }

    this.get_entity_Variation_async = function(ids, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_entity_Variation", [ids, fields], 1, _callback)
    }

    this.query_entity_Variation = function(qry, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.query_entity_Variation", [qry, fields]);
        return resp[0];
    }

    this.query_entity_Variation_async = function(qry, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.query_entity_Variation", [qry, fields], 1, _callback)
    }

    this.all_entities_Variation = function(start, count, fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.all_entities_Variation", [start, count, fields]);
        return resp[0];
    }

    this.all_entities_Variation_async = function(start, count, fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.all_entities_Variation", [start, count, fields], 1, _callback)
    }

    this.get_relationship_AffectsLevelOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_AffectsLevelOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_AffectsLevelOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_AffectsLevelOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsAffectedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsAffectedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsAffectedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsAffectedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Aligns = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Aligns", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Aligns_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Aligns", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsAlignedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsAlignedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsAlignedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsAlignedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Concerns = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Concerns", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Concerns_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Concerns", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsATopicOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsATopicOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsATopicOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsATopicOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Contains = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Contains", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Contains_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Contains", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsContainedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsContainedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsContainedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsContainedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Controls = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Controls", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Controls_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Controls", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsControlledUsing = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsControlledUsing", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsControlledUsing_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsControlledUsing", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Describes = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Describes", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Describes_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Describes", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDescribedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDescribedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDescribedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDescribedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Displays = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Displays", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Displays_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Displays", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDisplayedOn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDisplayedOn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDisplayedOn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDisplayedOn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Encompasses = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Encompasses", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Encompasses_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Encompasses", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsEncompassedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsEncompassedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsEncompassedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsEncompassedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Formulated = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Formulated", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Formulated_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Formulated", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_WasFormulatedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_WasFormulatedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_WasFormulatedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_WasFormulatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_GeneratedLevelsFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_GeneratedLevelsFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_GeneratedLevelsFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_GeneratedLevelsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_WasGeneratedFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_WasGeneratedFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_WasGeneratedFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_WasGeneratedFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasAssertionFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasAssertionFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasAssertionFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasAssertionFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Asserts = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Asserts", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Asserts_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Asserts", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasCompoundAliasFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasCompoundAliasFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasCompoundAliasFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasCompoundAliasFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_UsesAliasForCompound = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_UsesAliasForCompound", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_UsesAliasForCompound_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_UsesAliasForCompound", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasIndicatedSignalFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasIndicatedSignalFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasIndicatedSignalFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasIndicatedSignalFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IndicatesSignalFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IndicatesSignalFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IndicatesSignalFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IndicatesSignalFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasMember = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasMember", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasMember_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasMember", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsMemberOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsMemberOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsMemberOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsMemberOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasParticipant = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasParticipant", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasParticipant_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasParticipant", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_ParticipatesIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_ParticipatesIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_ParticipatesIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_ParticipatesIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasPresenceOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasPresenceOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasPresenceOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasPresenceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsPresentIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsPresentIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsPresentIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsPresentIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasReactionAliasFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasReactionAliasFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasReactionAliasFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasReactionAliasFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_UsesAliasForReaction = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_UsesAliasForReaction", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_UsesAliasForReaction_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_UsesAliasForReaction", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasRepresentativeOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasRepresentativeOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasRepresentativeOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasRepresentativeOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRepresentedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRepresentedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRepresentedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRepresentedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasResultsIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasResultsIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasResultsIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasResultsIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasResultsFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasResultsFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasResultsFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasResultsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasSection = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasSection", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasSection_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasSection", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsSectionOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsSectionOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsSectionOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsSectionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasStep = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasStep", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasStep_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasStep", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsStepOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsStepOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsStepOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsStepOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasUsage = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasUsage", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasUsage_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasUsage", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsUsageOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsUsageOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsUsageOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsUsageOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasValueFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasValueFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasValueFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasValueFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasValueIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasValueIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasValueIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasValueIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Imported = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Imported", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Imported_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Imported", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_WasImportedFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_WasImportedFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_WasImportedFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_WasImportedFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Includes = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Includes", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Includes_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Includes", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsIncludedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsIncludedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsIncludedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsIncludedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IndicatedLevelsFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IndicatedLevelsFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IndicatedLevelsFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IndicatedLevelsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasLevelsFrom = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasLevelsFrom", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasLevelsFrom_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasLevelsFrom", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Involves = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Involves", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Involves_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Involves", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInvolvedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInvolvedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInvolvedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInvolvedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsARequirementIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsARequirementIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsARequirementIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsARequirementIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsARequirementOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsARequirementOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsARequirementOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsARequirementOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsAlignedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsAlignedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsAlignedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsAlignedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsAlignmentFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsAlignmentFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsAlignmentFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsAlignmentFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsAnnotatedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsAnnotatedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsAnnotatedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsAnnotatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Annotates = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Annotates", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Annotates_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Annotates", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsBindingSiteFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsBindingSiteFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsBindingSiteFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsBindingSiteFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsBoundBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsBoundBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsBoundBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsBoundBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsClassFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsClassFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsClassFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsClassFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInClass = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInClass", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInClass_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInClass", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsCollectionOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsCollectionOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsCollectionOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsCollectionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsCollectedInto = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsCollectedInto", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsCollectedInto_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsCollectedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsComposedOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsComposedOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsComposedOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsComposedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsComponentOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsComponentOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsComponentOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsComponentOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsComprisedOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsComprisedOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsComprisedOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsComprisedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Comprises = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Comprises", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Comprises_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Comprises", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsConfiguredBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsConfiguredBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsConfiguredBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsConfiguredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_ReflectsStateOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_ReflectsStateOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_ReflectsStateOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_ReflectsStateOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsConsistentWith = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsConsistentWith", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsConsistentWith_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsConsistentWith", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsConsistentTo = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsConsistentTo", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsConsistentTo_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsConsistentTo", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsCoregulatedWith = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsCoregulatedWith", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsCoregulatedWith_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsCoregulatedWith", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasCoregulationWith = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasCoregulationWith", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasCoregulationWith_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasCoregulationWith", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsCoupledTo = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsCoupledTo", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsCoupledTo_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsCoupledTo", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsCoupledWith = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsCoupledWith", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsCoupledWith_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsCoupledWith", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDefaultFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDefaultFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDefaultFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDefaultFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_RunsByDefaultIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_RunsByDefaultIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_RunsByDefaultIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_RunsByDefaultIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDefaultLocationOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDefaultLocationOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDefaultLocationOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDefaultLocationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasDefaultLocation = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasDefaultLocation", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasDefaultLocation_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasDefaultLocation", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDeterminedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDeterminedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDeterminedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDeterminedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Determines = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Determines", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Determines_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Determines", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDividedInto = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDividedInto", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDividedInto_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDividedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsDivisionOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsDivisionOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsDivisionOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsDivisionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsExemplarOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsExemplarOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsExemplarOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsExemplarOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasAsExemplar = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasAsExemplar", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasAsExemplar_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasAsExemplar", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsFamilyFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsFamilyFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsFamilyFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsFamilyFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_DeterminesFunctionOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_DeterminesFunctionOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_DeterminesFunctionOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_DeterminesFunctionOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsFormedOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsFormedOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsFormedOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsFormedOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsFormedInto = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsFormedInto", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsFormedInto_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsFormedInto", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsFunctionalIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsFunctionalIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsFunctionalIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsFunctionalIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasFunctional = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasFunctional", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasFunctional_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasFunctional", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsGroupFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsGroupFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsGroupFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsGroupFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInGroup = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInGroup", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInGroup_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInGroup", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsImplementedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsImplementedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsImplementedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsImplementedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Implements = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Implements", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Implements_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Implements", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInPair = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInPair", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInPair_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInPair", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsPairOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsPairOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsPairOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsPairOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInstantiatedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInstantiatedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInstantiatedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInstantiatedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInstanceOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInstanceOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInstanceOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInstanceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsLocatedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsLocatedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsLocatedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsLocatedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsLocusFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsLocusFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsLocusFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsLocusFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsModeledBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsModeledBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsModeledBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsModeledBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Models = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Models", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Models_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Models", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsNamedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsNamedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsNamedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsNamedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Names = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Names", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Names_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Names", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsOwnerOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsOwnerOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsOwnerOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsOwnerOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsOwnedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsOwnedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsOwnedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsOwnedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsProposedLocationOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsProposedLocationOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsProposedLocationOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsProposedLocationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasProposedLocationIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasProposedLocationIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasProposedLocationIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasProposedLocationIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsProteinFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsProteinFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsProteinFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsProteinFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Produces = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Produces", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Produces_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Produces", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRealLocationOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRealLocationOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRealLocationOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRealLocationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasRealLocationIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasRealLocationIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasRealLocationIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasRealLocationIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRegulatedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRegulatedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRegulatedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRegulatedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRegulatedSetOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRegulatedSetOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRegulatedSetOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRegulatedSetOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRelevantFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRelevantFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRelevantFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRelevantFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRelevantTo = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRelevantTo", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRelevantTo_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRelevantTo", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRequiredBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRequiredBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRequiredBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRequiredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Requires = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Requires", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Requires_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Requires", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRoleOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRoleOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRoleOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRoleOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasRole = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasRole", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasRole_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasRole", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRowOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRowOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRowOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRowOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsRoleFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsRoleFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsRoleFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsRoleFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsSequenceOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsSequenceOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsSequenceOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsSequenceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasAsSequence = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasAsSequence", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasAsSequence_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasAsSequence", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsSubInstanceOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsSubInstanceOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsSubInstanceOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsSubInstanceOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Validates = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Validates", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Validates_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Validates", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsSuperclassOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsSuperclassOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsSuperclassOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsSuperclassOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsSubclassOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsSubclassOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsSubclassOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsSubclassOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsTargetOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsTargetOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsTargetOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsTargetOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Targets = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Targets", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Targets_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Targets", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsTaxonomyOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsTaxonomyOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsTaxonomyOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsTaxonomyOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsInTaxa = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsInTaxa", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsInTaxa_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsInTaxa", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsTerminusFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsTerminusFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsTerminusFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsTerminusFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HasAsTerminus = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HasAsTerminus", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HasAsTerminus_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HasAsTerminus", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsTriggeredBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsTriggeredBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsTriggeredBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsTriggeredBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Triggers = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Triggers", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Triggers_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Triggers", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsUsedAs = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsUsedAs", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsUsedAs_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsUsedAs", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsUseOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsUseOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsUseOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsUseOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Manages = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Manages", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Manages_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Manages", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsManagedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsManagedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsManagedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsManagedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_OperatesIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_OperatesIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_OperatesIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_OperatesIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsUtilizedIn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsUtilizedIn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsUtilizedIn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsUtilizedIn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Overlaps = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Overlaps", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Overlaps_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Overlaps", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IncludesPartOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IncludesPartOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IncludesPartOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IncludesPartOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_ParticipatesAs = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_ParticipatesAs", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_ParticipatesAs_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_ParticipatesAs", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsParticipationOf = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsParticipationOf", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsParticipationOf_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsParticipationOf", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_ProducedResultsFor = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_ProducedResultsFor", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_ProducedResultsFor_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_ProducedResultsFor", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_HadResultsProducedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_HadResultsProducedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_HadResultsProducedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_HadResultsProducedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_ProjectsOnto = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_ProjectsOnto", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_ProjectsOnto_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_ProjectsOnto", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsProjectedOnto = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsProjectedOnto", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsProjectedOnto_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsProjectedOnto", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Provided = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Provided", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Provided_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Provided", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_WasProvidedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_WasProvidedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_WasProvidedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_WasProvidedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Shows = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Shows", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Shows_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Shows", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsShownOn = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsShownOn", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsShownOn_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsShownOn", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Submitted = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Submitted", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Submitted_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Submitted", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_WasSubmittedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_WasSubmittedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_WasSubmittedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_WasSubmittedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_Uses = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_Uses", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_Uses_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_Uses", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    this.get_relationship_IsUsedBy = function(ids, from_fields, rel_fields, to_fields)
    {
	var resp = json_call_sync("CDMI_EntityAPI.get_relationship_IsUsedBy", [ids, from_fields, rel_fields, to_fields]);
        return resp[0];
    }

    this.get_relationship_IsUsedBy_async = function(ids, from_fields, rel_fields, to_fields, _callback)
    {
	json_call_async("CDMI_EntityAPI.get_relationship_IsUsedBy", [ids, from_fields, rel_fields, to_fields], 1, _callback)
    }

    function _json_call_prepare(url, method, params, async_flag)
    {
	var rpc = { 'params' : params,
		    'method' : method,
		    'version': "1.1",
	}
	
	var body = JSON.stringify(rpc);
	
	var http = new XMLHttpRequest();
	
	http.open("POST", url, async_flag);
	
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/json");
	http.setRequestHeader("Content-length", body.length);
	http.setRequestHeader("Connection", "close");
	return [http, body];
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

if(typeof exports !== 'undefined') {
    exports.CDMI_API = CDMI_API;
    exports.CDMI_EntityAPI = CDMI_EntityAPI;
}

