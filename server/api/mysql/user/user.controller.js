'use strict';

var _ = require('lodash');
var models = require('../');
var User = models.User;
var passport = require('passport');
var config = require('../../../config/environment');
var mail = require('../../../components/mail/mail.service');
var jwt = require('jsonwebtoken');
var determinationController = require('../Determination/Determination.controller');

var crowdSourcedIdentificationConstants = determinationController.getCrowsourcedIdentificationConstants();

var validationError = function(res, statusCode) {
	statusCode = statusCode || 422;
	return function(err) {
		res.json(statusCode, err);
	};
};

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.send(statusCode, err);
	};
}

function respondWith(res, statusCode) {
	statusCode = statusCode || 200;
	return function() {
		res.send(statusCode).end();
	};
}

function handleEntityNotFound(res) {
	return function(entity) {
		if (!entity) {
			res.send(404);
			return null;
		}
		return entity;
	};
}

function cacheResult(req, value) {
	var redisClient = req.redis;

	return redisClient.setAsync(req.query.cachekey, value)
		.then(function() {
			return redisClient.expireAsync(req.query.cachekey, config.redisTTL[req.query.cachekey])
		})
		.catch(function(err) {
			console.log("error: " + err)
		})

}

function cacheResultByUrl(req, value) {
	var redisClient = req.redis;
	var ttl = req.ttl;
	return redisClient.setAsync(req.originalUrl, value)
		.then(function() {
			return redisClient.expireAsync(req.originalUrl, ttl)
		})
		.catch(function(err) {
			console.log("error: " + err)
		})

}
/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {

	var q = {
		attributes: [
			'_id',
			'name',
			'email',
			'provider',
			'Initialer',
			'photopermission',
			'createdAt'
		],
		include: [{
			model: models.Role
		}]
	};
	if (req.query.where) {
		q.where = JSON.parse(req.query.where);

	}

	if (req.query.limit) {
		q.limit = parseInt(req.query.limit);

	};

	User.findAll(q)
		.then(function(users) {
			return res.status(200).json(users)
		})
		.catch(function(err) {
			console.log(err)
			res.status(500).json(JSON.stringify(err))
		});
	//.catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
	var newUser = User.build(req.body);
	newUser.setDataValue('provider', 'local');
	// newUser.setDataValue('role', 'user');
	newUser.save()
		.then(function(user) {
			/*
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
		*/
		return	res.json(user);
		})
		.catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
	var userId = req.params.id;

	return User.find({
			where: {
				_id: userId
			},
			include: [{
				model: models.Role
			}]
		})
		.then(function(user) {
			if (!user) {
				return res.send(404);
			}
			return res.json(user.profile);
		})
		.catch(function(err) {
			return next(err);
		});
};

