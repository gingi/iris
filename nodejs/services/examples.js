var iris      = require('./service-base.js');
var app       = iris.app;
var querystr  = require('querystring');

var GwasFastbitService   = iris.findService({ path: "/gwas", type: "fastbit" });
var PcoordFastbitService = iris.findService({ path: "/pcoords", type: "fastbit" });
var PhenoMongoService    = iris.findService({ path: "/phenotypes", type: "mongo" });

// Routes
app.get('/', function (req, res) {
    // TODO: Provide routes? Description?
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
        name: iris.serviceName(),
        description: "The examples service",
    }));
});

app.get('/species/:species/chromosomes', function (req, res) {
    res.json(iris.chromosomes[req.params.species]);
});

app.get('/gwas/:study', function (req, res) {
   res.json({
       study: req.params.study,
       species: {
           name: 'Arabidopsis thaliana',
           code: 'at'
       },
       next: {
           maxscore: '/gwas/' + req.params.study + '/maxscore',
           scatter: '/gwas/' + req.params.study + '/scatter'
       }
   });
});

app.get('/gwas/:study/maxscore', function (req, res) {
    iris.httpGET(res, GwasFastbitService, '/fbsql?d=GWAS/' + req.params.study + '&s=max(score)')
});

app.get('/gwas/:study/scatter', function (req, res) {
    req.query.d = 'GWAS/' + req.params.study + '/' + req.query.chr;
    req.query.c1 = 'pos';
    req.query.c2 = 'score';
    req.query.n1 = req.query.n2 = 0;
    iris.httpGET(res, GwasFastbitService, '/scatter?' + querystr.stringify(req.query));
});

app.get('/gwas/:study/GO', function(req, res) {
	req.query.s = req.params.study;
	iris.httpGET(res, GwasFastbitService, '/gwas2go?' + querystr.stringify(req.query));
});

app.get('/pcoords/:table/scatter', function (req, res) {
    req.query.d = req.params.table;
    req.query.a = 1
    iris.httpGET(res, PcoordFastbitService, '/scatter?' + 
        querystr.stringify(req.query)
    );
});

app.get('/pcoords/:table/ranges', function (req, res) {
    iris.httpGET(res, PcoordFastbitService, '/ranges?d=' + req.params.table);
});

// Mongo fetches
app.get('/phenotypes/:trait', function (req, res) {
    iris.httpGET(res, PhenoMongoService,
        '/collection/phenotypes/' + req.params.trait + '?field=phenotype_values');
});

app.get('/phenotypes', function (req, res) {
    iris.httpGET(res, PhenoMongoService, '/collection/phenotypes/keys');
});

app.get('/phenotypes/values', function (req, res) {
	iris.httpGET(res, PhenoMongoService, '/collection/phenotypes/select?field=phenotype_values');
});

iris.startService();