/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /taxons              ->  index
 * POST    /taxons              ->  create
 * GET     /taxons/:id          ->  show
 * PUT     /taxons/:id          ->  update
 * DELETE  /taxons/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

var models = require('../')
var Determination = models.Determination;
var Promise = require("bluebird");
var userTool = require("../userTool");

var nestedQueryParser = require("../nestedQueryParser")

// Min score for an determination to "verified"
const ACCEPTED_SCORE = 80;
// a bonus for each accepted determination of the current accepted taxon - will be added to the users score
const ACCEPTED_OBSERVATION_BONUS = 5;

// we will only take phaenology into account if we have more than 20 records of a taxon
const PHAENOLOGY_MIN_ACCEPTED_COUNT = 20;
// In order to get a bonus for phaenololgy the taxon must not be recorded in more than 9 months
const MAX_NUMBER_OF_MONTHS_FOR_PHAENOLOGY_FACTOR = 9;
// And the taxon weight should be less than 25, i.e. fairly commonly recored species
const MAX_TAXON_WEIGHT_FOR_PHAENOLOGY_FACTOR = 30;
// if so the taxon weight will be halfed
const PHAENOLOGY_BONUS_FACTOR = 0.5;

const PHAENOLOGY_PENALTY_VALUE = 25;

// if there exists records within a short distance, we will half the taxon penalty
const SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_FACTOR = 0.5;
// the short distance in km
const SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE = 1;
// the radius (in km) to search for known observations
const SEARCH_CLOSEST_RADIUS = 25;
// on the other hand, if more than 500 records exists and the observation is more than 25 km from the closest known we add 25 to the penalty
const DISTANCE_PENALTY_MIN_ACCEPTED_COUNT = 500;
const FAR_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE = 25;
const DISTANCE_PENALTY_VALUE = 25;

const MAX_TAXON_WEIGHT = 100;

// For higher taxa we cannot use accepted record count in a meaningfull sense, therefore we give them a default weight
const DEFAULT_HIGHER_TAXON_WEIGHT = 25;
// What defines a higher taxon (10000 = species rank)
const DEFAULT_HIGHER_TAXON_RANK_LIMIT = 10000;
// in order to pick a determination to higher taxon rather than to species the higher taxon determintion must have twice the score (factor 0.5) of the species determination
const DEFAULT_HIGHER_TAXON_FACTOR = 0.5;
// If the user says its only a possible id, degrade the user impact
const IDENTIFICATION_CERTAINTY_PENALTY_FACTOR = 0.5;

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		console.log(err);
		res.status(statusCode).send(err);
	};
}

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			return res.status(statusCode).json(entity)
		}
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

function saveUpdates(updates) {
	return function(entity) {
		return entity.updateAttributes(updates)
			.then(function(updated) {
				return updated;
			});
	};
}

function removeEntity(res) {
	return function(entity) {
		if (entity) {
			return entity.destroy()
				.then(function() {
					return res.send(204);
				});
		}
	};
}

// Get list of taxons
exports.index = function(req, res) {


	var query = {
		offset: req.query.offset,
		limit: req.query.limit,
		order: req.query.order,
		where: {}
	};



	if (req.query.where) {
		_.merge(query.where, JSON.parse(req.query.where));
	}

	if (req.query.include) {
		var include = JSON.parse(req.query.include)

		query['include'] = _.map(include, function(n) {
			n.model = models[n.model];
			if (n.where) {
				n.where = JSON.parse(n.where);

				if (n.where.$and && n.where.$and.length > 0) {

					for (var i = 0; i < n.where.$and.length; i++) {
						n.where.$and[i] = JSON.parse(n.where.$and[i]);
					}
				}
				/*
				if(n.model === "TaxonomyTag"){

							n.where._id = JSON.parse(n.where._id);
				
				}
				*/

				//	n.where = nestedQueryParser.parseQueryString(n.where)

			}
			console.log(n.where)
			return n;
		});


	}


	Determination.findAndCount(query)
		.then(function(taxon) {
			res.set('count', taxon.count);
			if (req.query.offset) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit) {
				res.set('limit', req.query.limit);
			};
			return res.status(200).json(taxon.rows)
		})
		.
	catch(handleError(res));

};



