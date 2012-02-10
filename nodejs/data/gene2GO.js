
exports.index = function(req, res){
	// select all gene2GOs from db (limit by user?)
	// send relevant info to client
  res.send('gene2GO index');
};

exports.new = function(req, res){
	// send a form to the client to define a new gene2GO?
	// maybe if user has priviledges
  res.send('new gene2GO');
};

exports.create = function(req, res){
	// validate the object in the req and store in db
  res.send('create gene2GO');
};

exports.show = function(req, res){
	// send relevant into to client
  res.send('show gene2GO ' + req.gene2GO.title);
};

exports.edit = function(req, res){
	// send a form to the client populated with the current gene2GO data
  res.send('edit gene2GO ' + req.gene2GO.title);
};

exports.update = function(req, res){
	// update the gene2GO in the db
  res.send('update gene2GO ' + req.gene2GO.title);
};

exports.destroy = function(req, res){
	// delete a gene2GO from the db (check permissions)
  res.send('destroy gene2GO ' + req.gene2GO.title);
};

exports.load = function(id, fn){
	// this function fetches the gene2GO specified by id from the db
  process.nextTick(function(){
    fn(null, { title: 'Ferrets' });
  });
};
