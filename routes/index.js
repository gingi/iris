
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'KBase Data Visualization Library' });
};