// Get a single taxon
exports.show = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			},
			include: [{
				model: models.Taxon,
				as: "Taxon",
				include: [{
					model: models.Taxon,
					as: "acceptedTaxon",
					include: [{
						model: models.TaxonDKnames,
						as: "Vernacularname_DK"
					}]
				}]
			}, {
				model: models.User,
				as: 'User',
				attributes: ['email', 'Initialer', 'name']
			}]
		})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch(handleError(res));
};

exports.getDeterminationsForObservation = (req, res)=> {
	 
	 return Determination.findAll({where: {observation_id: req.params.id}, 
		include: [{
			model: models.Taxon,
			as: "Taxon",
			include: [{
				model: models.Taxon,
				as: "acceptedTaxon",
				include: [{
					model: models.TaxonDKnames,
					as: "Vernacularname_DK"
				}]
			}]
		}, {
			model: models.User,
			as: 'User',
			attributes: ['_id', 'email', 'Initialer', 'name']
		}, {
			model: models.User,
			as: 'Validator',
			attributes: ['_id', 'Initialer', 'name']
		},
		{
							model: models.DeterminationVote,
							as: 'Votes',
							attributes: ['_id','user_id', 'createdAt',  'score']
						},
	
	]
		 })
		 .then((determinations)=>{
		 	return res.status(200).json(determinations)
		 })
	 		.
	 	catch(handleError(res));
}


// Creates a new taxon in the DB.
exports.create = function(req, res) {

};

// t is the transaction that this determination should be created under

function createDetermination(obs, determination, user, t, logObject) {

	var userIsValidator = userTool.hasRole(user, 'validator');
	logObject.User.userIsValidator = userIsValidator;
	return Promise.all([models.Taxon.find({
			where: {
				_id: determination.taxon_id
			},
			include: [{
				model: models.Taxon,
				as: "acceptedTaxon",
				include: [{
					model: models.TaxonAttributes,
					as: "attributes",
					fields: ['validation']
				}, {
					model: models.TaxonStatistics,
					as: "Statistics"
				}]
			}]
		}, {
			transaction: t
		}), obs])
		.spread((taxon, obs) => {


			return [getUserBaseImpact(determination.user_id, taxon, logObject, determination), getTaxonWeight(taxon, obs, t, logObject), taxon, obs]

		}).spread((baseScore, taxonWeight, taxon, obs) => {


			console.log("### baseScore: " + baseScore)
			console.log("### taxonWeight: " + taxonWeight)

			logObject.Determination = {};
		
			logObject.Determination.initialScore = baseScore;
			logObject.Determination.confidence = determination.confidence;
			if (userIsValidator && determination.validation === "Godkendt") {
				determination.validation = "Godkendt";
				logObject.Determination.votingSystemOverRuledByValidator = true;
			} else {
				
				determination.validation = 'Valideres';
			}

			determination.createdByUser = user._id;
			// if it was a newly created observation
			if (!determination.observation_id) {
				determination.observation_id = obs._id;
			};

			determination.score = getDeterminationScore(baseScore, taxonWeight);
			determination.baseScore = baseScore;

			return [Determination.create(determination, {
				transaction: t
			}), obs]
		})



};

exports.createDetermination = createDetermination;

exports.updateValidation = (req, res) => {

var logObject = { User: {_id: req.user._id, name: req.user.name, initials: req.user.Initialer }, _eventType: 'VALIDATION STATUS CHANGED BY VALIDATOR'};

return models.sequelize.transaction(function(t) {
 return	Determination.find({
		where: {
			_id: req.params.id
		},
		transaction: t
	}).then(function(determination) {
		
		logObject.Determination = { oldValidationStatus: determination.validation, newValidationStatus: req.body.validation, };
		determination.validation = req.body.validation;
		determination.validator_id = req.user._id;
		return determination.save({
			fields: ['validation', 'validator_id'],
		transaction: t
		})
	})
	.then(function(determination) {
		
		
		
		var updatePromise = (req.body.validation === "Godkendt") ? Determination.update({validation: 'Valideres'}, {where: {
			observation_id: determination.observation_id,
			_id: { $ne:  determination._id},
			validation: 'Godkendt'
		},
		transaction: t}) : Promise.resolve(false);
		
		return [determination, updatePromise]
		})
		.spread(function(determination, updatePromise) {
			return determination;
		})
		.then((det) => {
			
			return [det, models.DeterminationLog.create({ eventType: logObject._eventType, user_id: req.user._id, determination_id: det._id, observation_id: det.observation_id, logObject: JSON.stringify(logObject)}, {transaction: t})]
		})
		.spread(function(det, determinationLogSavePromise) {
			
			return det
		})
	})
	
	.then(function(determination) {
		return res.status(204).json(determination)
	})
}

