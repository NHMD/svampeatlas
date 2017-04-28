'use strict';

var _ = require('lodash');
var models = require('../');

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
	var ttl;
	if(!req.query.year){
		ttl = 60 * 60 * 24;
	} else {
		ttl = getTTL(req.query.year)
	}
	return redisClient.setAsync(req.query.cachekey, value)
		.then(function() {
			return redisClient.expireAsync(req.query.cachekey, ttl)
		})
		.catch(function(err) {
			console.log("error: " + err)
		})

}

function getTTL(year){
	
	var thisYear = parseInt(new Date().getFullYear());
	
	return (parseInt(year) >= (thisYear-1)) ? (60 * 60 * 24) : (60 * 60 * 30);
	
}


exports.showNewTaxonCountOnPersonalList = function(req, res) {
var sql;	

if(req.query.persontype === "finder"){
	sql = `SELECT b.user_id as _id, b.username as name , b.Initialer, b.facebook, b.taxoncount as currentCount, a.taxoncount as lastYearsCount, (b.taxoncount - a.taxoncount) as count   FROM  
	(SELECT COUNT(distinct d.Taxon_id) as taxoncount, u.user_id AS user_id, usr.name as username, usr.facebook,  usr.Initialer FROM  DeterminationView2 d, Users usr, ObservationUsers u, Observation o WHERE u.observation_id=o._id AND u.user_id=usr._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore) AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(o.observationDate) <= :year GROUP BY u.user_id) b 
	LEFT JOIN 
	(SELECT COUNT(distinct dx.Taxon_id) as taxoncount, ux.user_id AS user_id FROM  DeterminationView2 dx,  ObservationUsers ux, Observation ox WHERE ux.observation_id=ox._id AND dx.Determination_id = ox.primarydetermination_id AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND dx.Taxon_RankID > 9950 AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year GROUP BY ux.user_id) a 
	ON a.user_id=b.user_id HAVING count > 0 order by count DESC;`;
} else {
	sql = `SELECT b.user_id as _id, b.username as name, b.Initialer, b.facebook, b.taxoncount as currentCount, a.taxoncount as lastYearsCount, (b.taxoncount - a.taxoncount) as count   FROM  
	(SELECT COUNT(distinct d.Taxon_id) as taxoncount, u._id AS user_id, u.name as username , u.Initialer,  usr.facebook FROM  DeterminationView2 d,  Users u, Observation o WHERE u._id=o.primaryuser_id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore) AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(o.observationDate) <= :year GROUP BY u._id) b 
	LEFT JOIN 
	(SELECT COUNT(distinct dx.Taxon_id) as taxoncount, ux._id AS user_id FROM  DeterminationView2 dx,  Users ux, Observation ox WHERE ux._id=ox.primaryuser_id AND dx.Determination_id = ox.primarydetermination_id AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND dx.Taxon_RankID > 9950 AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year GROUP BY ux._id) a 
	ON a.user_id=b.user_id HAVING count > 0 order by count DESC;`;
}


	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year,
			acceptedScore: crowdSourcedIdentificationConstants.ACCEPTED_SCORE
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {
		
		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
		
	}).catch(handleError(res));


};

exports.showNewTaxonCountOnPersonalListObservationIds = function(req, res) {
	
	var sql = `SELECT b._id FROM 
(SELECT o._id, d.Taxon_FullName , d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Observation o WHERE u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore)  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND u.user_id = :userid AND YEAR(observationDate) = :year
) b
LEFT JOIN
(SELECT  dx.Taxon_id FROM Observation ox, ObservationUsers ux, DeterminationView2 dx WHERE ux.observation_id = ox._id AND  ux.user_id = :userid AND dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year AND  dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id) a 
ON a.Taxon_id = b.Taxon_id WHERE a.Taxon_id IS NULL;`;
	
	
return models.sequelize.query(sql, {
	replacements: {
		year: req.params.year,
		userid: req.params.userid,
		acceptedScore: crowdSourcedIdentificationConstants.ACCEPTED_SCORE
	},
	type: models.sequelize.QueryTypes.SELECT
})

.then(function(result) {
	
	
		return res.status(200).json(result)
	
	
}).catch(handleError(res));

}

// (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') '

