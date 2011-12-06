exports.index = function(req, res){
  res.render('index', { title: 'just paint on the canvas' })
};

exports.gwas = function(study, res) {
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="/javascript/jquery.js"></script>'
		+ '<script type="text/javascript" src="/javascript/canvas_scatter.js"></script>'
		+ '<script type="text/javascript">$(document).ready(manhattan_plot("scatter",'+study+'))</script>'
		+ '<div style="position: relative;">'
		+ ' <canvas id="scatter" width="1100" height="500" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>'
		+ ' <canvas id="scatteri" width="1100" height="500" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>'
		+ '</div>');
};

exports.allpoints = function(study,res) {
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="/javascript/jquery-1.7.js"></script>'
		+ '<script type="text/javascript" src="/javascript/canvas_scatter.js"></script>'
		+ '<script type="text/javascript">$(document).ready(manhattan_plot_dots("scatter",'+study+'))</script>'
		+ '<div style="position: relative;">'
		+ ' <canvas id="scatter" width="1100" height="500" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>'
		+ ' <canvas id="scatteri" width="1100" height="500" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>'
		+ '</div>');
};

exports.jquery_fastbit = function(req, res){
	console.log("going here")
	res.render('jquery_fastbit',  { layout:false, title: 'Routing fastbit json jQuery' })
};
