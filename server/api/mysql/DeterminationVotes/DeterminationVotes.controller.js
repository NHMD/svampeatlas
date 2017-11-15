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
var DeterminationVote = models.DeterminationVote;
var Promise = require("bluebird");
var determinationController = require('../Determination/Determination.controller');

var nestedQueryParser = require("../nestedQueryParser")
var userTool = require("../userTool");

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


	DeterminationVote.findAndCount(query)
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
	DeterminationVote.find({
			where: {
				_id: req.params.id
			}
			/*,
		include: [{
				model: models.TaxonImages,
				as: "images"
			}, {
				model: models.TaxonSpeciesHypothesis,
				as: 'specieshypothesis'
			},
			{
				model: models.Taxon,
				as: "synonyms"
			}, {
				model: models.Taxon,
				as: "Parent"
			}, {
				model: models.Taxon,
				as: "acceptedTaxon"
			}, {
				model: models.TaxonAttributes,
				as: "attributes"
			}, {
				model: models.Naturtype,
				as: 'naturtyper'
			}, {
				model: models.ErnaeringsStrategi,
				as: 'nutritionstrategies'
			}, {
				model: models.TaxonomyTag,
				as: 'tags'
			}

		] */
		})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch(handleError(res));
};



exports.addVoteToDetermination = (req, res) => {
	var vote = req.body;
	vote.determination_id = req.params.id;
	vote.user_id = req.user._id;
	
	var logObject = { User: {_id: req.user._id, name: req.user.name, initials: req.user.Initialer }, _eventType: 'VOTE ADDED'};
// Calculation of determination score is wrapped in a transaction
	var prevScore;
	return models.sequelize.transaction(function(t) {
			
		return models.Determination.find({
			where: {
				_id: req.params.id
			},
			include: [{
				model: models.Observation,
				as: "Observation"
			}, {
				model: models.Taxon,
				as: 'Taxon',
				include: [{
					model: models.Taxon,
					as: "acceptedTaxon",
					include: [{
						model: models.TaxonStatistics,
						as: "Statistics"
					}]
				}]
			}],
			transaction: t
		})

		.then(function(det) {
				
			prevScore = det.score;
				if (det.user_id === req.user._id) {
					throw new Error("You are not allowed to vote on your own identifications");
				}
				vote.observation_id = det.observation_id;

				return [determinationController.getUserBaseImpact(req.user._id, det.Taxon, logObject), det];



			})
			.spread(function(userImpact, det) {

				if (vote.upOrDown === 'up') {
					vote.score = parseInt(userImpact);
				}
				if (vote.upOrDown === 'down') {
					if(!userTool.hasRole(req.user, 'downvotedetermination')){
						throw new Error("Downvote authorization missing");
					}
					vote.score = (0 - parseInt(userImpact));
				}


				return [DeterminationVote.create(vote, {transaction: t}), det];
			})
			
		.spread(function(vote, det) {		

			logObject.Vote = vote;
					return Promise.all([vote, det, calculateSumAndAbsSum(det, t),
						determinationController.getTaxonWeight(det.Taxon, det.Observation, t, logObject)
					])

})
				
				.spread(function(vote, det, SumAndAbsSum, taxonWeight) {
					
					logObject.Determination = {};
					
					logObject.Determination.initialScore = det.baseScore;
					logObject.Determination.sumOfVotes = SumAndAbsSum.sum;
					logObject.Determination.absoluteSumOfVotes = SumAndAbsSum.absSum;
		
					// the ABS sum is used in the calculation to ensure correctness if theres negative votes
					
						// extend to use det.baseScore
					det.score = determinationController.getDeterminationScore(SumAndAbsSum.sum + det.baseScore, taxonWeight, SumAndAbsSum.absSum + det.baseScore);
					logObject.Determination.newCalculatedScore = det.score;
					return [det.save({
						transaction: t
					}),  {
						vote: vote,
						newDeterminationScore: det.score
					}];
				})
				.spread(function(det,  result) {
					
					return [determinationController.swapPrimaryDeterminationIfNeeded(det.observation_id, t, logObject), result, det]
					
				})
				.spread(function(obs, result, det) {
					result.newPrimaryDeterminationId = obs.primarydetermination_id
					var promises = [result, models.DeterminationLog.create({ eventType: logObject._eventType, user_id: req.user._id, determination_id: det._id, observation_id: obs._id, logObject: JSON.stringify(logObject)}, {transaction: t})];
					if(det.score >= determinationController.Constants.ACCEPTED_SCORE && prevScore < determinationController.Constants.ACCEPTED_SCORE){
						
											promises.push( models.ObservationEvent.create({
									eventType: 'DETERMINATION_APPROVED',
									user_id: req.user._id,
									observation_id: det.observation_id,
									determination_id: det._id		
								}, {
											transaction: t
										}))
										
					}
					
					return promises;
				})
				.spread(function(result, determinationLogSavePromise) {
					
					return result
				})
				
		
		// Calculation of determination score is wrapped in a transaction
		// Transaction commits here (Sequelize managed transaction)
		})
		
		.then(function(result) {
			return res.status(201).json(result)
		})
		.
	catch((err) => {
		var statusCode = (err.message === "You are not allowed to vote on your own identifications" || err.message ==="Downvote authorization missing" || err.message ==='Validation error') ? 403 : 500;
		console.log(err);

		res.status(statusCode).send(err.message);
	});
}

