// this is where widgets come from

exports.index = function(req, res){
	// select all widgets from db
	// send relevant info to client
  res.send('widget index');
};

exports.new = function(req, res){
	// send a form to the client to define a new widget
  res.send('new widget');
};

exports.create = function(req, res){
	// validate the object in the req and store in db
  res.send('create widget');
};

exports.show = function(req, res){
	// send relevant into to client
	res.json(req.widget);
};

exports.edit = function(req, res){
	// send a form to the client populated with the current widget data
  res.send('edit widget ' + req.widget);
};

exports.update = function(req, res){
	// update the widget in the db
  res.send('update widget ' + req.widget);
};

exports.destroy = function(req, res){
	// delete a widget from the db (check permissions)
  res.send('destroy widget ' + req.widget);
};

exports.load = function(id, fn){
	// this function fetches the widget specified by id from the db
  process.nextTick(function(){
    fn(null, { id: id });
  });
};
