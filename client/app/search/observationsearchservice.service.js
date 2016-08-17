'use strict';

angular.module('svampeatlasApp')
	.factory('ObservationSearchService', function(Taxon) {

		
		return {
			

			search : {
				include : [{
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
					where: {
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

				}]},
			
			uistate: {},
			
				
			
			getSearch: function() {
				return this.search ;
				
			},
			getUIstate: function() {
				return this.uistate ;
				
			},
			reset: function(){
				this.search = {
				include : [{
					model: "DeterminationView",
					as: "DeterminationView",
					attributes: ['Taxon_id', 'Recorded_as_id', 'Taxon_FullName', 'Taxon_vernacularname_dk', 'Taxon_RankID', 'Determination_validation', 'Taxon_redlist_status', 'Taxon_path', 'Recorded_as_FullName', 'Determination_user_id'],
					where: {
						Determination_validation: ['Godkendt', 'Valideres', 'Afventer', 'Gammelvali']
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

				}]};
				this.uistate = {};
				
			}
			
			}
		


	});