exports.getCount = function(req, res) {


	var sql =  'select count(distinct u._id) as count from Users u, Observation o WHERE o.primaryuser_id=u._id';


	return models.sequelize.query(sql, {

		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cached) {
			return cacheResultByUrl(req, JSON.stringify(result)).then(function() {
				
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};


exports.showUserMorphoGroups = function(req, res, next) {
	var userId = req.params.id;

	User.find({
			where: {
				_id: userId
			},
			include: [{
			model: models.MorphoGroup,
			as: 'MorphoGroup',
			}]
		})
		.then(function(user) {
			if (!user) {
				return res.send(404);
			}
			res.status(200).json(user.MorphoGroup);
		})
		.catch(function(err) {
			return next(err);
		});
};

exports.showUserMorphoGroup = function(req, res, next) {
	var userId = req.params.id;
var morphogroupId = req.params.morphogroupid;
	User.find({
			where: {
				_id: userId
			},
			include: [{
			model: models.MorphoGroup,
			as: 'MorphoGroup',
	
				where: {
					_id: morphogroupId
				}	
			}]
		})
		.then(function(user) {
			if (!user) {
				return res.send(404);
			}
			res.status(200).json(user.MorphoGroup[0]);
		})
		.catch(function(err) {
			return next(err);
		});
};

exports.updateUserMorphoGroup = function(req, res, next) {
	var userId = req.params.id;
var morphogroupId = req.params.morphogroupid;


var userMorphoGroupImpact = req.body;
	return models.UserMorphoGroupImpact.find({where: {user_id: userId, morphogroup_id: morphogroupId}}).then(function(usrmorphogroup){
		
		
		if(usrmorphogroup){
			usrmorphogroup.max_impact = req.body.max_impact;
			usrmorphogroup.min_impact = req.body.min_impact;
			usrmorphogroup.updatedByUser = req.user._id;
		
			return usrmorphogroup.save()
		} else {
			return models.UserMorphoGroupImpact.create({user_id: userId, morphogroup_id: morphogroupId, updatedByUser:req.user._id, max_impact : req.body.max_impact,  min_impact : req.body.min_impact})
		}
		
		
	})
	.then(function(){
		return res.sendStatus(201)
	})
	.catch(function(err) {
		return next(err);
	});
	
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
	User.destroy({
			where: {
				_id: req.params.id
			}
		})
		.then(respondWith(res, 204))
		.catch(handleError(res));
};


/**
 * Updates a user
 * restriction: 'admin'
 * Used for adding photopermission
 */
exports.update = function(req, res) {
	User.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(function(usr){
		//	console.log("####found usr")
			return usr.update(req.body)
		})
		.then(function(usr){
		//	console.log("####updated usr")
			return res.status(204).json(usr)
		})
		.
	catch (handleError(res));
	
};


exports.changePhotopermission = function(req, res, next) {
	

	return User.update({
			photopermission: req.body.photopermission
		}, {
			where: {
				_id: req.params.id
			}
		})
		.then(respondWith(res, 204))
		.catch(validationError(res));
};


exports.removeRole = function(req, res) {
	models.Userroles.destroy({
			where: {
				user_id: req.params.id,
				role_id: req.params.roleid
			}
		})
		.then(respondWith(res, 204))
		.catch(handleError(res));
};


exports.addRole = function(req, res) {
	models.Userroles.create({
			user_id: req.params.id,
			role_id: req.params.roleid
		})
		.then(respondWith(res, 201))
		.catch(handleError(res));
};


/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
	var userId = req.user._id;
	var oldPass = String(req.body.oldPassword);
	var newPass = String(req.body.newPassword);

	User.find({
			where: {
				_id: userId
			}
		})
		.then(function(user) {
			if (user.authenticate(oldPass)) {
				user.password = newPass;
				return user.save()
					.then(respondWith(res, 200))
					.catch(validationError(res));
			} else {
				return res.sendStatus(403);
			}
		});
};


exports.resetPassword = function(req, res, next) {
	var userId = req.user._id;
	
	if(!(req.body.Initialer === req.user.Initialer && req.body.email === req.user.email)){
		return res.sendStatus(403);
	} else {
		
		var newPass = String(req.body.newPassword);

		User.find({
				where: {
					_id: userId,
					Initialer: req.body.Initialer,
					email: req.body.email
				}
			})
			.then(function(user) {
				if (user) {
					user.password = newPass;
					return user.save()
						.then(respondWith(res, 200))
						.catch(validationError(res));
				} else {
					return res.sendStatus(404);
				}
			});
	}
	

};

/**
 * Change a users language
 */
exports.changeLanguage = function(req, res, next) {
	var userId = req.user._id;

	return User.update({
			preferred_language: req.body.language
		}, {
			where: {
				_id: userId
			}
		})
		.then(respondWith(res, 204))
		.catch(validationError(res));
};

/**
 * Change a users language
 */
exports.changeEmail = function(req, res, next) {
	var userId = req.user._id;

	return User.update({
			email: req.body.email
		}, {
			where: {
				_id: userId
			}
		})
		.then(respondWith(res, 204))
		.catch(validationError(res));
};

exports.changeName = function(req, res, next) {
	var userId = req.user._id;

	return User.update({
			name: req.body.name
		}, {
			where: {
				_id: userId
			}
		})
		.then(respondWith(res, 204))
		.catch(validationError(res));
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
	var userId = req.user._id;

	return User.find({
			where: {
				_id: userId
			},
			attributes: [
				'_id',
				'name',
				'Initialer',
				'email',
				'provider',
				'facebook',
				'preferred_language'
			],
			include: [{
				model: models.Role
				
			}]
		})
		.then(function(user) { // don't ever give out the password or salt
			if (!user) {
				return res.status(401).json();
			}
			return res.status(200).json(user.profile);
		})
		.catch(function(err) {
			return next(err);
		});
};


exports.getPendingUser = function(req, res){
	var redisClient = req.redis;
redisClient.getAsync("pending_user_"+req.params.token)
		.then(function(usr) {
			if(!usr){
				throw new Error("not found")
			} else {
				
				
				var newUser = User.build(JSON.parse(usr));
				newUser.setDataValue('provider', 'local');
				// newUser.setDataValue('role', 'user');
				return newUser.save()
					
				
				//return res.status(200).send(usr)
			}
			
		})
		.then(function(user) {
			return [redisClient.delAsync("pending_user_"+req.params.token), user]
		})
		.spread(function(deleteFromRedisSuccess, user) {
			
		return	res.status(200).json(user);
		})
		.catch(function(err){
			console.log(err)
			if(err.message === "not found") {
				res.sendStatus(404)
			} else {
				res.sendStatus(500)
			}
		})
}

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
	res.redirect('/');
};

exports.showFirstFindings = function(req, res) {


	var sql = 'SELECT b._id, b.firstRec as observationDate, b.Taxon_FullName FROM (SELECT MIN(o.observationDate) as firstRec, o._id, d.Taxon_FullName , d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Observation o WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+')  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND u.user_id = :userid AND YEAR(observationDate) = :year' +
		' GROUP BY d.Taxon_id) b, (SELECT MIN(ox.observationDate) as firstRec, dx.Taxon_id FROM Observation ox, DeterminationView2 dx WHERE dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) = :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id) a WHERE a.firstRec = b.firstRec AND a.Taxon_id=b.Taxon_id;';

	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year,
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

// (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') '

exports.showSpeciesCount = function(req, res) {
	var sql;
	var sqlOnlyDk = (!req.query.global ) ? ' AND o.locality_id IS NOT NULL' : '';
	if (req.query.group && req.query.group === "countryName, year") {
		sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,  YEAR(observationDate) as year, COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
			' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName, YEAR(observationDate) ORDER BY  YEAR(observationDate) DESC';
	} else if(req.query.group && req.query.group === "countryName"){
	sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,   COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
		' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName ORDER BY count DESC';
	} else {
	sql = 'SELECT COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o ' +
		' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND d.Taxon_RankID > 9950 AND u.user_id = :userid'
		+ sqlOnlyDk;
	} 

	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showObservationCount = function(req, res) {
	var sql;
	if (req.query.group && req.query.group === "year") {
	 sql = 'SELECT COUNT(o._id) as count, YEAR(observationDate) as year FROM Observation o WHERE primaryuser_id = :userid GROUP BY YEAR(observationDate) ORDER BY YEAR(observationDate) DESC'
		
	} else {
	 sql = 'SELECT COUNT(o._id) as count FROM Observation o WHERE primaryuser_id = :userid '
		
	}


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showForumCount = function(req, res) {
	var sql;
	if (req.query.group && req.query.group === "year") {
	 sql = 'SELECT COUNT(o._id) as count, YEAR(observationDate) as year FROM ObservationForum o WHERE user_id = :userid GROUP BY YEAR(observationDate) ORDER BY YEAR(observationDate) DESC'
		
	} else {
	 sql = 'SELECT COUNT(o._id) as count FROM ObservationForum o WHERE user_id = :userid '
		
	}


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};


exports.showImageCount = function(req, res) {
	var sql;
	if (req.query.group && req.query.group === "year") {
	 sql = 'SELECT COUNT(o._id) as count, YEAR(observationDate) as year FROM ObservationImages o WHERE user_id = :userid GROUP BY YEAR(observationDate) ORDER BY YEAR(observationDate) DESC'
		
	} else {
	 sql = 'SELECT COUNT(o._id) as count FROM ObservationImages o WHERE user_id = :userid '
		
	}


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showObservationCountAsHigherTaxonomy = function(req, res) {
	
	var sqlOnlyDk = (!req.query.global ) ? 'AND o.locality_id IS NOT NULL ' : '';
	var sql = 'SELECT tf._id, tf.Path, tf.RankID, tf.FullName, count(x.Taxon_id) taxoncount FROM Taxon tf JOIN '
	+'(SELECT d.Taxon_id , d.Taxon_Path FROM Observation o, DeterminationView2 d, ObservationUsers u  WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id '
	+'AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') '
	+ sqlOnlyDk
	+'AND u.user_id = :userid GROUP BY d.Taxon_id) x ON x.Taxon_Path LIKE CONCAT(tf.Path, "%") AND tf.RankID = :rankid GROUP BY tf._id ORDER BY taxoncount DESC;'


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id,
			rankid: req.params.rankid
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showCountryCount = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country FROM Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid WHERE o.primaryuser_id=:userid group by country';


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showFieldTrips = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = 'SELECT * from' 
	+'(SELECT 1 as inDK, l.name as localityname, l._id as locality_id, l.decimalLatitude, l.decimalLongitude, o.observationDate, COUNT(o._id) as count FROM Observation o JOIN Locality l ON o.locality_id=l._id WHERE o.primaryuser_id = :userid GROUP BY o.observationDate, localityname'
+' UNION ALL '
+'SELECT 0 as inDK, g.adminName1 as localityname, g.geonameId as locality_id, lat as decimalLatitude, lng as decimalLongitude, o2.observationDate, COUNT(o2._id) as count FROM Observation o2 JOIN GeoNames g ON o2.geonameId=g.geonameId WHERE o2.primaryuser_id = :userid GROUP BY o2.observationDate, localityname) a'
	+' ORDER BY a.observationDate DESC;';


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};


exports.showRecentlyChangedObservations = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = 'SELECT o._id from Observation o JOIN Determination d on o.primarydetermination_id = d._id WHERE o.primaryuser_id = :userid AND ((d.validator_id IS NOT NULL AND d.validator_id <> :userid AND d.updatedAt > :fromdate) OR (d.createdByUser IS NOT NULL AND d.createdByUser <> :userid AND d.createdAt > :fromdate) )';


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id,
			fromdate: req.query.since
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));


};

exports.showNewsFeed = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = `SELECT o._id as observation_id, o.observationDate, o.observationDateAccuracy, o.decimalLatitude, o.decimalLongitude, o.verbatimLocality, l.name as locality,  pd.validation, pd.score, t.FullName, t.Author,
oi.name as img, eventType, os.updatedAt as lastRead, oe.createdAt, u._id as user_id, u.name as username, u.Initialer as Initialer, u._id as user_id, u.facebook as user_facebook, om.user_id as mentioned_id, d._id as new_determination_id , d.taxon_id as new_taxon_id , st.FullName as suggested_name
FROM ObservationSubscriber os JOIN ObservationEvents oe JOIN Users u JOIN Observation o JOIN Determination pd JOIN Taxon t ON os.observation_id=o._id AND o.primarydetermination_id=pd._id AND pd.taxon_id = t._id AND os.observation_id=oe.observation_id  AND os.user_id = :userid  AND oe.user_id <> :userid  AND oe.user_id = u._id
LEFT JOIN Locality l ON o.locality_id= l._id
LEFT JOIN ObservationImages oi ON
 oi._id = (
  SELECT oi1._id FROM ObservationImages oi1
  WHERE oi1.observation_id = o._id LIMIT 1
 )
LEFT JOIN ObservationEventMentions om ON om.observationevent_id= oe._id AND om.user_id = :userid 
LEFT JOIN (Determination d JOIN Taxon st ON d.taxon_id=st._id) ON oe.determination_id = d._id ORDER BY (os.updatedAt < oe.createdAt) DESC, oe.createdAt DESC,  oe.observation_id LIMIT :limit OFFSET :offset`;

var offset = (req.query.offset) ? parseInt(req.query.offset) : 0;
var limit = (req.query.limit) ? parseInt(req.query.limit) : 25;

 

	return models.sequelize.query(sql, {
		replacements: {
			userid: req.user._id,
			offset: offset ,
			limit: limit +1 
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {
		var endOfRecords = true;
		
		if(result.length > limit){
			result.pop();
			endOfRecords = false;
		}
		return res.status(200).json({endOfRecords: endOfRecords, results: result});
	}).catch(handleError(res));


};

exports.showNewsCount = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = `SELECT COUNT(*) as count
FROM ObservationSubscriber os JOIN ObservationEvents oe ON os.observation_id=oe.observation_id AND os.user_id=:userid AND oe.user_id <> :userid AND oe.createdAt >= os.updatedAt `;


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.user._id
			//,fromdate: req.query.since
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result[0]);
	}).catch(handleError(res));


};

