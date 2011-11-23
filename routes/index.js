exports.index = function(req, res){
  res.render('index', { title: 'just paint on the canvas' })
};

exports.gwas = function(study, res) {
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>'
		+ '<script type="text/javascript" src="/javascripts/canvas_scatter.js"></script>'
		+ '<script type="text/javascript">$(document).ready(manhattan_plot("scatter",'+study+'))</script>'
		+ '<canvas id="scatter" width="1100" height="500"></canvas>');
};

exports.allpoints = function(study,res) {
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js"></script>'
		+ '<script type="text/javascript" src="/javascripts/canvas_scatter.js"></script>'
		+ '<script type="text/javascript">$(document).ready(manhattan_plot_dots("scatter",'+study+'))</script>'
		+ '<canvas id="scatter" width="1100" height="500"></canvas>');
};

exports.jquery_fastbit = function(req, res){
	console.log("going here")
	res.render('jquery_fastbit',  { layout:false, title: 'Routing fastbit json jQuery' })
};
