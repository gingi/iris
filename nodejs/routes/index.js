/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Kbase Web - node.js' })
};

exports.select_study = function(req, res){
  res.render('select_study', { title: 'Kbase Web - select study' })
};

exports.gwas = function(study, res) {
	res.render('gwas', { title: 'Kbase Web - study ' + study, "study": study});
};