exports.addDeterminationToObs = (req, res) => {
	var userIsValidator = userTool.hasRole(req.user, 'validator');
	var determination = req.body;
	determination.observation_id = req.params.id;
	determination.user_id = (determination.user_id) ? determination.user_id : req.user._id;
	determination.createdByUser = req.user._id;
	var logObject = { User: {_id: req.user._id, name: req.user.name, initials: req.user.Initialer }, _eventType: 'NEW DETERMINATION ADDED'};


	return models.sequelize.transaction(function(t) {

		return models.Observation.find({
				where: {
					_id: req.params.id
				}
			}, {
				transaction: t
			})
			.then((obs) => {
				return createDetermination(obs, determination, req.user, t, logObject);
			}).spread((det, obs) => {
				var update = (userIsValidator && determination.validation === "Godkendt") ? models.Observation.update({
					primarydetermination_id: det._id
				}, {
					where: {
						_id: req.params.id
					},
					transaction: t
				}) : swapPrimaryDeterminationIfNeeded(obs._id, t, logObject);
				return [update, det, obs]
			})
			.spread((updated, det, obs) => {
				
				return [det, models.DeterminationLog.create({ eventType: logObject._eventType, user_id: req.user._id, determination_id: det._id, observation_id: obs._id, logObject: JSON.stringify(logObject)}, {transaction: t})]
			})
			.spread(function(det, determinationLogSavePromise) {
				
				return det
			})

	})

	.then(( det) => {

		
		
			return models.DeterminationView.find({
				where: {
					Determination_id: det._id
				}
			})

		})
		.then((det) => {
			return res.status(200).json(det);
		})
		.
	catch((err) => {
		var statusCode = (err.message === 'Forbidden') ? 403 : 500;
		console.log(err);

		res.status(statusCode).send(err.message);
	});
}



function getDeterminationScore(usrscore, taxonweight, absScore) {
	

	if (absScore) {
		return Math.ceil((usrscore / (absScore + taxonweight)) * 100)

	} else {
		return Math.ceil((usrscore / (usrscore + taxonweight)) * 100)
	}

}

exports.getDeterminationScore = getDeterminationScore;


/* gives the users impact in a morphogroup with bonus for earlier accepted records. Return a promise  
 */

