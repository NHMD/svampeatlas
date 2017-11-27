var compose = require('composable-middleware');
var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var redisClient = redis.createClient();


redisClient.on("error", function (err) {
    console.log("Error " + err);
});
redisClient.on("ready", function (err) {
   "Redis client connected succesfully"
});


  


exports.use = function () {
    return compose()
        // Attach user to request
        .use(function(req, res, next) {
			console.log("######")
			console.log(req.originalUrl)
			req.redis = redisClient;
            if (req.query.cachekey) {
				redisClient.getAsync(req.query.cachekey)
				.then(function(reply){
					
					if(reply){
						
						return res.status(200).send(reply)
					} else {
			           
						next()
					}
				})
				.catch(function(err){
					console.log("#### ERR "+err)
					next()
				})
	
             
            }
			else {
				next()
				
			}
			
           
        });
}

exports.cache = function (ttl) {
    return compose()
        // Attach user to request
        .use(function(req, res, next) {
			
			req.redis = redisClient;
       	 	req.ttl = ttl;
				redisClient.getAsync(req.originalUrl)
				.then(function(reply){
					
					if(reply){
					
						return res.status(200).send(reply)
					} else {
			           
						next()
					}
				})
				.catch(function(err){
					console.log("#### ERR "+err)
					next()
				})
	
             
           
			
           
        });
}