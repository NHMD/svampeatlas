'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationSearchService', function(Taxon, $filter, Auth, $rootScope, $stateParams, appConstants) {

		$rootScope.$on('$stateChangeStart', function(event, next, nextParams, prev, prevParams) {


			if (prev.name.indexOf('search') < 0 || $stateParams.searchterm || ($stateParams.locality_id && $stateParams.date) || $stateParams.taxon_id) {
				delete instance.storedSearch;
			}
			//	$rootScope.ogDescription = next.ogDescription;
			//	$rootScope.ogUrl = next.url;

		});


		var instance = {


			search: {
				include: [{
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id', 'Determination_score', 'Determination_validator_id'],
					where: {

						// $and: $or is reserved for searches across communityvalidated and hardvalidated determinations
						$and: {
							$or: {}
						}
					}
				}, {
					model: "User",
					as: 'PrimaryUser',
					//	attributes: ['email', 'Initialer', 'name'],
					required: false,
					where: {}
				}, {
					model: "Locality",
					as: 'Locality',
					attributes: ['_id', 'name'],
					where: {},
					required: true
				}, {
					model: "GeoNames",
					as: 'GeoNames',
					where: {},
					required: false
				}, {
					model: "ObservationUser",
					as: 'userIds',
					where: {},
					required: false
				}, {
					model: "ObservationImage",
					as: 'Images',
					where: {}
				}, {
					model: "ObservationForum",
					as: 'Forum',
					where: {}

				}, {
					model: "ObservationArea",
					as: 'areaIds',
					where: {},
					required: false
				}, {
					model: "Determination",
					as: 'Determinations',
					where: {},
					attributes: ["_id", "score"],
					required: false
				}]
			},

			uistate: {
				selectedHigherTaxa: [],
				selectedLocalities: [],
				associatedOrganism: [],
				collectors: [],
				determiner: [],
				PrimaryUser: [],
				selectedMonths: [],
				Determination_score: [],
				Determination_validation: [],
				utm10: []
			},
			strategies: ['mycorrhizal', 'lichenized', 'parasite', 'saprobe', 'on_lichens', 'on_wood'],

			getSearch: function() {
				return this.search;

			},
			setSearch: function(search) {
				this.search = search;

			},
			getUIstate: function() {
				return this.uistate;

			},
			reset: function() {
				this.search = this.getNewSearch();
				this.uistate = {
					selectedHigherTaxa: [],
					selectedLocalities: [],
					associatedOrganism: [],
					collectors: [],
					determiner: [],
					PrimaryUser: [],
					selectedMonths: [],
					Determination_score: [],
					Determination_validation: [],
					utm10: []

				}

			},
			getNewSearch: function() {
				return {
					include: [{
						model: "DeterminationView",
						as: "DeterminationView",
						attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id', 'Determination_score', 'Determination_validator_id'],
						where: {
							$and: {
								$or: {}
							}
						}
					}, {
						model: "User",
						as: 'PrimaryUser',
						//	attributes: ['email', 'Initialer', 'name'],
						required: false,
						where: {}
					}, {
						model: "Locality",
						as: 'Locality',
						attributes: ['_id', 'name'],
						where: {},
						required: true
					}, {
						model: "GeoNames",
						as: 'GeoNames',
						where: {},
						required: false
					}, {
						model: "ObservationUser",
						as: 'userIds',
						where: {},
						required: false
					}, {
						model: "ObservationImage",
						as: 'Images',
						where: {},
						required: false
					}, {
						model: "ObservationForum",
						as: 'Forum',
						where: {},
						required: false

					}, {
						model: "ObservationArea",
						as: 'areaIds',
						where: {},
						required: false
					}, {
					model: "Determination",
					as: 'Determinations',
					where: {},
					attributes: ["_id", "score"],
					required: false
				}]
				}
			},
			convertSearchDateStrings: function(search) {

				if (search.fromDate && (!search.dateInterVals || !search.dateInterVals.fromDate)) {
					search.fromDate = new Date(search.fromDate)
				}
				if (search.toDate) {
					search.toDate = new Date(search.toDate)
				}
				if (search.addedFromDate && (!search.dateInterVals || !search.dateInterVals.addedFromDate)) {
					search.addedFromDate = new Date(search.addedFromDate)
				}
				if (search.addedToDate) {
					search.addedToDate = new Date(search.addedToDate)
				}
				if (search.forumMaxAge && (!search.dateInterVals || !search.dateInterVals.forumMaxAge)) {
					search.forumMaxAge = new Date(search.forumMaxAge)
				}
				if (search.imageMaxAge && (!search.dateInterVals || !search.dateInterVals.imageMaxAge)) {
					search.imageMaxAge = new Date(search.imageMaxAge)
				}

				// if we have date intervals like 'last three days' set that according to current date
				var that = this;
				_.each(search.dateInterVals, function(v, k) {
					that.setDate(v, k, search)
				})


			},
			setDate: function(days, model, search) {
				if (!search.dateInterVals) {
					search.dateInterVals = {}
				};
				search[model] = moment().startOf('day').subtract(days, 'days').toDate();
				search.dateInterVals[model] = days;
			},

			uiSearchToDBquery: function(search, dbQuery) {
				var that = this;

				var useLichenFilter = Boolean(localStorage.getItem('use_lichen_filter'));

				if (useLichenFilter) {
					search.livsstrategi = "lichenized";
				}

				if (search.livsstrategi) {

					_.each(that.strategies, function(n) {
						delete search.include[0].where[n]
					})

					switch (search.livsstrategi) {
						case "mycorrhizal":
							search.include[0].where.mycorrhizal = 1;
							break;
						case "lichenized":
							search.include[0].where.lichenized = 1;
							break;
						case "not_lichenized":
							search.include[0].where.lichenized = 0;
							break;
						case "parasite_on_lichens":
							search.include[0].where.parasite = 1;
							search.include[0].where.on_lichens = 1;
							break;
						case "saprobe_on_wood":
							search.include[0].where.saprobe = 1;
							search.include[0].where.on_wood = 1;
							break;


					}

				}

				if (search.selectedVegetationType && search.selectedVegetationType.length > 0) {
					dbQuery.where.vegetationtype_id = {
						$in: search.selectedVegetationType
					};
				} else {
					delete dbQuery.where.vegetationtype_id;
				}

				if (search.selectedSubstrate && search.selectedSubstrate.length > 0) {
					dbQuery.where.substrate_id = {
						$in: search.selectedSubstrate
					};
				} else {
					delete dbQuery.where.substrate_id;
				}

				if (search.selectedDataSet && search.selectedDataSet.length > 0) {
					dbQuery.where.dataSource = {
						$in: search.selectedDataSet
					};
					dbQuery.include[2].required = false;

				} else {
					delete dbQuery.where.dataSource;
				}






				if (search.onlyForeign) {
					search.include[2].required = false;
					dbQuery.where.locality_id = {
						$eq: null
					};
				} else {
					delete dbQuery.where.locality_id;
					search.include[2].required = (search.geometry || (search.selectedDataSet && search.selectedDataSet.length) || search.databasenumber) ? false : !search.includeForeign;
				}



				if (search.selectedHigherTaxa.length > 0) {
					search.include[0].where.$or = _.map(search.selectedHigherTaxa, function(tx) {

						// its a taxon resource
						if (tx.Path && tx._id) {
							var path = (!tx.acceptedTaxon) ? tx.Path : tx.acceptedTaxon.Path;
							return {
								Taxon_path: {
									like: path + "%"
								}
							}
						} else {
							return {
								$or: [{
									Taxon_vernacularname_dk: {
										like: "%" + tx + "%"
									}
								}, {
									Taxon_FullName: {
										like: tx + "%"
									}
								}]

							};
						}


					})
				} else {
					delete search.include[0].where.$or;
				}


				if (search.selectedLocalities.length > 0) {
					search.include[2].where.$or = _.map(search.selectedLocalities, function(loc) {
						return (loc.name && loc._id) ? {
							_id: loc._id
						} : {
							name: {
								like: loc + "%"
							}
						}
					})
				} else {
					delete search.include[2].where.$or;
				}

				/*
				if (search.PrimaryUser.length > 0) {
					dbQuery.where.primaryuser_id = { $in: _.map(search.PrimaryUser, function(u){ return u._id})} 
				} else {
					delete dbQuery.where.primaryuser_id;
				
				}
				*/

				if (search.PrimaryUser.length > 0) {

					search.include[1].where = {
						_id: {
							$in: _.map(search.PrimaryUser, function(u) {
								return u._id
							})
						} //search.PrimaryUser[0]._id
					}
					search.include[1].required = true;

				} else {

					search.include[1].where = {}
					search.include[1].required = false;
				}


				if (search.collectors.length > 0) {
					if (search.collectors[0]._id !== undefined) {
						search.include[4].where = {
							user_id: {
								$in: _.map(search.collectors, function(u) {
									return u._id
								})
							} //search.collectors[0]._id
						}

						search.include[4].required = true;
					} else {
						dbQuery.where.verbatimLeg = {
							like: search.collectors[0] + "%"
						}
					}

				} else {
					search.include[4].where = {};
					search.include[4].required = false;
					delete dbQuery.where.verbatimLeg;
				}


				if (search.determiner.length > 0) {

					search.include[0].where.Determination_user_id = {
							$in: _.map(search.determiner, function(u) {
								return u._id
							})
						} //search.determiner[0]._id


				} else {
					delete search.include[0].where.Determination_user_id;

				}




				/*
				if (search.include[0].where.Taxon_redlist_status === "ALL") {
					search.include[0].where.Taxon_redlist_status = ['RE', 'CR', 'EN', 'VU', 'NT']
				}
				*/
				// clean empty strings from where clauses
				for (var i = 0; i < search.include.length; i++) {
					_.each(search.include[i].where, function(val, key) {
						if (val === "") {
							delete search.include[i].where[key];
						}
					})
				}




				dbQuery.include = search.include;


				dbQuery.include[0].where.$and.$or = [];

				if (search.Determination_score && search.Determination_score.length > 0) {
					//	var $or = [];

					for (var i = 0; i < search.Determination_score.length; i++) {
						var ds = search.Determination_score[i];

						switch (ds) {
							case 'VALIDATION_STATUS_COMMUNITY_LEVEL_3':
								dbQuery.include[0].where.$and.$or.push({
										Determination_score: {
											$gte: appConstants.AcceptedDeterminationScore
										},
										Determination_validation: {$notIn: ['Afvist', 'Godkendt']}
									})
									dbQuery.include[0].where.$and.$or.push({
										Determination_validation: "Godkendt",
										Determination_validator_id: {
											$eq: null
										}
									})
									// $or.push({$gte: appConstants.AcceptedDeterminationScore});
								break;
							case 'VALIDATION_STATUS_COMMUNITY_LEVEL_2':
								dbQuery.include[0].where.$and.$or.push({
										Determination_score: {
											$between: [appConstants.ProbableDeterminationScore, appConstants.AcceptedDeterminationScore -1]
										},
										Determination_validation: {$notIn: ['Afvist', 'Godkendt']}
									})
									//  $or.push( {$between: [appConstants.ProbableDeterminationScore, appConstants.AcceptedDeterminationScore]});
								break;
							case 'VALIDATION_STATUS_COMMUNITY_LEVEL_1':
								dbQuery.include[0].where.$and.$or.push({
										Determination_score: {
											$lt: appConstants.ProbableDeterminationScore
										},
										Determination_validation: {$notIn: ['Afvist', 'Godkendt']}
									})
									//  $or.push({$lt: appConstants.ProbableDeterminationScore});
								break;

							case 'VALIDATION_STATUS_EXPERT':
								dbQuery.include[0].where.$and.$or.push({
										Determination_validation: "Godkendt",
										Determination_validator_id: {
											$ne: null
										}
									})
									//  $or.push({$lt: appConstants.ProbableDeterminationScore});
								break;



						}
					}

					//	dbQuery.include[0].where.$and.$or.Determination_score = {$or: $or}


				}

				if (search.Determination_validation && search.Determination_validation.length > 0) {
					dbQuery.include[0].where.$and.$or.push({
						Determination_validation: search.Determination_validation
					})
				}

				if (search.associatedOrganism.length > 0) {
					dbQuery.where.primaryassociatedorganism_id = {
						$in: _.map(search.associatedOrganism, function(org) {
							return org._id
						})
					}


				} else {
					delete dbQuery.where.primaryassociatedorganism_id;
				}

				if (search.forumMaxAge !== undefined) {
					search.onlyWithForum = true;
					var formattedDate = $filter('date')(search.forumMaxAge, "yyyy-MM-dd", '+0200');
					dbQuery.include[6].where.createdAt = {
						$gte: formattedDate
					}


				} else {
					delete dbQuery.include[6].where.createdAt;
				}

				if (search.forumComment) {
					dbQuery.include[6].where.content = {
						like: "%" + search.forumComment + "%"
					}
					search.onlyWithForum = true;
				} else {
					delete dbQuery.include[6].where.content;
				}



				if (search.onlyWithForum) {
					dbQuery.include[6].required = true;
				} else {
					dbQuery.include[6].required = false;
				}

				if (search.imageMaxAge !== undefined) {
					search.onlyWithImages = true;
					var formattedDate = $filter('date')(search.imageMaxAge, "yyyy-MM-dd", '+0200');
					dbQuery.include[5].where.createdAt = {
						$gte: formattedDate
					}


				} else {
					delete dbQuery.include[5].where.createdAt;
				}

				if (search.onlyWithImages) {
					dbQuery.include[5].required = true;
				} else {
					dbQuery.include[5].required = false;
				}

				if (search.onlyMyObservations) {
					dbQuery.where.primaryuser_id = Auth.getCurrentUser()._id
				}

				if (search.notMyObservations) {
					dbQuery.where.primaryuser_id = {
						$ne: Auth.getCurrentUser()._id
					}
				}
				if (!search.onlyMyObservations && !search.notMyObservations) {
					delete dbQuery.where.primaryuser_id;
				}

				if (search.databasenumber) {
					// split if its a commaseperated list
					var dbnrArr = search.databasenumber.split(",");

					for (var i = 0; i < dbnrArr.length; i++) {
						// clean prefix
						var splitted = dbnrArr[i].split("-");
						var dbnr = (splitted.length > 0) ? splitted[splitted.length - 1] : search.databasenumber;
						dbnrArr[i] = dbnr;
					}


					dbQuery.where._id = dbnrArr;
					dbQuery.include[2].required = false;
					delete dbQuery.include[0].where.Determination_validation;

				} else {
					delete dbQuery.where._id;
					dbQuery.include[0].where.Determination_validation = search.include[0].where.Determination_validation;
				}





				if (search.fieldnumber) {
					dbQuery.where.fieldnumber = {
						$like: "%" + search.fieldnumber + "%"
					};
				} else {
					delete dbQuery.where.fieldnumber;
				}
				if (search.fromDate && search.toDate) {
					dbQuery.where.observationDate = {

						$between: [$filter('date')(search.fromDate, "yyyy-MM-dd", '+0200'), $filter('date')(search.toDate, "yyyy-MM-dd", '+0200')]
					}
				} else if (search.fromDate) {
					var formattedDate = $filter('date')(search.fromDate, "yyyy-MM-dd", '+0200');
					dbQuery.where.observationDate = (search.exactDate) ? formattedDate : {
						$gte: formattedDate

					};

				} else if (search.toDate) {
					dbQuery.where.observationDate = {
						$lte: $filter('date')(search.toDate, "yyyy-MM-dd", '+0200')
					}
				}

				if (search.addedFromDate && search.addedToDate) {
					dbQuery.where.createdAt = {

						$between: [$filter('date')(search.addedFromDate, "yyyy-MM-dd", '+0200'), $filter('date')(search.addedToDate, "yyyy-MM-dd", '+0200')]
					}
				} else if (search.addedFromDate) {
					var formattedDate = $filter('date')(search.addedFromDate, "yyyy-MM-dd", '+0200');
					dbQuery.where.createdAt = (search.addedExactDate) ? formattedDate : {
						$gte: formattedDate

					};

				} else if (search.addedToDate) {
					dbQuery.where.createdAt = {
						$lte: $filter('date')(search.addedToDate, "yyyy-MM-dd", '+0200')
					}
				}


				if (search.geometry) {
					dbQuery.geometry = search.geometry;
				} else {
					delete dbQuery.geometry;
				}

				if (search.utm10.length > 0) {
					dbQuery.include[7].where.area_id = _.map(search.utm10, function(u) {
						return u._id
					})
				}


				if (search.include[7].where.area_id) {
					dbQuery.include[7].required = true;
				} else {
					dbQuery.include[7].required = false;
				}
				/*
														if (search.municipalityid) {
															dbQuery.municipalityid = search.municipalityid;
														} else {
															delete dbQuery.municipalityid;
														}
														*/
				if (search.activeThreadsOnly) {
					dbQuery.activeThreadsOnly = search.activeThreadsOnly;
				} else {
					delete dbQuery.activeThreadsOnly;
				}

				if (search.selectedMonths.length > 0) {
					dbQuery.selectedMonths = search.selectedMonths;
				} else {
					delete dbQuery.selectedMonths
				}

				if (search.minAccuracy && search.maxAccuracy) {
					dbQuery.where.accuracy = {

						$between: [search.minAccuracy, search.maxAccuracy]
					}
				} else if (search.minAccuracy) {

					dbQuery.where.accuracy = {
						$gte: search.minAccuracy

					};

				} else if (search.maxAccuracy) {
					dbQuery.where.accuracy = {
						$lte: search.maxAccuracy
					}
				}

			}

		};


		return instance;


	});
