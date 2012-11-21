var restify = require('restify');
var pajek   = require(__dirname + '/../parsers/pajek');
var path    = require('path');
var datadir = __dirname + '/../../test/fixtures';

var server = restify.createServer();
server.get('/pajek/:network', function (request, response, next) {
    var filename = path.join(datadir, request.params.network) + ".pajek";
    pajek.parse(filename, function (network) {
        response.send(network.json());
    })
});

server.listen(8080, function () {
   console.log("%s listening at %s", server.name, server.url); 
});