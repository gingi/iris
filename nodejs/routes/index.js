/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Kbase Web - node.js' })
};

exports.select_study = function(req, res){
  res.render('select_study', { title: 'Kbase Web - select study' })
};

exports.query_scores = function(req, res) {
	res.render('query_scores', { title: 'Kbase Web - query scores' })
};

exports.gwas = function(study, experiment, res) {
	res.render('gwas', { title: 'Kbase Web - ' + experiment + '/' + study,
	 	"study": study,
	 	"experiment": experiment});
};