function calculateSumAndAbsSum(determination, t){
	
	return Promise.all([
		models.DeterminationVote.sum('score', {
									where: {
										determination_id: determination._id,
										score: {$gte: 0}
									},
									transaction: t
								}),


								models.DeterminationVote.findAll({
									where: {
										determination_id: determination._id
									},
									attributes: [
										[models.sequelize.fn('SUM', models.sequelize.fn('ABS', models.sequelize.col('score'))), 'absolutesum']
									],
									group: ['determination_id'],
									transaction: t
								})
	])
	.spread(function(sum, absSumCalc){
		
		// if the set is empty the calculation is 0
		var absSum = (absSumCalc.length === 1) ? absSumCalc[0].get({
			plain: true
		}).absolutesum : 0;
		
		if(!sum) {
			sum = 0;
		}

		return {sum: sum, absSum:absSum }
	})
	
	
}

exports.calculateSumAndAbsSum = calculateSumAndAbsSum;

exports.deleteVoteFromDetermination = function(req, res){
	
	
	var determination_id = req.params.id;
	
	var logObject = { User: {_id: req.user._id, name: req.user.name, initials: req.user.Initialer }, _eventType: 'VOTE DELETED'};
		// Calculation of determination score is wrapped in a transaction
		
		return models.sequelize.transaction(function(t) {
			return models.DeterminationVote.destroy({
				where: {
					determination_id: req.params.id,
			
					user_id: req.user._id
				},
				transaction: t
			})
			.then(function(){
						return models.Determination.find({
					where: {
						_id: req.params.id
					},
					include: [{
						model: models.Observation,
						as: "Observation"
					}, {
						model: models.Taxon,
						as: 'Taxon',
						include: [{
							model: models.Taxon,
							as: "acceptedTaxon",
							include: [{
								model: models.TaxonStatistics,
								as: "Statistics"
							}]
						}]
					}],
					transaction: t
				})
				
				})

					.then(function(det) {


						return [det,  calculateSumAndAbsSum(det, t),
							determinationController.getTaxonWeight(det.Taxon, det.Observation, t, logObject)
						];


					})
					.spread(function(det,  SumAndAbsSum, taxonWeight) {
						
						logObject.Determination = {};
						
						logObject.Determination.initialScore = det.baseScore;
						logObject.Determination.sumOfVotes = SumAndAbsSum.sum;
						logObject.Determination.absoluteSumOfVotes = SumAndAbsSum.absSum;
						
						console.log("########")
						console.log(JSON.stringify(SumAndAbsSum));

						/*
						console.log("######### absSumCalc "+JSON.stringify(absSumCalc))
						var absSum = absSumCalc[0].get({
							plain: true
						}).absolutesum
						*/
						// the ABS sum is used in the calculation to ensure correctness if theres negative votes
					
							// extend to use det.baseScore
						det.score = determinationController.getDeterminationScore(SumAndAbsSum.sum + det.baseScore, taxonWeight, SumAndAbsSum.absSum + det.baseScore);
						console.log("####### score: "+det.score)
						logObject.Determination.newCalculatedScore = det.score;
						
						return [det.save({
							transaction: t
						}),
						 {
						
							newDeterminationScore: det.score
						}];
					})
					.spread(function(det,  result) {
						
						return [determinationController.swapPrimaryDeterminationIfNeeded(det.observation_id, t, logObject), result, det]
						
					})
					.spread(function(obs, result, det) {
						result.newPrimaryDeterminationId = obs.primarydetermination_id
						return [result, models.DeterminationLog.create({ eventType: logObject._eventType, user_id: req.user._id, determination_id: det._id, observation_id: obs._id, logObject: JSON.stringify(logObject)}, {transaction: t})]
					})
					.spread(function(result, determinationLogSavePromise) {
					
						return result
					})
					
			
			// Transaction commits here (Sequelize managed transaction)
	
	})
	
	

		.then(function(result) {
			
			return res.status(200).json(result)
		})
		.
	catch((err) => {
		var statusCode = (err.message === "Not Found") ? 404 : 500;
		console.log(err);

		res.status(statusCode).send(err.message);
	});
	
}


function getUserImpact(user, determination) {


	// When testing return a already resolved promise with value 1. This can be extended to DB queries and calculations
	return Promise.resolve(1);
}

exports.getUserImpact = getUserImpact;

// Creates a new taxon in the DB.
exports.create = function(req, res) {

};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {


};


// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	DeterminationVote.find({
			where: {
				_id: req.params.id
			}
		})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch(handleError(res));
};
