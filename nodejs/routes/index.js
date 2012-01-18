exports.index = function(req, res){
  res.render('index', { title: 'Iris' })
};

exports.pcoords = function(table, res) {
    // if (width == null)  
    width = 1100;
    // if (height == null)
    height = 500;
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="/static/javascript/jquery.js"></script>'
		+ '<script type="text/javascript" src="/static/javascript/canvas_pcoords.js"></script>'
		+ '<script type="text/javascript">$(document).ready(pcoords("pcoords","'+table+'"))</script>'
        + '<div style="position: relative; min-width:500px">'
		+ ' <canvas id="pcoords" width="'+width+'" height="'+height+'" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>'
		+ ' <canvas id="pcoordsi" width="'+width+'" height="'+height+'" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>'
        + '</div>'
		);
};

exports.gwas = function(study, width, height, res) {
    // if (width == null)  
    width = 1100;
    // if (height == null)
    height = 500;
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="/static/javascript/jquery.js"></script>'
		+ '<script type="text/javascript" src="/static/javascript/canvas_scatter.js"></script>'
		+ '<script type="text/javascript">$(document).ready(manhattan_plot("scatter",'+study+'))</script>'
        + '<div style="position: relative; min-width:500px">'
		+ ' <canvas id="scatter" width="'+width+'" height="'+height+'" style="position: absolute; left: 0; top: 0; z-index: 0;"></canvas>'
		+ ' <canvas id="scatteri" width="'+width+'" height="'+height+'" style="position: absolute; left: 0; top: 0; z-index: 1;"></canvas>'
        + '</div>'
		);
};

exports.allpoints = function(study,res) {
	res.writeHead(200,{"Content-type":"text/html"});
	res.end('<script type="text/javascript" src="/static/javascript/jquery-1.7.js"></script>'
		+ '<script type="text/javascript" src="/static/javascript/canvas_scatter.js"></script>'
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

exports.kbase_index = function (req,res){
    console.log("kbase_index")
    res.render('kbase_index',  { layout:false})
    
};
