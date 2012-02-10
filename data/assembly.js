
exports.index = function(req, res){
	// select all assemblys from db (limit by user?)
	// send relevant info to client
  res.send('assembly index');
};

exports.new = function(req, res){
	// send a form to the client to define a new assembly?
	// maybe if user has priviledges
  res.send('new assembly');
};

exports.create = function(req, res){
	// validate the object in the req and store in db
  res.send('create assembly');
};

exports.show = function(req, res){
	// send relevant into to client
  res.send('show assembly ' + req.assembly.title);
};

exports.edit = function(req, res){
	// send a form to the client populated with the current assembly data
  res.send('edit assembly ' + req.assembly.title);
};

exports.update = function(req, res){
	// update the assembly in the db
  res.send('update assembly ' + req.assembly.title);
};

exports.destroy = function(req, res){
	// delete a assembly from the db (check permissions)
  res.send('destroy assembly ' + req.assembly.title);
};

exports.load = function(id, fn){
	// this function fetches the assembly specified by id from the db
  process.nextTick(function(){
    fn(null, { title: 'Ferrets' });
  });
};
