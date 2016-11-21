'use strict';

var _ = require('lodash');
var models = require('../');
var User = models.User;
var passport = require('passport');
var config = require('../../../config/environment');
var jwt = require('jsonwebtoken');

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
			'photopermission'
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
			res.json(user);
		})
		.catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
	var userId = req.params.id;

	User.find({
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
			res.json(user.profile);
		})
		.catch(function(err) {
			return next(err);
		});
};

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
				return res.send(403);
			}
		});
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

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
	res.redirect('/');
};

exports.showFirstFindings = function(req, res) {


	var sql = 'SELECT b._id, b.firstRec as observationDate, b.Taxon_FullName FROM (SELECT MIN(o.observationDate) as firstRec, o._id, d.Taxon_FullName , d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Observation o WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND d.Determination_validation = "Godkendt"  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND u.user_id = :userid AND YEAR(observationDate) = :year' +
		' GROUP BY d.Taxon_id) b, (SELECT MIN(ox.observationDate) as firstRec, dx.Taxon_id FROM Observation ox, DeterminationView2 dx WHERE dx.Determination_id = ox.primarydetermination_id  AND dx.Determination_validation = "Godkendt" AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) = :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id) a WHERE a.firstRec = b.firstRec AND a.Taxon_id=b.Taxon_id;';

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


exports.showSpeciesCount = function(req, res) {
	var sql;
	var sqlOnlyDk = (!req.query.global ) ? ' AND o.locality_id IS NOT NULL' : '';
	if (req.query.group && req.query.group === "countryName, year") {
		sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,  YEAR(observationDate) as year, COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
			' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName, YEAR(observationDate) ORDER BY  YEAR(observationDate) DESC';
	} else if(req.query.group && req.query.group === "countryName"){
	sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,   COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
		' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName ORDER BY count DESC';
	} else {
	sql = 'SELECT COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o ' +
		' WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid'
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
	+'AND d.Determination_validation = "Godkendt" '
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
