/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'lets try jquery' })
};

exports.jquery_fastbit = function(req, res){
	console.log("going here")
	res.render('jquery_fastbit',  { layout:false, title: 'Routing fastbit json jQuery' })
};
