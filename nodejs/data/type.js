// this is where data types come from

exports.index = function(req, res){ // GET /datatype
	// list all the data types from db
	// send relevant info to client
  res.send('data types index');
};

exports.new = function(req, res){ // GET /datatype/new
	// send a textarea to the client to define a new data type?
	// maybe if user has priviledges
  res.send('new data type');
};

exports.create = function(req, res){ // POST /datatype
	// validate? the POSTed object in the req and store in db
  res.send('create data type');
};

exports.show = function(req, res){ // GET /datatype/:id
	// send the data type to the client
	res.json(req.datatype);
};

exports.edit = function(req, res){ // GET /datatype/:id/edit
	// send a textarea to the client populated with the current data type
  res.send('edit data ' + req.datatype);
};

exports.update = function(req, res){ // PUT /datatype/:id
	// update the data type in the db
  res.send('update data ' + req.datatype);
};

exports.destroy = function(req, res){ // DELETE /datatype/:id
	// delete a data type from the db (check permissions)
  res.send('destroy data ' + req.datatype);
};

exports.load = function(id, fn){
	// this function fetches the data type specified by id from the db
  process.nextTick(function(){
		// need to fetch the object from mongodb
    fn(null, { id: id });
  });
};
