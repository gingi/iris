
exports.index = function(req, res){
	// select all genomes from db (limit by user?)
	// send relevant info to client
  res.send('genome index');
};

exports.new = function(req, res){
	// send a form to the client to define a new genome?
	// maybe if user has priviledges
  res.send('new genome');
};

exports.create = function(req, res){
	// validate the object in the req and store in db
  res.send('create genome');
};

exports.show = function(req, res){
	// send relevant into to client
  res.send('show genome ' + req.genome.title);
};

exports.edit = function(req, res){
	// send a form to the client populated with the current genome data
  res.send('edit genome ' + req.genome.title);
};

exports.update = function(req, res){
	// update the genome in the db
  res.send('update genome ' + req.genome.title);
};

exports.destroy = function(req, res){
	// delete a genome from the db (check permissions)
  res.send('destroy genome ' + req.genome.title);
};

exports.load = function(id, fn){
	// this function fetches the genome specified by id from the db
  process.nextTick(function(){
    fn(null, { title: 'Ferrets' });
  });
};