function getUserBaseImpact(user_id, taxon, logObject, determination) {

	

	var usrPromise = models.User.find({
		where: {
			_id: user_id
		},
		include: {
			model: models.MorphoGroup,
			as: 'MorphoGroup',
			where: {
				_id: taxon.acceptedTaxon.morphogroup_id
			}
		}
	});

	var usrMaxScoreInGroupPromise = models.UserMorphoGroupImpact.max('impact', {
		where: {
			morphogroup_id: taxon.acceptedTaxon.morphogroup_id
		}
	});

	var usrAcceptedCountForTaxonPromise = models.Observation.count({
		include: [{
			model: models.Determination,
			as: "PrimaryDetermination",
			where: {
				user_id: user_id,
				$or: [{
					validation: "Godkendt"
				}, {
					score: {
						$gt: ACCEPTED_SCORE
					}
				}]
			},
			include: [{
				model: models.Taxon,
				as: 'Taxon',
				include: [{
					model: models.Taxon,
					as: "acceptedTaxon",
					where: {
						_id: taxon.acceptedTaxon._id
					}
				}]
			}]
		}]
	})

	/*
	models.Determination.count(
		{where: {user_id: user_id, $or:[{validation: "Godkendt"}, { score:{$gt: 99}}]}, 
		include:[{model:models.Taxon, as: 'Taxon', include: [{model: models.Taxon, as: "acceptedTaxon", where:{_id: taxon.acceptedTaxon._id}}]}]}); */

	return Promise.all([usrPromise, usrMaxScoreInGroupPromise, usrAcceptedCountForTaxonPromise])
		.spread(function(usr, usrMaxScoreInGroup, usrAcceptedCountForTaxon) {
			
			var usrRelativeScore;
			var useConfidencePenalty = (determination && determination.user_id === user_id && determination.confidence === 'mulig') ? true : false;
			
			
			if(!usr){
				// the user has no score in this group.
				usrRelativeScore = 1;
				logObject.User.remarks = "The user has no base score in this group."
			} else {
				
				if(logObject.MorphoGroup){
					logObject.MorphoGroup.userMaxScoreInGroup = usrMaxScoreInGroup;
					logObject.MorphoGroup.morphogroup_id = usr.MorphoGroup[0]._id;
					logObject.MorphoGroup.morphoGroupName = usr.MorphoGroup[0].name_dk;
					
					
				}	else {
					logObject.MorphoGroup = {userMaxScoreInGroup : usrMaxScoreInGroup, morphoGroupName : usr.MorphoGroup[0].name_dk, morphogroup_id : usr.MorphoGroup[0]._id }
				}
				
				logObject.User.morphoGroupImpact = usr.MorphoGroup[0].UserMorphoGroupImpact.impact;
				logObject.User.acceptedCountForTaxon = usrAcceptedCountForTaxon;
				logObject.User.min_impact = usr.MorphoGroup[0].UserMorphoGroupImpact.min_impact;
				logObject.User.max_impact = usr.MorphoGroup[0].UserMorphoGroupImpact.max_impact;
				
				logObject.User.morphoGroupImpactRelative = Math.ceil(usr.MorphoGroup[0].UserMorphoGroupImpact.impact / usrMaxScoreInGroup * 100);
			// We return the userscore + 5 pr accepted record, but no more than 100
				
				if(!useConfidencePenalty)	{
			usrRelativeScore = Math.min(100, (Math.ceil(usr.MorphoGroup[0].UserMorphoGroupImpact.impact / usrMaxScoreInGroup * 100) + (usrAcceptedCountForTaxon * ACCEPTED_OBSERVATION_BONUS)))
			
			// If a user has a minimum-impact, i.e. a trusted specialist	
			if(usr.MorphoGroup[0].UserMorphoGroupImpact.min_impact > usrRelativeScore){
				usrRelativeScore = Math.min(100,usr.MorphoGroup[0].UserMorphoGroupImpact.min_impact);
			}
			// If a user has a maximum-impact, i.e. someone who is not considered skillfull in the current morphogroup
			if(usr.MorphoGroup[0].UserMorphoGroupImpact.max_impact < usrRelativeScore){
				usrRelativeScore = Math.min(100,usr.MorphoGroup[0].UserMorphoGroupImpact.max_impact);
			}	
		} else if(useConfidencePenalty){
			usrRelativeScore = Math.ceil((usr.MorphoGroup[0].UserMorphoGroupImpact.impact * IDENTIFICATION_CERTAINTY_PENALTY_FACTOR) / usrMaxScoreInGroup * 100);
		}
			console.log("usrAcceptedCountForTaxon " + usrAcceptedCountForTaxon)
			console.log("usrRelativeScore " + usrRelativeScore)
		}
			
		logObject.User.morphoGroupImpactCalculated = usrRelativeScore;
			return usrRelativeScore;
		})

}

exports.getUserBaseImpact = getUserBaseImpact;


