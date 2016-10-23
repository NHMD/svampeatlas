var compose = require('composable-middleware');

exports.noCache = function() {
	return compose()

	.use(function noCache(req, res, next) {
		res.header("Cache-Control", "no-cache, no-store, must-revalidate");
		res.header("Pragma", "no-cache");
		res.header("Expires", 0);
		next();
	})
}
