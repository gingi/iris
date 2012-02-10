// N.B. the name of the resource is singularized by lingo from gwas to gwa

// load the db loader - this is shared among all resources
// fetch_from_mongodb('gwas',id);

exports.index = function(req, res){ // GET /gwas
	// select gwas metadata from db (limit by user?)
	// send relevant info to client
  res.send('gwas index');
};

exports.new = function(req, res){ // GET /gwas/new
	// send a form to the client to define a new gwas?
	// maybe if user has priviledges
  res.send('new gwas');
};

exports.create = function(req, res){ // POST /gwas
	// validate the POSTed object in the req and store in db
  res.send('create gwas');
};

exports.show = function(req, res){ // GET /gwas/:study_id
	// send the gwas object to the client
	res.json(req.gwa);
//  res.send('show gwas');
};

exports.edit = function(req, res){ // GET /gwas/:study_id/edit
	// send a form to the client populated with the current gwas data
  res.send('edit gwas ' + req.gwa.study_id);
};

exports.update = function(req, res){ // PUT /gwas/:study_id
	// update the gwas in the db
  res.send('update gwas ' + req.gwa.study_id);
};

exports.destroy = function(req, res){ // DELETE /gwas/:study_id
	// delete a gwas from the db (check permissions)
  res.send('destroy gwas ' + req.gwa.study_id);
};

exports.load = function(id, fn){
	// this function fetches the gwas specified by id from the db
  process.nextTick(function(){
		// need to fetch the gwas object from mongodb
    fn(null, { study_id: id });
  });
};