function addConstantsToLogObject(logObject){
	
	logObject.Constants = {};
	
	logObject.Constants.ACCEPTED_SCORE = ACCEPTED_SCORE;
	// a bonus for each accepted determination of the current accepted taxon - will be added to the users score
	logObject.Constants.ACCEPTED_OBSERVATION_BONUS = ACCEPTED_OBSERVATION_BONUS;

	// we will only take phaenology into account if we have more than 20 records of a taxon
	logObject.Constants.PHAENOLOGY_MIN_ACCEPTED_COUNT = PHAENOLOGY_MIN_ACCEPTED_COUNT;
	// In order to get a bonus for phaenololgy the taxon must not be recorded in more than 9 months
	logObject.Constants.MAX_NUMBER_OF_MONTHS_FOR_PHAENOLOGY_FACTOR = MAX_NUMBER_OF_MONTHS_FOR_PHAENOLOGY_FACTOR;
	// And the taxon weight should be less than 25
	logObject.Constants.MAX_TAXON_WEIGHT_FOR_PHAENOLOGY_FACTOR = MAX_TAXON_WEIGHT_FOR_PHAENOLOGY_FACTOR;
	// if so the taxon weight will be halfed
	logObject.Constants.PHAENOLOGY_BONUS_FACTOR = PHAENOLOGY_BONUS_FACTOR;

	logObject.Constants.PHAENOLOGY_PENALTY_VALUE = PHAENOLOGY_PENALTY_VALUE;

	// if there exists records within a short distance, we will half the taxon penalty
	logObject.Constants.SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_FACTOR = SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_FACTOR;
	// the short distance in km
	logObject.Constants.SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE = SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE;
	// the radius to search for known observations
	logObject.Constants.SEARCH_CLOSEST_RADIUS = SEARCH_CLOSEST_RADIUS;
	// on the other hand, if more than 500 records exists and the observation is more than 25 km from the closest known we add 25 to the penalty
	logObject.Constants.DISTANCE_PENALTY_MIN_ACCEPTED_COUNT = DISTANCE_PENALTY_MIN_ACCEPTED_COUNT;
	logObject.Constants.FAR_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE = FAR_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE;
	logObject.Constants.DISTANCE_PENALTY_VALUE = DISTANCE_PENALTY_VALUE;

	logObject.Constants.MAX_TAXON_WEIGHT = MAX_TAXON_WEIGHT;
	
	logObject.Constants.DEFAULT_HIGHER_TAXON_WEIGHT = DEFAULT_HIGHER_TAXON_WEIGHT;
	logObject.Constants.DEFAULT_HIGHER_TAXON_RANK_LIMIT = DEFAULT_HIGHER_TAXON_RANK_LIMIT;
	logObject.Constants.DEFAULT_HIGHER_TAXON_FACTOR = DEFAULT_HIGHER_TAXON_FACTOR;
	logObject.Constants.IDENTIFICATION_CERTAINTY_PENALTY_FACTOR = IDENTIFICATION_CERTAINTY_PENALTY_FACTOR;
	
}

exports.getCrowsourcedIdentificationConstants = function(){
	
	var obj = {};
	
	addConstantsToLogObject(obj);
	
	return obj.Constants;
	
}


function getTaxonWeight(taxon, obs, t, logObject) {

	if(!logObject){
		logObject = {};
	};
	
	if(!logObject.Taxon){
		logObject.Taxon = { _id : taxon.acceptedTaxon._id, FullName: taxon.acceptedTaxon.FullName};
	} else {
		_.merge(logObject.Taxon, { _id : taxon.acceptedTaxon._id, FullName: taxon.acceptedTaxon.FullName});
	}
	
	// Observation included here to calculations based on phaenology

	var scoreSql = `select t.FullName, CEIL(CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((if((ts.accepted_count IS NULL),0, ts.accepted_count)
	 +1.1))) * 100) * 100
	/ CEIL((LOG10((SELECT MAX(accepted_count) +1.2 FROM TaxonStatistics)) - LOG10((1.1))) * 100)) as TaxonWeight,
	 ts.accepted_count as recordCount, (SELECT MAX(accepted_count) FROM TaxonStatistics) as maxRecordCount
	FROM Taxon t LEFT JOIN TaxonStatistics ts  ON ts.taxon_id = t._id WHERE t._id = :taxonid`;


	var taxonWeightPromise = (taxon.acceptedTaxon.RankID < DEFAULT_HIGHER_TAXON_RANK_LIMIT) ? Promise.resolve([{TaxonWeight: DEFAULT_HIGHER_TAXON_WEIGHT}]) : models.sequelize.query(scoreSql, {
		replacements: {
			taxonid: taxon.acceptedTaxon._id

		},
		type: models.sequelize.QueryTypes.SELECT
	});
	
	return Promise.all([taxonWeightPromise, getDistanceToClosetsAcceptedObservation(obs, taxon, t), getPhaenologyFactor(obs, taxon), previousRecordsThisMonth(obs, taxon, t)])

	.spread(function(taxonCalculation, closestDistance, phaenologyFactor, prevRecordsThisMonth) {
		
		if(!taxon.acceptedTaxon.morphogroup_id) {
			logObject.WARNING = taxon.acceptedTaxon.FullName + " is not assigned to a morphogroup!"; 
		};
		
		logObject.Taxon.taxonWeight = taxonCalculation[0].TaxonWeight;
		
		
		if(logObject.MorphoGroup){
			logObject.MorphoGroup.morphogroup_id = taxon.acceptedTaxon.morphogroup_id;
		}	else {
			logObject.MorphoGroup = {morphogroup_id : taxon.acceptedTaxon.morphogroup_id}
		}
		
		addConstantsToLogObject(logObject)
		var factor = 1;
		if (taxon.acceptedTaxon.Statistics.accepted_count > PHAENOLOGY_MIN_ACCEPTED_COUNT && taxon.acceptedTaxon.RankID >= DEFAULT_HIGHER_TAXON_RANK_LIMIT) {
			if (prevRecordsThisMonth > 0 && taxonCalculation[0].TaxonWeight < MAX_TAXON_WEIGHT_FOR_PHAENOLOGY_FACTOR) {
				factor = factor * phaenologyFactor;
			}
			logObject.Taxon.phaenologyFactor = phaenologyFactor;

		};
		
		
		if (closestDistance < SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE && taxon.acceptedTaxon.RankID >= DEFAULT_HIGHER_TAXON_RANK_LIMIT) {
			factor = factor * SHORT_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_FACTOR;
			logObject.Taxon.closestDistance = Math.round(closestDistance * 100) / 100;
		}

		var taxonWeight = taxonCalculation[0].TaxonWeight * factor;
		
		if(taxon.acceptedTaxon.RankID >= DEFAULT_HIGHER_TAXON_RANK_LIMIT){
			
			
			
			logObject.Taxon.taxon_accepted_count = taxon.acceptedTaxon.Statistics.accepted_count;
			
		// additions
		if (closestDistance >= FAR_DISTANCE_TO_CLOSEST_KNOWN_RECORDING_DISTANCE && taxon.acceptedTaxon.Statistics.accepted_count > DISTANCE_PENALTY_MIN_ACCEPTED_COUNT) {
			taxonWeight += DISTANCE_PENALTY_VALUE;
		}

		if (prevRecordsThisMonth === 0 && (taxon.acceptedTaxon.Statistics.accepted_count > PHAENOLOGY_MIN_ACCEPTED_COUNT)) {
			taxonWeight += PHAENOLOGY_PENALTY_VALUE;
		}
	}
		
		logObject.Taxon.calculatedTaxonWeight = taxonWeight;
		
		return Math.min(MAX_TAXON_WEIGHT, taxonWeight);
	})
}

