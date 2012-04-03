// global variables
var dh_DataStore;
var dh_TypeData;
var dh_CallbackList;
var dh_DataRepositories;
var dh_DataRepositoriesCount;
var dh_DataRepositoryDefault;

// set up / reset the DataHandler, adding initial repositories
function initialize_data_storage (repositories) {
  dh_DataStore = [];
  dh_TypeData = [];
  dh_TypeData['types'] = [];
  dh_TypeData['type_count'] = 0;
  dh_CallbackList = [];
  dh_DataRepositories = [];
  dh_DataRepositoriesCount = 0;
  dh_DataRepositoryDefault = null;

  if (repositories) {
    for (var i=0; i<repositories.length; i++) {
      dh_DataRepositories[repositories[i].id] = repositories[i];
      dh_DataRepositoriesCount++;
      if (dh_DataRepositoriesCount == 1) {
	dh_DataRepositoryDefault = dh_DataRepositories[repositories[i].id];
      }
    }
  }
}

// generic data loader
// given a DOM id, interprets the innerHTML of the element as JSON data and loads it into the dh_DataStore
// given a JSON data structure, loads it into the dh_DataStore
function load_data (id_or_data, no_clear, type) {
  var new_data;
  if (typeof(id_or_data) == 'string') {
    var elem = document.getElementById(id);
    if (elem) {
      new_data = JSON.parse(elem.innerHTML);
      if (! no_clear) {
	document.getElementById(id).innerHTML = "";
      }
    }
  } else {
    new_data = id_or_data;
  }
  
  if (new_data) {
    if (! new_data.length) {
      new_data = [ { 'type': type, 'data': [ new_data ] } ];
    }
    for (var i=0; i<new_data.length; i++) {
      if (new_data[i].type) {
	var type = new_data[i].type;
	if (! dh_TypeData['types'][type]) {
	  dh_DataStore[type] = [];
	  dh_TypeData['type_count']++;
	  dh_TypeData['types'][type] = 0;
	  if (new_data[i].type_description) {
	    dh_TypeData['type_description'][type] = new_data[i].type_description;
	  }
	}
	for (var h=0; h<new_data[i].data.length; h++) {
	  if (! dh_DataStore[type][new_data[i].data[h].id]) {
	    dh_TypeData['types'][type]++;
	  }
	  dh_DataStore[type][new_data[i].data[h].id] = new_data[i].data[h];
	}
      }
    }
  }
}

// adds / replaces a repository in the dh_DataRepositories list
function add_repository (repository) {
  if (repository && repository.id) {
    dh_DataRepositories[repository.id] = repository;
    dh_DataRepositoriesCount++;
    if (repository.default || dh_DataRepositoryDefault == null) {
      dh_DataRepositoryDefault = dh_DataRepositories[repository.id];
    }
  }
}

// removes a repository from the dh_DataRepositories list
function remove_repository (id) {
  if (id && dh_DataRepositories[id]) {
    dh_DataRepositories[id] = null;
    dh_DataRepositoriesCount--;
    if (DataRepositoryCount == 1) {
      for (var i in dh_DataRepositories) {
	dh_DataRepositoryDefault = dh_DataRepositories[i];
      }
    }
  }
}

// sets the default repository
function default_repository (id) {
  if (id && dh_DataRepositories[id]) {
    dh_DataRepositoryDefault = dh_DataRepositories[id];
  }
}

// event handler for an input type file element, which interprets the selected file(s)
// as JSON data and loads them into the dh_DataStore
function dh_file_upload (evt, callback_function, callback_parameters) {
  var files = evt.target.files;
  
  if (files.length) {
    for (var i=0; i<files.length; i++) {
      var f = files[i];
      var reader = new FileReader();
      reader.onload = (function(theFile) {
	  return function(e) {
	    var new_data = JSON.parse(e.target.result);
	    load_data(new_data);
	    callback_function.call(null, callback_parameters);
	  };
	})(f);
      reader.readAsText(f);
    }
  }
}

// client side data requestor
// initiates data retrieval from a resource, saving callback functions / paramters
function get_objects (type, resource_params, callback_func, callback_params) {
  if (! dh_CallbackList[type]) {
    dh_CallbackList[type] = [ [ callback_func, callback_params ] ];
    get_objects_from_repository(type, resource_params);
  } else {
    if (dh_CallbackList[type].in_progress) {
      if (! dh_CallbackList[type]['new_params']) {
	dh_CallbackList[type]['new_params'] = [ type, resource_params ];
	dh_CallbackList[type]['new_list'] = [];
      }
      dh_CallbackList[type].new_list[dh_CallbackList[type].new_list.length] = [ callback_func, callback_params ];
    } else {
      dh_CallbackList[type][dh_CallbackList[type].length] = [ callback_func, callback_params ];
    }
  }
  return 0;
}