exports.showSpeciesCount = function(req, res) {
	var sql;
	var redlistsql = (req.query.redlisted) ? "d.Taxon_redlist_status IS NOT NULL AND " : "";
	var yearsql = (req.params.year) ? 'AND YEAR(o.observationDate) = :year ' : '';
	if(req.query.persontype = "finder"){
	sql = 'SELECT COUNT(distinct d.Taxon_id) as count, us._id, us.name, us.Initialer, us.facebook FROM  DeterminationView2 d, ObservationUsers u, Users us, Observation o ' +
		' WHERE '+redlistsql+'us._id=u.user_id AND u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL '+yearsql+'GROUP BY u.user_id HAVING count > 0 ORDER BY count DESC LIMIT 100' ;
	
	} else {
	sql = 'SELECT COUNT(distinct d.Taxon_id) as count, us._id, us.name , us.Initialer, us.facebook FROM  DeterminationView2 d,  Users us, Observation o ' +
		' WHERE '+redlistsql+'us._id=o.primaryuser_id_id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= '+crowdSourcedIdentificationConstants.ACCEPTED_SCORE+') AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL '+yearsql+'GROUP BY us._id HAVING count > 0 ORDER BY count DESC LIMIT 100' ;
		
	}
		
	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};

exports.showObservationCount = function(req, res) {
	
	var yearSql = (req.params.year) ? "AND YEAR(observationDate) = :year" : "";
	var redlistsql = (req.query.redlisted) ? "d.Taxon_redlist_status IS NOT NULL AND " : "";
	var sql ;
	
	if(req.query.persontype = "finder"){ 
	 sql = 'SELECT u._id, u.name, u.Initialer, u.facebook, COUNT(o._id) as count FROM DeterminationView2 d,Observation o, Users u, ObservationUsers ou WHERE '+redlistsql+'d.Determination_id = o.primarydetermination_id AND ou.user_id = u._id AND ou.observation_id=o._id '+yearSql+' GROUP BY u._id ORDER BY COUNT(o._id) DESC'
	} else {
		sql = 'SELECT u._id, u.name, u.Initialer, u.facebook, COUNT(o._id) as count FROM DeterminationView2 d, Observation o, Users u WHERE '+redlistsql+'d.Determination_id = o.primarydetermination_id AND o.primaryuser_id = u._id '+yearSql+' GROUP BY u._id ORDER BY COUNT(o._id) DESC'
	};
	
		
	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};

exports.showObservationCountRedlisted = function(req, res){
	req.query.redlisted = true;
	exports.showObservationCount(req, res);
}

exports.showMobileObservationCount = function(req, res) {
	
	var yearSql = (req.params.year) ? "AND YEAR(observationDate) = :year" : "";
	var sql = 'SELECT u._id, u.name, u.Initialer, u.facebook, COUNT(o._id) as count FROM Observation o, Users u WHERE o.primaryuser_id = u._id '+yearSql+' AND o.os IN ("IOS", "Android") GROUP BY u._id ORDER BY COUNT(o._id) DESC'
		
	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};

exports.showArchiveObservationCount = function(req, res) {
	
	var yearSql = (req.params.year) ? "AND YEAR(o.createdAt) = :year" : "";
	var sql = 'SELECT u._id, u.name, u.Initialer, u.facebook, COUNT(o._id) as count FROM Observation o, Users u WHERE o.primaryuser_id = u._id '+yearSql+' AND YEAR(o.observationDate) < YEAR(o.createdAt) GROUP BY u._id ORDER BY COUNT(o._id) DESC'
		
	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};


exports.showNewTaxonInAreaCount = function(req, res) {
var sql;	
var redlistsql = (req.query.redlisted) ? "d.Taxon_redlist_status IN ('RE', 'CR', 'EN', 'VU', 'NT') AND " : "";

if(req.query.persontype === "finder"){
	sql = `	SELECT COUNT(b.Taxon_id) as count, b._id, b.name, b.Initialer, b.facebook FROM 
	(SELECT oa.area_id, usr._id, usr.name, usr.Initialer, usr.facebook, d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Users usr, Observation o, ObservationAreas oa, Areas ar WHERE `+redlistsql+`u.user_id=usr._id AND ar._id=oa.area_id AND ar.type="UTM10" AND oa.observation_id=o._id AND u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore)  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(observationDate) = :year GROUP BY d.Taxon_id, oa.area_id) b
	LEFT JOIN  
(SELECT oax.area_id, dx.Taxon_id FROM Observation ox, DeterminationView2 dx, ObservationAreas oax, Areas arx WHERE arx._id=oax.area_id AND arx.type="UTM10" AND oax.observation_id=ox._id AND dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id, oax.area_id) a 
ON a.Taxon_id = b.Taxon_id AND a.area_id = b.area_id WHERE a.Taxon_id IS NULL GROUP BY b._id ORDER BY count DESC;`;
} else {
	sql = `	SELECT COUNT(b.Taxon_id) as count, b._id, b.name, b.Initialer, b.facebook FROM 
	(SELECT oa.area_id, usr._id, usr.name, usr.Initialer,usr.facebook, d.Taxon_id FROM DeterminationView2 d,  Users usr, Observation o, ObservationAreas oa, Areas ar WHERE `+redlistsql+`usr._id=o.primaryuser_id AND ar._id=oa.area_id AND ar.type="UTM10" AND oa.observation_id=o._id  AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore)  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(observationDate) = :year GROUP BY d.Taxon_id, oa.area_id) b
	LEFT JOIN  
(SELECT oax.area_id, dx.Taxon_id FROM Observation ox, DeterminationView2 dx, ObservationAreas oax, Areas arx WHERE arx._id=oax.area_id AND arx.type="UTM10" AND oax.observation_id=ox._id AND dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id, oax.area_id) a 
ON a.Taxon_id = b.Taxon_id AND a.area_id = b.area_id WHERE a.Taxon_id IS NULL GROUP BY b._id ORDER BY count DESC;`;
}


	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year,
			acceptedScore: crowdSourcedIdentificationConstants.ACCEPTED_SCORE
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {

		if (req.query.cachekey) {
			return cacheResult(req, JSON.stringify(result)).then(function() {
				return res.status(200).json(result)
			})
		} else {
			return res.status(200).json(result)
		}
	}).catch(handleError(res));


};