exports.getTaxonWeight = getTaxonWeight;



function getDistanceToClosetsAcceptedObservation(obs, taxon, t) {
	var sql = `SELECT p._id, z._id, 
           p.distance_unit
                    * DEGREES(ACOS(COS(RADIANS(p.latpoint))
                    * COS(RADIANS(z.decimalLatitude))
                    * COS(RADIANS(p.longpoint) - RADIANS(z.decimalLongitude))
                    + SIN(RADIANS(p.latpoint))
                    * SIN(RADIANS(z.decimalLatitude)))) AS distance_in_km
     FROM (SELECT o._id, o.decimalLatitude, o.decimalLongitude FROM Observation o JOIN Determination d JOIN Taxon t 
		 ON o.primarydetermination_id=d._id AND o._id <> :observation_id AND d.taxon_id= t._id AND t.accepted_id= :taxon_id AND (d.validation="Godkendt" OR d.score > :accepted_score)) AS z
     JOIN (   
           SELECT  _id,  decimalLatitude  AS latpoint,  decimalLongitude AS longpoint,
                   :radius AS radius,      111.045 AS distance_unit FROM Observation WHERE  _id = :observation_id
       ) AS p 
     WHERE z.decimalLatitude
        BETWEEN p.latpoint  - (p.radius / p.distance_unit)
            AND p.latpoint  + (p.radius / p.distance_unit)
       AND z.decimalLongitude
        BETWEEN p.longpoint - (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
            AND p.longpoint + (p.radius / (p.distance_unit * COS(RADIANS(p.latpoint))))
     GROUP BY p._id, distance_in_km ORDER BY distance_in_km ASC
	   LIMIT 1;`;
	return models.sequelize.query(sql, {
			replacements: {
				taxon_id: taxon.acceptedTaxon._id,
				observation_id: obs._id,
				accepted_score: ACCEPTED_SCORE,
				radius: SEARCH_CLOSEST_RADIUS

			},
			transaction: t,
			type: models.sequelize.QueryTypes.SELECT
		})
		.then(function(result) {
			return (result.length > 0) ? result[0].distance_in_km : SEARCH_CLOSEST_RADIUS;
		})

}


exports.getDistanceToClosetsAcceptedObservation = getDistanceToClosetsAcceptedObservation;


