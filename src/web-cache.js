var redis    = require('redis').createClient();

function cacheResponse(res, fn, key) {
    return function (body) {
        redis.set(key, JSON.stringify(body));
        fn.call(res, body);
    }
}


exports.middleware = function (params) {
    params      = params      || {};
    params.path = params.path || '/';
    if (!params.path instanceof RegExp) {
        params.path = new RegExp("^" + params.path);
    }
    return function (req, res, next) {
        if (req.url.match(params.path) === null) {
            return next();
        }
        res.contentType = 'application/json';
        redis.get(req.url, function (err, reply) {
            if (reply) {
                res.send(JSON.parse(reply));
            } else {
                var original = res.end;
                res.end = cacheResponse(res, original, req.url);
                next();
            }
        });
    }
}