exports.showNewTaxonInAreaCountRedlisted = function(req, res){
	req.query.redlisted = true;
	exports.showNewTaxonInAreaCount(req, res);
}

exports.showNewTaxonInAreaForUser = function(req, res) {
var sql;	
var redlistsql = (req.query.redlisted) ? "d.Taxon_redlist_status IN ('RE', 'CR', 'EN', 'VU', 'NT') AND " : "";

if(req.query.persontype === "finder"){
	sql = `	SELECT b.observation_id as _id FROM 
	(SELECT o._id as observation_id, oa.area_id, usr._id, usr.name, usr.Initialer, usr.facebook, d.Taxon_id FROM DeterminationView2 d, ObservationUsers u, Users usr, Observation o, ObservationAreas oa, Areas ar WHERE `+redlistsql+`u.user_id=usr._id AND usr._id= :userid AND ar._id=oa.area_id AND ar.type="UTM10" AND oa.observation_id=o._id AND u.observation_id = o._id AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore)  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(observationDate) = :year ) b
	LEFT JOIN  
(SELECT oax.area_id, dx.Taxon_id FROM Observation ox, DeterminationView2 dx, ObservationAreas oax, Areas arx WHERE arx._id=oax.area_id AND arx.type="UTM10" AND oax.observation_id=ox._id AND dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id,  oax.area_id) a 
ON a.Taxon_id = b.Taxon_id AND a.area_id = b.area_id WHERE a.Taxon_id IS NULL;`;
} else {
	sql = `	SELECT b.observation_id as _id  FROM 
	(SELECT o._id as observation_id, oa.area_id, usr._id, usr.name, usr.Initialer,usr.facebook, d.Taxon_id FROM DeterminationView2 d,  Users usr, Observation o, ObservationAreas oa, Areas ar WHERE `+redlistsql+`usr._id=o.primaryuser_id AND usr._id= :userid  AND ar._id=oa.area_id AND ar.type="UTM10" AND oa.observation_id=o._id  AND d.Determination_id = o.primarydetermination_id AND (d.Determination_validation = "Godkendt" OR d.Determination_score >= :acceptedScore)  AND d.Taxon_RankID > 9950 AND o.locality_id IS NOT NULL AND YEAR(observationDate) = :year ) b
	LEFT JOIN  
(SELECT oax.area_id, dx.Taxon_id FROM Observation ox, DeterminationView2 dx, ObservationAreas oax, Areas arx WHERE arx._id=oax.area_id AND arx.type="UTM10" AND oax.observation_id=ox._id AND dx.Determination_id = ox.primarydetermination_id  AND (dx.Determination_validation = "Godkendt" OR dx.Determination_score >= :acceptedScore) AND ox.locality_id IS NOT NULL AND YEAR(ox.observationDate) < :year AND dx.Taxon_RankID > 9950 GROUP BY dx.Taxon_id, oax.area_id) a 
ON a.Taxon_id = b.Taxon_id AND a.area_id = b.area_id WHERE a.Taxon_id IS NULL;`;
}


	return models.sequelize.query(sql, {
		replacements: {
			year: req.params.year,
			acceptedScore: crowdSourcedIdentificationConstants.ACCEPTED_SCORE,
			userid: req.params.userid
		},
		type: models.sequelize.QueryTypes.SELECT
	})

	.then(function(result) {


			return res.status(200).json(result)
		
	}).catch(handleError(res));


};

exports.showNewRedlistedTaxonInAreaForUser = function(req, res){
	req.query.redlisted = true;
	exports.showNewTaxonInAreaForUser(req, res);
}