function previousRecordsThisMonth(obs, taxon, t) {


	var sql = `SELECT COUNT(*) as count FROM Observation o JOIN Observation o2 JOIN Determination d JOIN Taxon t 
	ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= :taxon_id AND (d.validation="Godkendt" OR d.score > :accepted_score) AND MONTH(o.observationDate) = MONTH(o2.observationDate) AND o2._id = :observation_id AND o._id <> :observation_id;`;


	return models.sequelize.query(sql, {
			replacements: {
				taxon_id: taxon.acceptedTaxon._id,
				observation_id: obs._id,
				accepted_score: ACCEPTED_SCORE

			},
			transaction: t,
			type: models.sequelize.QueryTypes.SELECT
		})
		.then(function(result) {

			var count = (result.length > 0) ? result[0].count : 0;

			return count;
		})


}

function getPhaenologyFactor(obs, taxon) {

	if (taxon.acceptedTaxon.Statistics.accepted_count < PHAENOLOGY_MIN_ACCEPTED_COUNT) {

		return Promise.resolve(1);
	} else {



		var sql = `SELECT COUNT(*) as count, MONTH(observationDate) as month FROM Observation o JOIN Determination d JOIN Taxon t ON o.primarydetermination_id=d._id AND d.taxon_id= t._id AND t.accepted_id= :taxon_id AND o._id <> :observation_id AND (d.validation="Godkendt" OR d.score > :accepted_score) AND MONTH(observationDate) >0 GROUP BY MONTH(observationDate);`

		return models.sequelize.query(sql, {
				replacements: {
					taxon_id: taxon.acceptedTaxon._id,
					accepted_score: ACCEPTED_SCORE,
					observation_id : obs._id

				},
				type: models.sequelize.QueryTypes.SELECT
			})
			.then(function(result) {

				return (result.length <= MAX_NUMBER_OF_MONTHS_FOR_PHAENOLOGY_FACTOR) ? PHAENOLOGY_BONUS_FACTOR : 1;
			})
	};

}



exports.getPhaenologyFactor = getPhaenologyFactor;



function swapPrimaryDeterminationIfNeeded(observation_id, t, logObject) {

//return models.sequelize.transaction(function(t){
	return models.Observation.find({
			where: {
				_id: observation_id
			},
			include: [{
				model: models.Determination,
				as: 'PrimaryDetermination'

			}, {
				model: models.Determination,
				as: 'Determinations',
				include: [{
					model: models.Taxon,
					as: 'Taxon',
					include: [{
						model: models.Taxon,
						as: 'acceptedTaxon'

					}]

				}]

			}],
			transaction: t
		})
		.then(function(obs) {

			
			if (obs.PrimaryDetermination.validation === "Godkendt") {
				logObject.primaryDeterminationSwapped = false;
				return Promise.resolve(obs);
				
			} else {
				/*
				var newPrimaryDetermination = obs.PrimaryDetermination;
				
				for(var i=0; i < obs.Determinations.length; i++){
					var score = obs.Determinations[i].score;
					if(obs.Determinations[i].RankID >= DEFAULT_HIGHER_TAXON_RANK_LIMIT){
						score = score *  DEFAULT_HIGHER_TAXON_FACTOR;
					}
					
					if(score > newPrimaryDetermination.score){
						newPrimaryDetermination = obs.Determinations[i];
					}
				}
				*/
				
				
			var newPrimaryDetermination = 	 _.maxBy(obs.Determinations, function(d) {
					// determinations to higher taxon will be handicapped towards determinations to species
					return (d.Taxon.acceptedTaxon.RankID >= DEFAULT_HIGHER_TAXON_RANK_LIMIT) ? d.score : (d.score * DEFAULT_HIGHER_TAXON_FACTOR);
				});
				
				
				
				logObject.primaryDeterminationSwapped = (obs.PrimaryDetermination._id != newPrimaryDetermination._id ) ? true : false;
				
			
			return	obs.setPrimaryDetermination(newPrimaryDetermination, {transaction: t});
			//	return obs.save();
			}
		})
		
//		})


}


exports.swapPrimaryDeterminationIfNeeded	= 	swapPrimaryDeterminationIfNeeded;	


// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(function(det) {
			return det.update(req.body)
		})
		.then(function(det) {
			return res.status(204).json(det)
		})
		.
	catch(handleError(res));

};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Determination.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch(handleError(res));
};