exports.markFeedAsRead = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = `UPDATE ObservationSubscriber SET updatedAt = NOW() WHERE user_id = :userid AND observation_id = :observationid`;


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.user._id,
			observationid: req.params.id
			
		},
		type: models.sequelize.QueryTypes.UPDATE
	})
	.then(function(result) {
		return models.sequelize.query('SELECT updatedAt FROM ObservationSubscriber WHERE user_id = :userid AND observation_id = :observationid', {
			replacements: {
				userid: req.user._id,
				observationid: req.params.id
			
			},
			type: models.sequelize.QueryTypes.SELECT
		})
	})
	.then(function(result) {

		return res.status(200).json(result[0]);
	}).catch(handleError(res));


};

exports.unsubscribe = function(req, res) {
	//SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country
	
	var sql = `DELETE FROM ObservationSubscriber  WHERE user_id = :userid AND observation_id = :observationid`;


	return models.sequelize.query(sql, {
		replacements: {
			userid: req.user._id,
			observationid: req.params.id
			
		},
		type: models.sequelize.QueryTypes.DELETE
	})
	.then(function(result) {

		return res.sendStatus(204);
	}).catch(handleError(res));


};



exports.validateEmail = function(req, res){
	
	var sql = "SELECT COUNT(*) as count FROM Users WHERE email=:email"
	return models.sequelize.query(sql, {
		replacements: {
			email: req.body.email
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result[0]);
	}).catch(handleError(res));
	
}

