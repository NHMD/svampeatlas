var compose = require('composable-middleware');

exports.parseLimitOffset = function () {
    return compose()
        // Attach user to request
        .use(function(req, res, next) {
            if(req.query && req.query.offset){
            	req.query.offset = parseInt(req.query.offset)
            };
            if(req.query && req.query.limit){
            	req.query.limit = parseInt(req.query.limit)
            };
			next()
        });
}