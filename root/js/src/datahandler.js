define(function () {
    var dh = {};

    // global variables
    dh.DataStore = [];
    dh.DataRepositories = [];
    var TypeData;
    var CallbackList;
    var DataRepositoriesCount;
    var DataRepositoryDefault;

    // set up / reset the DataHandler, adding initial repositories

    // get / set
    dh.repository = function (name, value) {
        if( typeof value !== 'undefined' &&
            typeof name  !== 'undefined' ) {
            return dh.DataRepositories[name] = value;
        } else if( typeof name !== 'undefined' ) {
            return dh.DataRepositories[name];
        } else {
            return dh.DataRepositories;
        }
    }
    dh.repositories = function () { return dh.repository(); }

    dh.initialize_data_storage = function (repositories) {
        dh.DataStore = [];
        TypeData = [];
        TypeData['types'] = [];
        TypeData['type_count'] = 0;
        CallbackList = [];
        dh.DataRepositories = [];
        DataRepositoriesCount = 0;
        DataRepositoryDefault = null;

        if (repositories) {
            for (var i = 0; i < repositories.length; i++) {
                dh.DataRepositories[repositories[i].id] = repositories[i];
                DataRepositoriesCount++;
                if (DataRepositoriesCount == 1) {
                    DataRepositoryDefault = dh.DataRepositories[repositories[i].id];
                }
            }
        }
    };

    // generic data loader
    // given a DOM id, interprets the innerHTML of the element as JSON data and loads it into the DataStore
    // given a JSON data structure, loads it into the DataStore


    dh.load_data = function (id_or_data, no_clear, type, repo_type) {
        var new_data;
        if (typeof(id_or_data) == 'string') {
            var elem = document.getElementById(id);
            if (elem) {
                new_data = JSON.parse(elem.innerHTML);
                if (!no_clear) {
                    document.getElementById(id).innerHTML = "";
                }
            }
        } else {
            new_data = id_or_data;
        }

        if (new_data) {
            switch (repo_type) {
                case 'default':
                    if (!new_data.length) {
                        new_data = [{
                            'type': type,
                            'data': [new_data]
                        }];
                    }
                    if (typeof(new_data[0]) != 'object') {
                        var dataids = [];
                        for (i=0; i<new_data.length; i++) {
                            dataids.push( { 'id': new_data[i] } );
                        }
                        new_data = [ { 'type': type, 'data': dataids } ];
                    }
                    break;
                case 'shock':
                    var parsed = [];
                    new_data = new_data.D;
                    for (i=0; i<new_data.length; i++) {
                        parsed.push(new_data[i].attributes);
                    }
                    new_data = [ { 'type': type, 'data': parsed } ];
                    break;
                case 'cdmi':
		var parsed = [];
		for (i in new_data) {
		  parsed.push(new_data[i]);
		}
                    new_data = [ { 'type': type, 'data': parsed } ];
                    break; 
            }
            for (var i = 0; i < new_data.length; i++) {
                if (new_data[i].type) {
                    var type = new_data[i].type;
                    if (!TypeData['types'][type]) {
                        dh.DataStore[type] = [];
                        TypeData['type_count']++;
                        TypeData['types'][type] = 0;
                        if (new_data[i].type_description) {
                            TypeData['type_description'][type] = new_data[i].type_description;
                        }
                    }
                    for (var h = 0; h < new_data[i].data.length; h++) {
                        if (!dh.DataStore[type][new_data[i].data[h].id]) {
                            TypeData['types'][type]++;
                        }
                        dh.DataStore[type][new_data[i].data[h].id] = new_data[i].data[h];
                    }
                }
            }
        }
    };

    // adds / replaces a repository in the dh.DataRepositories list


    dh.add_repository = function (repository) {
      if (repository && repository.id) {
	dh.DataRepositories[repository.id] = repository;
	DataRepositoriesCount++;
	if (repository.default ||DataRepositoryDefault == null) {
	  DataRepositoryDefault = dh.DataRepositories[repository.id];
	}
      }
      if (repository.hasOwnProperty('type') && repository.type === 'cdmi' ) {
	Iris.require("cdmi.js").then( function () { 
	    var API = {
	      "API": new CDMI_API(repository.url),
	      "EntityAPI": new CDMI_EntityAPI(repository.url)
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
	      repository.api = API;
	      repository.api_functions = API_functions;
	      repository.resources = fns;
	  });
      }
    };
    
    // removes a repository from the dh.DataRepositories list
    
    
    dh.remove_repository = function (id) {
      if (id && dh.DataRepositories[id]) {
	dh.DataRepositories[id] = null;
	DataRepositoriesCount--;
	if (DataRepositoryCount == 1) {
	  for (var i in dh.DataRepositories) {
	    DataRepositoryDefault = dh.DataRepositories[i];
	  }
	}
      }
    };
    
    // sets the default repository
    
    
    dh.default_repository = function (id) {
      if (id && dh.DataRepositories[id]) {
	DataRepositoryDefault = dh.DataRepositories[id];
      }
      return DataRepositoryDefault;
    };
    
    // event handler for an input type file element, which interprets the selected file(s)
    // as JSON data and loads them into the DataStore
    
    
    dh.file_upload = function (evt, callback_function, callback_parameters) {
      var files = evt.target.files;
      
      if (files.length) {
	for (var i = 0; i < files.length; i++) {
	  var f = files[i];
	  var reader = new FileReader();
	  reader.onload = (function(theFile) {
	      return function(e) {
		var new_data = JSON.parse(e.target.result);
		dh.load_data(new_data);
		callback_function.call(null, callback_parameters);
	      };
	    })(f);
	  reader.readAsText(f);
	}
      }
    };
    
    // client side data requestor
    // initiates data retrieval from a resource, saving callback functions /
    // paramters
    dh.get_objects = function (type, resource_params, callback_func, callback_params) {
      if (!CallbackList[type]) {
	CallbackList[type] = [ [callback_func, callback_params] ];
	dh.get_objects_from_repository(type, resource_params);
      } else {
	if (CallbackList[type].in_progress) {
	  if (!CallbackList[type]['new_params']) {
	    CallbackList[type]['new_params'] = [type, resource_params];
	    CallbackList[type]['new_list'] = [];
	  }
	  CallbackList[type].new_list[CallbackList[type].new_list.length] = [callback_func, callback_params];
	} else {
	  CallbackList[type][CallbackList[type].length] = [callback_func, callback_params];
	}
      }
      return 0;
    };
    
    // data retrieval function triggered by get_objects
    // queries the default DataRepository if none is defined in resource_params
    // sets requested query and REST parameters as well as authentication and initiates the asynchronous call
    // the data server needs to support CORS
    
    
    dh.get_objects_from_repository = function (type, resource_params) {
      var rest_params = "";
      var query_params = "";
      var authentication = "";
      
      var base_url = DataRepositoryDefault.url;
      if (DataRepositoryDefault.authentication) {
	authentication = "&" + DataRepositoryDefault.authentication;
      }
      var repo_type = 'default';
      var repo = DataRepositoryDefault;
      if (DataRepositoryDefault.type) {
	repo_type = DataRepositoryDefault.type;
      }
      
      if (resource_params) {
	if (resource_params.data_repository && dh.DataRepositories[resource_params.data_repository]) {
	  
	  repo = dh.DataRepositories[resource_params.data_repository];
	  if (repo.type) {
	    repo_type = repo.type;
	  }
	  base_url = dh.DataRepositories[resource_params.data_repository].url;
	  
	  if (dh.DataRepositories[resource_params.data_repository].authentication) {
	    authentication = "&" + dh.DataRepositories[resource_params.data_repository].authentication;
	  } else {
	    authentication = "";
	  }
	}
	if (resource_params.rest) {
	  rest_params += resource_params.rest.join("/") + "/";
	}
	if (repo_type == 'shock') {
	  if (! resource_params.query) {
	    resource_params.query = [];
	  }
	  resource_params.query.unshift("query", "1", "type", type);
	}
	if (resource_params && resource_params.query) {	  
	  query_params += "?" + resource_params.query[0] + "=" + resource_params.query[1];
	  for (var i = 2; i < resource_params.query.length - 1; i+=2) {
	    query_params += "&" + resource_params.query[i] + "=" + resource_params.query[i + 1];
	  }
	}
      }
      
      switch (repo_type) {
        case 'default':
          base_url += type + "/" + rest_params + query_params + authentication;
          do_ajax(base_url, type, repo_type);
          break;
        case 'shock':
          base_url += query_params + authentication;
          do_ajax(base_url, type, repo_type);
          break;
        case 'cdmi':
          var apiName = repo.api_functions[type];
          var api = repo.api[apiName];
	var data = api[type].apply(this, resource_params.query);
	dh.load_data(data, null, type, repo_type);
	if (CallbackList[type]) {
	  CallbackList[type]['in_progress'] = 1;
	  for (i = 0; i < CallbackList[type].length; i++) {
	    CallbackList[type][i][0].call(null, CallbackList[type][i][1]);
	  }
	  if (CallbackList[type].new_params) {
	    var new_params = CallbackList[type].new_params;
	    CallbackList[type] = CallbackList[type].new_list;
	    get_objects_from_repository(new_params[0], new_params[1]);
	  } else {
	    CallbackList[type] = null;
	  }
	}
	break;
      }
    }

    function do_ajax (base_url, type, repo_type) { 
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open('GET', base_url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open('GET', base_url);
        } else {
            console.log("your browser does not support CORS requests");
            return;
        }
        xhr.onload = function() {
	  dh.load_data(JSON.parse(xhr.responseText), null, type, repo_type);
            if (CallbackList[type]) {
                CallbackList[type]['in_progress'] = 1;
                for (i = 0; i < CallbackList[type].length; i++) {
                    CallbackList[type][i][0].call(null, CallbackList[type][i][1]);
                }
                if (CallbackList[type].new_params) {
                    var new_params = CallbackList[type].new_params;
                    CallbackList[type] = CallbackList[type].new_list;
                    get_objects_from_repository(new_params[0], new_params[1]);
                } else {
                    CallbackList[type] = null;
                }
            }
        };

        xhr.onerror = function() {
            console.log("data retrieval failed");
            return;
        };

        xhr.onabort = function() {
            console.log("data retrieval was aborted");
            return;
        };

        xhr.send();
    };

    // called by the returned data from a get_objects_from_repository call
    // loads the returned data into the DataStore, deletes the sent data from the DOM
    // and initiates all callback functions for the type


    dh.data_return = function (type, new_data) {
        type = type.toLowerCase();
        var old_script = document.getElementById('callback_script_' + type);
        document.getElementsByTagName('head')[0].removeChild(old_script);
        dh.load_data([{
            'type': type,
            'data': new_data
        }]);
        callback(type);
    };

    // function for backwards compatibility


    dh.ajax_result = function (new_data, type) {
        data_return(type, new_data);
    };

    // executes the callback functions for a given type


    dh.callback = function (type) {
        type = type.toLowerCase();
        for (var c = 0; c < CallbackList[type].length; c++) {
            CallbackList[type][c][0].call(null, CallbackList[type][c][1], type);
        }
        CallbackList[type] = null;
    };

    // deletes an object from the DataStore


    dh.delete_object = function (type, id) {
        type = type.toLowerCase();
        if (dh.DataStore[type][id]) {
            dh.DataStore[type][id] = null;
            TypeData['types'][type]--;
            if (TypeData['types'][type] == 0) {
                delete_object_type(type);
            }
        }
    };

    // deletes a set of objects from the DataStore


    dh.delete_objects = function (type, ids) {
        type = type.toLowerCase();
        for (var i = 0; i < ids.length; i++) {
            delete_object(type, ids[i]);
        }
    };

    // deletes an entire type from the DataStore


    dh.delete_object_type = function (type) {
        type = type.toLowerCase();
        if (TypeData['types'][type]) {
            TypeData['types'][type] = null;
            TypeData['type_count']--;
            dh.DataStore[type] = null;
        }
    };
    return dh;
});