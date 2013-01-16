var redis    = require('redis').createClient();

function cacheResponse(res, fn, key) {
    return function (body) {
        if (body) {
            var value = JSON.stringify(body);
            redis.set(key, value);
        }
        fn.call(res, body);
    }
}

exports.middleware = function (params) {
    params      = params      || {};
    params.path = params.path || '/';
    if (!params.path instanceof RegExp) {
        params.path = new RegExp("^" + params.path);
    }
    for (var i = 0; i < params.exclude.length; i++) {
        if (!params.exclude[i] instanceof RegExp) {
            params.exclude[i] = new RegExp("^" + params.exclude[i] + "$");
        }
    }
    return function (req, res, next) {
        if (req.url.match(params.path) === null) {
            return next();
        }
        for (var i = 0; i < params.exclude.length; i++) {
            if (req.url.match(params.exclude[i]) !== null) {
                return next();
            }
        }
        res.contentType = 'application/json';
        redis.get(req.url, function (err, reply) {
            if (reply && reply !== "") {
                var body = JSON.parse(reply);
                if (body !== null && body !== {}) {
                    return res.send(JSON.parse(reply));
                }
            }
            var original = res.end;
            res.end = cacheResponse(res, original, req.url);
            next();
        });
    }
}
