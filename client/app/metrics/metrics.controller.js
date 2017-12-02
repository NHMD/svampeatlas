'use strict';

angular.module('svampeatlasApp')
	.controller('MetricsCtrl', function($rootScope, $stateParams, MorphoGroup, $translate, Auth, User, DeterminationVote, $q, $mdMedia, Observation) {

		var that = this;


		this.$translate = $translate;
		this.$mdMedia = $mdMedia;
		var chartWidth = $mdMedia('gt-xs') ? 400 : 300

		that.timeAgo = 52;
		that.votesTimeAgo = 26;


		that.voteChartOpts = {
			options: {
				
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'column',
					height: 300,
					width: chartWidth,
				},
				plotOptions: {
					column: {
						stacking: 'normal',
						dataLabels: {
							enabled: false
						}
					}
				}
			},

			title: {
				text: $translate.instant('Stemmer pr uge')
			},
			xAxis: {
				title: {
					text: $translate.instant('Uge')
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: $translate.instant('Stemmer')
				},
				stackLabels: {
					enabled: false,
					style: {
						fontWeight: 'bold',
						color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
					}
				}
			},
			legend: {
				align: 'right',
				x: -30,
				verticalAlign: 'top',
				y: 25,
				floating: true,
				backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
				borderColor: '#CCC',
				borderWidth: 1,
				shadow: false
			},
			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			}


		};


		var communityApproved = DeterminationVote.getCount({
			timeIntervalType: 'YEARWEEK',
			timeAgo: that.votesTimeAgo,
			communityApproved: true,
			cached: true
		});
		var expertApproved = DeterminationVote.getCount({
			timeIntervalType: 'YEARWEEK',
			timeAgo: that.votesTimeAgo,
			expertApproved: true,
			cached: true
		});
		var notApproved = DeterminationVote.getCount({
			timeIntervalType: 'YEARWEEK',
			timeAgo: that.votesTimeAgo,
			notApproved: true,
			cached: true
		});


		$q.all([communityApproved.$promise, expertApproved.$promise, notApproved.$promise]).then(function(values) {
			var weekMap = {};
			var weeks;
			var communityApprovedWeekMap = {};
			var expertApprovedWeekMap = {}
			var notApprovedWeekMap = {}
			for (var i = 0; i < values[0].length; i++) {
				weekMap[values[0][i].YEARWEEK] = true;
				communityApprovedWeekMap[values[0][i].YEARWEEK] = values[0][i].votecount;
			}
			for (var i = 0; i < values[1].length; i++) {
				weekMap[values[1][i].YEARWEEK] = true;
				expertApprovedWeekMap[values[1][i].YEARWEEK] = values[1][i].votecount;
			}
			for (var i = 0; i < values[2].length; i++) {
				weekMap[values[2][i].YEARWEEK] = true;
				notApprovedWeekMap[values[2][i].YEARWEEK] = values[2][i].votecount;
			}
			weeks = Object.keys(weekMap);

			that.voteChartOpts.xAxis.categories = _.map(weeks, function(w) {
				return w.toString().substring(0, 4) + " " + $translate.instant('uge') + " " + w.toString().substring(4, 6);
			});


			that.voteChartOpts.series = [{
				name: $translate.instant("På observationer som ikke er blevet godkendt"),
				data: _.map(weeks, function(w) {
					return notApprovedWeekMap[w] || 0;
				})
			}, {
				name: $translate.instant("På observationer som er blevet ekspert-godkendt"),
				data: _.map(weeks, function(w) {
					return expertApprovedWeekMap[w] || 0;
				})
			}, {
				name: $translate.instant("På observationer som er blevet godkendt"),
				data: _.map(weeks, function(w) {
					return communityApprovedWeekMap[w] || 0;
				})
			}]




		});

		that.observationChartOpts = {
			
			options: {
				credits: {
				    enabled: false
				  },
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'line',
					height: 300,
					width: chartWidth,
				},
				title: {
					text: $translate.instant("Fund pr uge")
				},

				xAxis: {
					type: 'category',
					labels: {
						style: {
							fontSize: '13px',
							fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
						}
					},
					title: {
						text: $translate.instant('Uge')
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: $translate.instant('Antal fund')
					}
				},
				legend: {
					align: 'right',
					x: 0,
					verticalAlign: 'top',
					y: 25,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
					borderColor: '#CCC',
					borderWidth: 1,
					shadow: false
				},
			}

		}


		$q.all([Observation.getCount({
				group: 'YEARWEEK',
				timeAgo: that.timeAgo,
				cached: true,
				communityApproved: true
			}).$promise, Observation.getCount({
				group: 'YEARWEEK',
				timeAgo: that.timeAgo,
				cached: true
			}).$promise])
			.then(function(values) {
				var weekMap = {};
				var weeks;
				var communityApprovedWeekMap = {};
				var totalWeekMap = {}

				for (var i = 0; i < values[0].length; i++) {
					weekMap[values[0][i].YEARWEEK] = true;
					communityApprovedWeekMap[values[0][i].YEARWEEK] = values[0][i].count;
				}
				for (var i = 0; i < values[1].length; i++) {
					weekMap[values[1][i].YEARWEEK] = true;
					totalWeekMap[values[1][i].YEARWEEK] = values[1][i].count;
				}

				weeks = Object.keys(weekMap);

				that.observationChartOpts.options.xAxis.categories = _.map(weeks, function(w) {
					return w.toString().substring(0, 4) + " " + $translate.instant('uge') + " " + w.toString().substring(4, 6);
				});


				that.observationChartOpts.series = [{
					name: $translate.instant("Antal fund pr uge"),
					data: _.map(weeks, function(w) {
						return totalWeekMap[w] || 0;
					})
				}, {
					name: $translate.instant("Antal brugervaliderede fund pr uge"),
					data: _.map(weeks, function(w) {
						return communityApprovedWeekMap[w] || 0;
					})
				}]

			})


		/*	Observation.getCount({group: 'YEARWEEK', timeAgo: that.timeAgo, cached: true}).$promise.then(function(data){
				that.observationChartOpts.series = [{
					name: $translate.instant("Antal fund pr uge"),
					data: _.map(data, function(w){
						return [w.YEARWEEK.toString().substring(0,4)+" "+$translate.instant('uge')+" "+w.YEARWEEK.toString().substring(4,6), w.count]
					})
				}];
				
			}) */

		that.speciesChartOpts = {
			credits: {
			    enabled: false
			  },
			options: {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'line',
					height: 300,
					width: chartWidth,
				},
				title: {
					text: $translate.instant("Arter fundet pr uge")
				},

				xAxis: {
					type: 'category',
					labels: {
						style: {
							fontSize: '13px',
							fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
						}
					},
					title: {
						text: $translate.instant('Uge')
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: $translate.instant('num_species')
					}
				},
				legend: {
					align: 'right',
					x: 0,
					verticalAlign: 'top',
					y: 25,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
					borderColor: '#CCC',
					borderWidth: 1,
					shadow: false
				},
			}

		}
		$q.all([Observation.getSpeciesCount({
				timeIntervalType: 'YEARWEEK',
				timeAgo: that.timeAgo,
				communityApproved: true,
				cached: true
			}).$promise, Observation.getSpeciesCount({
				timeIntervalType: 'YEARWEEK',
				timeAgo: that.timeAgo,
				limit: that.timeAgo,
				cached: true
			}).$promise])
			.then(function(values) {
				var weekMap = {};
				var weeks;
				var communityApprovedWeekMap = {};
				var totalWeekMap = {}

				for (var i = 0; i < values[0].length; i++) {
					weekMap[values[0][i].YEARWEEK] = true;
					communityApprovedWeekMap[values[0][i].YEARWEEK] = values[0][i].speciescount;
				}
				for (var i = 0; i < values[1].length; i++) {
					weekMap[values[1][i].YEARWEEK] = true;
					totalWeekMap[values[1][i].YEARWEEK] = values[1][i].speciescount;
				}

				weeks = Object.keys(weekMap);

				that.speciesChartOpts.options.xAxis.categories = _.map(weeks, function(w) {
					return w.toString().substring(0, 4) + " " + $translate.instant('uge') + " " + w.toString().substring(4, 6);
				});


				that.speciesChartOpts.series = [{
					name: $translate.instant("num_species"),
					data: _.map(weeks, function(w) {
						return totalWeekMap[w] || 0;
					})
				}, {
					name: $translate.instant("Antal brugervaliderede arter"),
					data: _.map(weeks, function(w) {
						return communityApprovedWeekMap[w] || 0;
					})
				}]


				/*	that.speciesChartOpts.series = [{
						name: "Antal brugervaliderede arter",
						data: _.map(values[0], function(w){
							return [w.YEARWEEK.toString().substring(0,4)+" "+$translate.instant('uge')+" "+w.YEARWEEK.toString().substring(4,6), w.speciescount]
						})
					}, {
						name: "Antal  arter",
						data: _.map(values[1], function(w){
							return [w.YEARWEEK.toString().substring(0,4)+" "+$translate.instant('uge')+" "+w.YEARWEEK.toString().substring(4,6), w.speciescount]
						})
					}]; */
			})



		that.userChartOpts = {
			credits: {
			    enabled: false
			  },
			options: {
				chart: {
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false,
					type: 'line',
					height: 300,
					width: chartWidth,
				},
				title: {
					text: $translate.instant("Aktive brugere pr uge")
				},

				xAxis: {
					type: 'category',
					labels: {
						style: {
							fontSize: '13px',
							fontFamily: 'Roboto, "Helvetica Neue", sans-serif'
						}
					},
					title: {
						text: $translate.instant('Uge')
					}
				},
				yAxis: {
					min: 0,
					title: {
						text: $translate.instant('Antal brugere')
					}
				},

				legend: {
					align: 'right',
					x: 0,
					verticalAlign: 'top',
					y: 25,
					floating: true,
					backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
					borderColor: '#CCC',
					borderWidth: 1,
					shadow: false
				},
			}

		}

		$q.all([Observation.getUserCount({
				timeIntervalType: 'YEARWEEK',
				timeAgo: that.timeAgo,
				cached: true
			}).$promise, DeterminationVote.getCount({
				timeIntervalType: 'YEARWEEK',
				timeAgo: that.timeAgo,
				cached: true
			}).$promise])
			.then(function(values) {

				var weekMap = {};
				var weeks;
				var users = {};
				var voters = {}

				for (var i = 0; i < values[0].length; i++) {
					weekMap[values[0][i].YEARWEEK] = true;
					users[values[0][i].YEARWEEK] = values[0][i].usercount;
				}
				for (var i = 0; i < values[1].length; i++) {
					weekMap[values[1][i].YEARWEEK] = true;
					voters[values[1][i].YEARWEEK] = values[1][i].usercount;
				}

				weeks = Object.keys(weekMap);

				that.userChartOpts.options.xAxis.categories = _.map(weeks, function(w) {
					return w.toString().substring(0, 4) + " " + $translate.instant('uge') + " " + w.toString().substring(4, 6);
				});


				that.userChartOpts.series = [{
					name: $translate.instant("Aktive rapportører"),
					data: _.map(weeks, function(w) {
						return users[w] || 0;
					})
				}, {
					name: $translate.instant("Aktive i validering"),
					data: _.map(weeks, function(w) {
						return voters[w] || 0;
					})
				}]



			})


		//----------------------------------------------------------------------------------------

		that.speciesByYearChartOpts = {
				options: {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						type: 'spline',
						height: 300,
						width: chartWidth,
					},
					title: {
						text: $translate.instant("Arter fundet pr uge")
					},

					xAxis: {
						type: 'datetime',
						dateTimeLabelFormats: { // don't display the dummy year
							month: '%e. %b',
							year: '%b'
						},
						title: {
							text: 'Date'
						}
					},
					yAxis: {
						min: 0,
						title: {
							text: $translate.instant('num_species')
						}
					},
					legend: {
						align: 'right',
						x: 0,
						verticalAlign: 'top',
						y: 25,
						floating: true,
						backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
						borderColor: '#CCC',
						borderWidth: 1,
						shadow: false
					},
					tooltip: {
						headerFormat: '<b>{series.name}</b><br>',
						pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
					},
				}

			}
			/*
			$q.all([Observation.getSpeciesCount({timeIntervalType: 'YEARWEEK', timeAgo: that.timeAgo, limit: that.timeAgo, cached: true}).$promise, Observation.getSpeciesCount({timeIntervalType: 'YEARWEEK', timeAgo: that.timeAgo*2, limit: that.timeAgo, cached: true}).$promise, Observation.getSpeciesCount({timeIntervalType: 'YEARWEEK', timeAgo: that.timeAgo*3, limit: that.timeAgo, cached: true}).$promise, Observation.getSpeciesCount({timeIntervalType: 'YEARWEEK', timeAgo: that.timeAgo*4, limit: that.timeAgo, cached: true}).$promise, Observation.getSpeciesCount({timeIntervalType: 'YEARWEEK', timeAgo: that.timeAgo*5, limit: that.timeAgo, cached: true}).$promise])
			.then(function(values){
				
				var weekMap = {};
				var weeks;
				
				var year1Week = {};
				var year2Week = {};
				var year3Week = {};
				var year4Week = {};
				var year5Week = {};
				for(var i=0; i < values[0].length; i++){
					if(values[0][i].YEARWEEK){
						var year = (values[0][i].YEARWEEK.toString().substring(0,4) < values[0][values.length].YEARWEEK.toString().substring(0,4)) ? 1970 : 1971;
						//var date = moment().day("Monday").year(year).week(values[0][i].YEARWEEK.toString().substring(4,6)).valueOf();
						var date = moment(year).add(values[0][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek').utc().valueOf();
						weekMap[date] = true;
						year1Week[date] = values[0][i].speciescount;
						console.log(moment(year).add(values[0][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek'))
				}
				}
				
				for(var i=0; i < values[1].length; i++){
					if(values[1][i].YEARWEEK){
						var year = (values[1][i].YEARWEEK.toString().substring(0,4) < values[1][values.length].YEARWEEK.toString().substring(0,4)) ? 1970 : 1971;
						console.log(year)
						//var date = moment().day("Monday").year(year).week(values[1][i].YEARWEEK.toString().substring(4,6)).valueOf();
						var date = moment(year).add(values[1][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek').utc().valueOf();
						
					console.log(moment(year).add(values[1][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek'))
						weekMap[date] = true;
						year2Week[date] = values[1][i].speciescount;	
				}
				}
				for(var i=0; i < values[2].length; i++){
					if(values[2][i].YEARWEEK){
						
						var year = (values[2][i].YEARWEEK.toString().substring(0,4) < values[2][values.length].YEARWEEK.toString().substring(0,4)) ? 1970 : 1971;
						console.log(year)
					
					//	var date = moment().day("Monday").year(year).week(values[2][i].YEARWEEK.toString().substring(4,6)).valueOf();
					var date = moment(year).add(values[2][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek').utc().valueOf();
					weekMap[date] = true;
					year3Week[date] = values[2][i].speciescount;
				}
				} 
				for(var i=0; i < values[3].length; i++){
					if(values[3][i].YEARWEEK){
						var year = (values[3][i].YEARWEEK.toString().substring(0,4) < values[3][values.length].YEARWEEK.toString().substring(0,4)) ? 1970 : 1971;
						console.log(year)
						
						//var date = moment().day("Monday").year(year).week(values[3][i].YEARWEEK.toString().substring(4,6)).valueOf();
						var date = moment(year).add(values[3][i].YEARWEEK.toString().substring(4,6), 'weeks').startOf('isoweek').utc().valueOf();
						console.log(new Date(date))
						weekMap[date] = true;
						year4Week[date] = values[3][i].speciescount;	
				}
				}
				
				weeks = Object.keys(weekMap);
			
				//that.speciesByYearChartOpts.options.xAxis.categories = weeks;
			
				that.speciesByYearChartOpts.series = [
					   {name: $translate.instant("num_species")+" " +$translate.instant("i år"),
					data:  _.map(weeks, function(w){
					return [new Date(w), year1Week[w] || 0];
				})}, {name: $translate.instant("num_species")+" " +$translate.instant("sidste år"),
					data:  _.map(weeks, function(w){
					return [new Date(w), year2Week[w] || 0];
				})}, {name: $translate.instant("num_species")+" " +$translate.instant("2 år"),
					data:  _.map(weeks, function(w){
					return [new Date(w), year3Week[w] || 0];
				})}, {name: $translate.instant("num_species")+" " +$translate.instant("3 år"),
					data:  _.map(new Date(weeks), function(w){
					return [w, year4Week[w] || 0];
				})}]
			

	
	
	
	
}) */

	})
