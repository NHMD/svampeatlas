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
			'Initialer'
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


	var sql = 'SELECT b.firstRec as observationDate, b.Taxon_FullName FROM (SELECT MIN(o.observationDate) as firstRec, d.Taxon_FullName , d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Observation o WHERE u.observation_id = o._id AND d.Determination_observation_id = o._id AND d.Determination_validation = "Godkendt"  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND u.user_id = :userid AND YEAR(observationDate) = :year' +
		' GROUP BY d.Taxon_id) b, (SELECT MIN(ox.observationDate) as firstRec, dx.Taxon_id FROM Observation ox, DeterminationView2 dx WHERE ox._id=dx.Determination_observation_id  AND dx.Determination_validation = "Godkendt" AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) = :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id) a WHERE a.firstRec = b.firstRec AND a.Taxon_id=b.Taxon_id;';

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
	if (req.query.group && req.query.group === "countryName, year") {
		sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,  YEAR(observationDate) as year, COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
			' WHERE u.observation_id = o._id AND d.Determination_observation_id = o._id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName, YEAR(observationDate) ORDER BY  YEAR(observationDate) DESC';
	} else if(req.query.group && req.query.group === "countryName"){
	sql = 'SELECT IF(ISNULL(g.countryName), "Denmark", g.countryName) as country,   COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid' +
		' WHERE u.observation_id = o._id AND d.Determination_observation_id = o._id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid GROUP BY g.countryName ORDER BY count DESC';
	} else {
	sql = 'SELECT COUNT(distinct d.Taxon_id) as count FROM  DeterminationView2 d, ObservationUsers u, Observation o ' +
		' WHERE u.observation_id = o._id AND d.Determination_observation_id = o._id AND d.Determination_validation = "Godkendt" AND d.Taxon_RankID > 9950 AND u.user_id = :userid';
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
	var sql = 'SELECT tf._id, tf.FullName, count(distinct d.Taxon_id) taxoncount FROM Taxon tf, Observation o, DeterminationView2 d, ObservationUsers u'
	+'  WHERE u.observation_id = o._id AND d.Determination_observation_id = o._id AND d.Determination_validation = "Godkendt" '
	+ sqlOnlyDk
	+'AND u.user_id = :userid AND tf.RankID = :rankid AND d.Taxon_Path LIKE CONCAT(tf.Path, "%") GROUP BY tf._id ORDER BY taxoncount DESC;'


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
	
	
	var sql = 'SELECT COUNT(distinct g.countryname) as count FROM Observation o LEFT JOIN GeoNames g ON o.geonameid=g.geonameid WHERE o.primaryuser_id=:userid';


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
