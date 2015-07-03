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
var soap = require('soap');
var wsdl = "http://www.indexfungorum.org/ixfwebservice/fungus.asmx?WSDL";
var models = require('../')
var Taxon = models.Taxon;
var Promise = require("bluebird");
Promise.promisifyAll(soap);

function handleError(res, statusCode) {
	statusCode = statusCode || 500;
	return function(err) {
		res.status(statusCode).send(err);
	};
}

function responseWithResult(res, statusCode) {
	statusCode = statusCode || 200;
	return function(entity) {
		if (entity) {
			return res.json(statusCode, entity);
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
		order: req.query.order
	};
	if (req.query.where) {
		query['where'] = JSON.parse(req.query.where);
	}


	Taxon.findAndCount(query)
		.then(function(taxon) {
			res.set('count', taxon.count);
			if (req.query.offset) {
				res.set('offset', req.query.offset);
			};
			if (req.query.limit) {
				res.set('limit', req.query.limit);
			};

			return res.json(200, taxon.rows);
		})
		.
	catch (handleError(res));
};

// Get a single taxon
exports.show = function(req, res) {
	Taxon.find({
		where: {
			_id: req.params.id
		},
		include: [{
			model: models.TaxonImages,
			as: "images"},
			{
						model: models.Taxon,
						as: "synonyms"},
				{
							model: models.Taxon,
							as: "Parent"},
					{
								model: models.Taxon,
								as: "acceptedTaxon"}
							
		]
	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};

exports.updateSystematics = function(req, res) {
	Taxon.find({
		where: {
			_id: req.params.id
		}
	})
		.then(function(taxon) {

			soap.createClient(wsdl, function(err, client) {
				if (err) throw err;

				client.NameByKey({
					NameKey: taxon.FunIndexNumber
				}, function(err, result) {
					if (err) {
						res.status(500).json(err.message)
					};
					var r = result.NameByKeyResult.NewDataSet.IndexFungorum;
					if (r !== undefined) {
						var systematicPath = r.Kingdom_x0020_name + ", " + r.Phylum_x0020_name + ", " + r.Subphylum_x0020_name + ", " + r.Class_x0020_name + ", " + r.Subclass_x0020_name + ", " + r.Order_x0020_name + ", " + r.Family_x0020_name + ", " + r.Genus_x0020_name;
						var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
						taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
						taxon.SystematicPath = systematicPath;
						taxon.save().then(function() {
							res.status(200).json(taxon);
						})
					} else {
						res.status(200).json("Taxon not found in Index Fungorum");
					}

				});
			});

		})
		.
	catch (handleError(res));
};

function getSystematicPath(r, rankName){
	var systematicPath = "";
	if(r.Kingdom_x0020_name) {
		systematicPath += r.Kingdom_x0020_name;
		if(rankName === "regn.") return systematicPath;
	};
	if(r.Phylum_x0020_name) {
		systematicPath += (", "+r.Phylum_x0020_name);
		if(rankName === "phyl.") return systematicPath;
	};
	if(r.Subphylum_x0020_name) {
		systematicPath += (", "+r.Subphylum_x0020_name);
		if(rankName === "subphyl.") return systematicPath;
	};
	if(r.Class_x0020_name) {
		systematicPath += (", "+r.Class_x0020_name);
		if(rankName === "class.") return systematicPath;
	};
	if(r.Subclass_x0020_name) {
		systematicPath += (", "+r.Subclass_x0020_name);
		if(rankName === "subclass.") return systematicPath;
	};
	if(r.Order_x0020_name) {
		systematicPath += (", "+r.Order_x0020_name);
		if(rankName === "ord.") return systematicPath;
	};
	if(r.Family_x0020_name) {
		systematicPath += (", "+r.Family_x0020_name);
		if(rankName === "fam.") return systematicPath;
	};
	if(r.Genus_x0020_name) {
		systematicPath += (", "+r.Genus_x0020_name);
		if(rankName === "gen.") return systematicPath;
	};
	
	return systematicPath;
};

exports.getSystematicPath = getSystematicPath;
// Updates all genera with correct systematic path and currentuse idx
exports.updateAllSystematicsById = function(req, res) {
	Taxon.findAll({
		where: 
			models.Sequelize.or(
				{ RankName:  "genus"},
				{ RankName:  "gen."}
			)
		
			
		
	})
		.then(function(taxa) {
			
			return soap.createClientAsync(wsdl).then(function(client) {
				
				Promise.promisifyAll(client)
				Promise.reduce(taxa, function(previous, taxon) {
					return client.NameByKeyAsync({
						NameKey: taxon.FunIndexNumber
					}).then(function(result) {

						var r = result[0].NameByKeyResult.NewDataSet.IndexFungorum;

						if (r !== undefined) {
							console.log("updating "+taxon.TaxonName+ " FunId: "+r.RECORD_x0020_NUMBER);
							/*
							var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
							if (FunIndexCurrUseNumber) {
								taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
							};
							*/
							taxon.SystematicPath = getSystematicPath(r, "gen.");
							
						//	taxon.RankName = r.INFRASPECIFIC_x0020_RANK;
							return taxon.save();
						} else {
							return 1;
						};


					});
				}, 0)
					.then(function(total) {
						res.status(200).json("Processed " + taxa.length + " taxa");
					}).
				catch (function(err) {
					console.log(JSON.stringify(err))
				});

			});

		}).catch (handleError(res));
};

// Updates all supergeneric with correct systematic path and currentuse idx
exports.updateAllSystematicsByTypificationId = function(req, res) {
	Taxon.findAll({
		where: 
			models.Sequelize.and(
			      { RankName: {ne: "genus"} },
			      { RankName: {ne: "species"} },
				{ RankName: {ne: "supergeneric rank"} }
			    )
		
	})
		.then(function(taxa) {
			
			return soap.createClientAsync(wsdl).then(function(client) {
				
				Promise.promisifyAll(client)
				Promise.reduce(taxa, function(previous, taxon) {
					return client.NameByKeyAsync({
						NameKey: taxon.FunIndexTypificationNumber
					}).then(function(result) {

						var r = result[0].NameByKeyResult.NewDataSet.IndexFungorum;

						if (r !== undefined) {
							/*
							var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
							if (FunIndexCurrUseNumber) {
								taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
							};
							*/
							taxon.SystematicPath = getSystematicPath(r, taxon.RankName);
						//	taxon.RankName = r.INFRASPECIFIC_x0020_RANK;
							return taxon.save();
						} else {
							return 1;
						};


					});
				}, 0)
					.then(function(total) {
						res.status(200).json("Processed " + taxa.length + " taxa");
					}).
				catch (function(err) {
					console.log(JSON.stringify(err))
				});

			});

		}).catch (handleError(res));
};

function findCurrentUseTaxon(soapResult){
	
	if( Object.prototype.toString.call( soapResult ) === '[object Array]' ) {
		var currentTaxon = _.find(soapResult, function(taxon) {
  		  	return taxon.RECORD_x0020_NUMBER === taxon.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
		});
		
		return (currentTaxon !== undefined) ?  currentTaxon : soapResult[0];
		
	} else {
		return soapResult;
	}
	
}
// Updates all genera with correct systematic path and currentuse idx
exports.updateAllFUNIdsByNameMatch = function(req, res) {
	var where = (req.params.taxonrank === "genus") ? models.Sequelize.and(
			      { RankName:"genus"},
				{ FunIndexNumber: 0 }
				
			    ) : {
			RankName: "supergeneric rank"
		};
	/*
	Taxon.findAll({
		where: {
			RankName: "supergeneric rank"
		}
	}) */
	Taxon.findAll({
		where: where
	})
		.then(function(taxa) {
			
			return soap.createClientAsync(wsdl).then(function(client) {
				
				Promise.promisifyAll(client);
		
				Promise.reduce(taxa, function(previous, taxon) {
					return client.NameSearchAsync({
						SearchText: taxon.TaxonName,
						AnywhereInText: false,
						MaxNumber: 25
					}).then(function(result) {
						
						var r = findCurrentUseTaxon(result[0].NameSearchResult.NewDataSet.IndexFungorum);

						if (r !== undefined) {
							console.log("updating "+taxon.TaxonName+ " FunId: "+r.RECORD_x0020_NUMBER);
							var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
							
							if (FunIndexCurrUseNumber) {
								taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
							} else {
								taxon.FunIndexCurrUseNumber = 0;
							}
							
							var FunIndexTypificationNumber = parseInt(r.TYPIFICATION_x0020_DETAILS);
							
							if (FunIndexTypificationNumber) {
								taxon.FunIndexTypificationNumber = FunIndexTypificationNumber;
							} else {
								taxon.FunIndexTypificationNumber = 0;
							}
					
							taxon.RankName = r.INFRASPECIFIC_x0020_RANK;
							taxon.FunIndexNumber = r.RECORD_x0020_NUMBER;
							taxon.GUID = r.UUID;
							return taxon.save();
						} else {
							return 1;
						};


					});
				}, 0)
					.then(function(total) {
						res.status(200).json("Processed " + taxa.length + " taxa");
					}).
				catch (function(err) {
					console.log(JSON.stringify(err))
				});

			});

		}).catch (handleError(res));
};


// Updates all genera with correct systematic path and currentuse idx
exports.syncAllFUNIdsByNameMatch = function(req, res) {
	Taxon.findAll({
		where: models.Sequelize.and(
				{ FunIndexNumber: 0 },
			      { RankName: {ne: "genus"} },
			      { RankName: {ne: "species"} },
				{ RankName: {ne: "supergeneric rank"} }
			    )
	})
		.then(function(taxa) {
			
			return soap.createClientAsync(wsdl).then(function(client) {
				
				Promise.promisifyAll(client);
		
				Promise.reduce(taxa, function(previous, taxon) {
					return client.NameSearchAsync({
						SearchText: taxon.TaxonName,
						AnywhereInText: false,
						MaxNumber: 25
					}).then(function(result) {
						
						var r = findCurrentUseTaxon(result[0].NameSearchResult.NewDataSet.IndexFungorum);

						if (r !== undefined) {
							console.log("updating "+taxon.TaxonName+ " FunId: "+r.RECORD_x0020_NUMBER);
							var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
							
							if (FunIndexCurrUseNumber) {
								taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
							} else {
								taxon.FunIndexCurrUseNumber = 0;
							}
							
							var FunIndexTypificationNumber = parseInt(r.TYPIFICATION_x0020_DETAILS);
							
							if (FunIndexTypificationNumber) {
								taxon.FunIndexTypificationNumber = FunIndexTypificationNumber;
							} else {
								taxon.FunIndexTypificationNumber = 0;
							}
							
							taxon.GUID = r.UUID;
							taxon.FunIndexNumber = r.RECORD_x0020_NUMBER;
							taxon.Author = r.AUTHORS;
							return taxon.save();
						} else {
							return 1;
						};


					});
				}, 0)
					.then(function(total) {
						res.status(200).json("Processed " + taxa.length + " taxa");
					}).
				catch (function(err) {
					console.log(JSON.stringify(err))
				});

			});

		}).catch (handleError(res));
};

// Updates all genera with correct systematic path and currentuse idx
exports.syncAllFUNIdsByNameMatchForNewParentSpecies = function(req, res) {
	Taxon.findAll({
		where: models.Sequelize.and(
				{ isAccepted: 0 },
			     
			{ RankName:  "species" }

			    )
	})
		.then(function(taxa) {
			
			return soap.createClientAsync(wsdl).then(function(client) {
				
				Promise.promisifyAll(client);
		
				Promise.reduce(taxa, function(previous, taxon) {
					return client.NameSearchAsync({
						SearchText: taxon.FullName,
						AnywhereInText: false,
						MaxNumber: 25
					}).then(function(result) {
						
						var r = findCurrentUseTaxon(result[0].NameSearchResult.NewDataSet.IndexFungorum);

						if (r !== undefined) {
							console.log("updating "+taxon.TaxonName+ " FunId: "+r.RECORD_x0020_NUMBER);
							var FunIndexCurrUseNumber = r.CURRENT_x0020_NAME_x0020_RECORD_x0020_NUMBER;
							
							if (FunIndexCurrUseNumber) {
								taxon.FunIndexCurrUseNumber = FunIndexCurrUseNumber;
							} else {
								taxon.FunIndexCurrUseNumber = 0;
							}
							
							var FunIndexTypificationNumber = parseInt(r.TYPIFICATION_x0020_DETAILS);
							
							if (FunIndexTypificationNumber) {
								taxon.FunIndexTypificationNumber = FunIndexTypificationNumber;
							} else {
								taxon.FunIndexTypificationNumber = 0;
							}
							
							taxon.FullName = r.NAME_x0020_OF_x0020_FUNGUS +" "+r.AUTHORS;
							taxon.FunIndexNumber = r.RECORD_x0020_NUMBER;
							taxon.Author = r.AUTHORS;
							taxon.GUID = r.UUID;
							return taxon.save();
						} else {
							return 1;
						};


					});
				}, 0)
					.then(function(total) {
						res.status(200).json("Processed " + taxa.length + " taxa");
					}).
				catch (function(err) {
					console.log(JSON.stringify(err))
				});

			});

		}).catch (handleError(res));
};

// Creates a new taxon in the DB.
exports.create = function(req, res) {
	var parent_id = req.body.Parent._id;
	var newTaxon = req.body;
	newTaxon.parent_id = parent_id;
	newTaxon.Path = "XXXXX"; // a dummy path which will be changed once we have the ID - everything is wrapped in a transaction.
	models.sequelize.transaction(function(t) {

		return Taxon.find({
			where: {
				_id: parent_id
			}
		}, {
			transaction: t
		})
			.then(function(parent) {

				return [Taxon.create(newTaxon, {
					transaction: t
				}), parent];
			})
			.spread(function(taxon, parent) {
				taxon.SystematicPath = parent.SystematicPath + ", " + taxon.TaxonName;
				taxon.Path = parent.Path + ", " + taxon._id;
				taxon.accepted_id = taxon._id;
				return taxon.save({
					transaction: t
				});
			})
			.then(function(taxon) {
		
				return [taxon, models.TaxonLog.create({
					eventname: "New taxon",
					description: taxon.FullName + " (id: "+taxon._id+") was added to our database. Datasource: "+newTaxon.dataSource,
					user_id: req.user._id,
					taxon_id: taxon._id
			
				})]
			})


	})
	
		.spread(function(taxon) {
			return Taxon.find({
				where: {
					_id: taxon._id
				},
				include: [{
						model: models.Taxon,
						as: "Parent"
					}, {
						model: models.Taxon,
						as: "acceptedTaxon"
					}

				]
			})
		})

	.then(function(taxon) {

		return res.status(201).json(taxon);
	})
		.
	catch (handleError(res));
};



// Updates an existing taxon in the DB.
exports.update = function(req, res) {
	
	Taxon.find({
		where: {
			_id: req.params.id
		}
	})
	.then(function(taxon){
		if(!taxon){
			res.send(404);
		};
		for(var i=0; i< taxon.attributes.length; i++){
			taxon.set(taxon.attributes[i] , req.body[taxon.attributes[i]])
		}
		var changed = taxon.changed().toString();
		
		return [taxon.save(), changed];
		
	})
	.spread(function(taxon, changed){
		if(changed.indexOf("RankID") > -1){
			return [taxon, models.TaxonLog.create({
				eventname: "Changed taxonomic rank",
				description: "New rank: "+taxon.RankName+", rank level: "+taxon.RankID,
				user_id: req.user._id,
				taxon_id: taxon._id
			
			})]
		} else {
			return [taxon, models.TaxonLog.create({
			eventname: "Updated taxon",
			description: "Field(s): "+changed,
			user_id: req.user._id,
			taxon_id: taxon._id
			
		})]}
		
	})
	.spread(function(taxon){
	
		return res.status(204).json(taxon);
		
	})
		
		.
	catch (handleError(res));
};

// Deletes a taxon from the DB.
exports.destroy = function(req, res) {
	Taxon.find({
		where: {
			_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

exports.setParent = function(req, res) {

	var parentTaxon = req.body;

	Taxon.find({
		where: {
			_id: req.params.id
		},
		include: [{
			model: models.Taxon,
			as: "Parent"
		}]
	}).then(function(taxon) {
		
		if (taxon.Parent === null) {
			
			taxon.SystematicPath = parentTaxon.SystematicPath + ", " + taxon.TaxonName;
			taxon.Path = parentTaxon.Path + ", " + taxon._id;
			return taxon.save();
		} else {
			
			return taxon
		}

	})
		.then(function(taxon) {

			var c_id = taxon._id; // Child ID
			var np_id = parentTaxon._id; // New parent ID
			var op_id = taxon.Parent._id; // Old parent ID

			
			var set_new_parent_sql = "CALL SET_NEW_PARENT( " + c_id + " , " + op_id + " , " + np_id + " )";

			
			return [taxon, parentTaxon, taxon.Parent, models.sequelize.query(set_new_parent_sql)];

		})
		.spread(function(taxon, newParent, oldParent) {
			
			return models.TaxonLog.create({
				eventname: "Changed parent taxon",
				description: taxon.FullName + " (id: "+taxon._id+") changed parent from "+oldParent.FullName+ " (id: "+oldParent._id+") to "+newParent.FullName+ " (id: "+newParent._id+")",
				user_id: req.user._id,
				taxon_id: taxon._id
				
			})
		})
		.then(function() {
			
			return Taxon.find({
				where: {
					_id: req.params.id
				},
				include: [{
					model: models.Taxon,
					as: "Parent"
				}]
			})
		})
		.then(function(taxon) {

			return res.status(201).json(taxon);
		})
		.
	catch (function(err) {
		console.log(JSON.stringify(err))
		return res.status(500).send(err);
	});
};



exports.showImages = function(req, res){
	models.TaxonImages.findAll({
		where: {
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(responseWithResult(res, 200))
		.
	catch (handleError(res));
	
}

// Creates a new taxon in the DB.
exports.addImage = function(req, res) {
	models.TaxonImages.create(req.body)
		.then(responseWithResult(res, 201))
	.catch (handleError(res));
};

// Deletes a taxon image from the DB.
exports.deleteImage = function(req, res) {
	models.TaxonImages.find({
		where: {
			_id: req.params.imgid,
			taxon_id: req.params.id
			
		}
	})
		.then(handleEntityNotFound(res))
		.then(removeEntity(res))
		.
	catch (handleError(res));
};

// Updates an existing taxon in the DB.
exports.updateImage = function(req, res) {
	if (req.body._id) {
		delete req.body._id;
	}
	console.log(JSON.stringify(req.params))
	models.TaxonImages.find({
		where: {
			_id: req.params.imgid,
			taxon_id: req.params.id
		}
	})
		.then(handleEntityNotFound(res))
		.then(saveUpdates(req.body))
		.then(responseWithResult(res))
		.
	catch (handleError(res));
};

exports.showTree = function(req, res) {


	var query = {
		where: {
			TaxonName: "Life"
		},
		attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
		include: [{
			model: models.Taxon,
			attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
			as: "children",
			include: [{
				model: models.Taxon,
				attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
				as: "children",
				include: [{
					model: models.Taxon,
					attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
					as: "children",
					include: [{
						model: models.Taxon,
						attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
						as: "children",
						include: [{
							model: models.Taxon,
							attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
							as: "children",
							include: [{
								model: models.Taxon,
								attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
								as: "children",
								include: [{
									model: models.Taxon,
									attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
									as: "children",
									include: [{
										model: models.Taxon,
										attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
										as: "children",
										include: [{
											model: models.Taxon,
											attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
											as: "children",
											include: [{
												model: models.Taxon,
												attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
												as: "children",
												include: [{
													model: models.Taxon,
													attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
													as: "children",
													include: [{
														model: models.Taxon,
														attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
														as: "children",
														include: [{
															model: models.Taxon,
															attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
															as: "children",
															include: [{
																model: models.Taxon,
																attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
																as: "children",
																include: [{
																	model: models.Taxon,
																	attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
																	as: "children",
																	include: [{
																		model: models.Taxon,
																		attributes: ['_id', 'parent_id', 'TaxonName', 'RankName'],
																		as: "children"
																	}]
																}]
															}]
														}]
													}]
												}]
											}]
										}]
									}]
								}]
							}]
						}]
					}]
				}]
			}]
		}]
	};

	Taxon.findOne(query)
		.then(responseWithResult(res))
		.
	catch (handleError(res));

};