exports.validateInitials = function(req, res){
	
	var sql = "SELECT COUNT(*) as count FROM Users WHERE Initialer=:initialer"
	return models.sequelize.query(sql, {
		replacements: {
			initialer: req.body.Initialer
			
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result[0]);
	}).catch(handleError(res));
	
}


exports.recent = function(req, res){
	
	var sql = "SELECT u.name, count(o._id) FROM Users u, Observation o where u.createdAt >  DATE_SUB(NOW(), INTERVAL :fromDaysAgo day) AND o.primaryuser_id=u._id AND o.dataSource IS NULL  GROUP BY u._id"
	return models.sequelize.query(sql, {
		replacements: {
			fromDaysAgo: req.query.offset
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));
	
}


exports.showUserMorphoGroupPositions = function(req, res){
	
		var sql = `SELECT u.morphogroup_id, m.name_dk,m.name_uk,m.taxonCount,  COUNT(*) as position, u.impact, u.min_impact, u.max_impact FROM 
UserMorphoGroupImpact um, 
(SELECT mx._id, mx.name_dk, mx.name_uk, count(t._id) as taxonCount FROM MorphoGroup mx LEFT JOIN Taxon t ON t.morphogroup_id=mx._id WHERE t.accepted_id= t._id GROUP BY mx._id) m,
(SELECT morphogroup_id, impact, min_impact, max_impact FROM UserMorphoGroupImpact WHERE user_id= :userid) u
WHERE um.morphogroup_id = m._id AND um.morphogroup_id = u.morphogroup_id AND m.taxonCount > 0 AND um.impact >=u.impact AND u.impact>1 GROUP BY um.morphogroup_id ORDER BY position ASC`
		return models.sequelize.query(sql, {
		replacements: {
			userid: req.params.id
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		return res.status(200).json(result);
	}).catch(handleError(res));
	
 };

exports.showMyMorphoGroupPositions = function(req, res){
	
	req.params.id = req.user._id;
	exports.showUserMorphoGroupPositions(req, res)
}

