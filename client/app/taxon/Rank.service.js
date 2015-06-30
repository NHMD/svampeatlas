'use strict';

angular.module('svampeatlasApp')
	.factory('RankService', function() {

		var ranks = [{
				"RankID": 0,
				"RankName": "life"
			}, {
				"RankID": 100,
				"RankName": "regn."
			}, {
				"RankID": 500,
				"RankName": "phyl."
			}, {
				"RankID": 1000,
				"RankName": "subphyl."
			}, {
				"RankID": 1500,
				"RankName": "class."
			}, {
				"RankID": 2000,
				"RankName": "subclass."
			}, {
				"RankID": 3000,
				"RankName": "ord."
			}, {
				"RankID": 4000,
				"RankName": "fam."
			}, {
				"RankID": 4500,
				"RankName": "supergenus",
				"flexible": true
			}, {
				"RankID": 5000,
				"RankName": "gen."
			}, {
				"RankID": 7500,
				"RankName": "superspecies",
				"flexible": true
			},

			{
				"RankID": 10000,
				"RankName": "sp."
			}, {
				"RankID": 11000,
				"RankName": "subsp."
			},

			{
				"RankID": 12000,
				"RankName": "var."
			}, {
				"RankID": 13000,
				"RankName": "f."
			}, {
				"RankID": 14000,
				"RankName": "f.sp."
			}
		];

		return {

			getLowerRanks: function(RankID) {

				return _.filter(ranks, function(n) {
					return n.RankID > RankID;
				});

			},

			getRank: function(RankID) {
				return _.find(ranks, function(n) {
					return n.RankID === RankID;
				})
			}

		};


	});