// data retrieval function triggered by get_objects
// queries the default DataRepository if none is defined in resource_params
// sets requested query and REST parameters as well as authentication and initiates the asynchronous call
// the data server needs to support CORS
function get_objects_from_repository (type, resource_params) {
  var rest_params = "";
  var query_params = "";
  var base_url = dh_DataRepositoryDefault.url;
  var authentication = "";
  if (dh_DataRepositoryDefault.authentication) {
    authentication = "&" + dh_DataRepositoryDefault.authentication;
  }
  
  if (resource_params) {
    if (resource_params.data_repository && dh_DataRepositories[resource_params.data_repository]) {
      base_url = dh_DataRepositories[resource_params.data_repository].url;
      if (dh_DataRepositories[resource_params.data_repository].authentication) {
	authentication = "&" + dh_DataRepositories[resource_params.data_repository].authentication;
      } else {
	authentication = "";
      }
    }
    if (resource_params.rest) {
      rest_params += resource_params.rest.join("/");
    }
    if (resource_params && resource_params.query) {
      for (var i=0; i<resource_params.query.length - 1; i++) {
	query_params += "&" + resource_params.query[i] + "=" + resource_params.query[i+1];
      }
    }
  }

  base_url += type + "/" + rest_params + query_params + authentication;
  
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open('GET', base_url, true);
  } else if (typeof XDomainRequest != "undefined") {
    xhr = new XDomainRequest();
    xhr.open('GET', base_url);
  } else {
    alert("your browser does not support CORS requests");
    return;
  }
  xhr.onload = function() {
    load_data(JSON.parse(xhr.responseText), null, type);
    if (dh_CallbackList[type]) {
      dh_CallbackList[type]['in_progress'] = 1;
      for (i=0;i<dh_CallbackList[type].length;i++) {
	dh_CallbackList[type][i][0].call(null, dh_CallbackList[type][i][1]);
      }
      if (dh_CallbackList[type].new_params) {
	var new_params = dh_CallbackList[type].new_params;
	dh_CallbackList[type] = dh_CallbackList[type].new_list;
	get_objects_from_repository(new_params[0], new_params[1]);
      } else {
	dh_CallbackList[type] = null;
      }
    }
  };
  
  xhr.onerror = function() {
    alert("data retrieval failed");
    return;
  };
  
  xhr.onabort = function() {
    alert("data retrieval was aborted");
    return;
  }

  xhr.send();
}

// called by the returned data from a get_objects_from_repository call
// loads the returned data into the dh_DataStore, deletes the sent data from the DOM
// and initiates all callback functions for the type
function data_return (type, new_data) {
  type = type.toLowerCase();
  var old_script = document.getElementById('callback_script_'+type);
  document.getElementsByTagName('head')[0].removeChild(old_script);
  load_data([ { 'type': type, 'data': new_data } ]);
  dh_callback(type);
}

// function for backwards compatibility
function ajax_result (new_data, type) {
  data_return(type, new_data);
}

// executes the callback functions for a given type
function dh_callback (type) {
  type = type.toLowerCase();
  for (var c=0;c<dh_CallbackList[type].length;c++) {
    dh_CallbackList[type][c][0].call(null, dh_CallbackList[type][c][1], type);
  }
  dh_CallbackList[type] = null;
}

// deletes an object from the dh_DataStore
function delete_object (type, id) {
  type = type.toLowerCase();
  if (dh_DataStore[type][id]) {
    dh_DataStore[type][id] = null;
    dh_TypeData['types'][type]--;
    if (dh_TypeData['types'][type] == 0) {
      delete_object_type(type);
    }
  }
}

// deletes a set of objects from the dh_DataStore
function delete_objects (type, ids) {
  type = type.toLowerCase();
  for (var i=0; i<ids.length; i++) {
    delete_object(type, ids[i]);
  }
}

// deletes an entire type from the dh_DataStore
function delete_object_type (type) {
  type = type.toLowerCase();
  if (dh_TypeData['types'][type]) {
    dh_TypeData['types'][type] = null;
    dh_TypeData['type_count']--;
    dh_DataStore[type] = null;
  }
}
