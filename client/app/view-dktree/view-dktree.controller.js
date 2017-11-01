'use strict'

angular.module('svampeatlasApp')
	.controller('ViewDKTreeCtrl', ['Auth', 'User', '$http', '$stateParams', '$state', '$cacheFactory', '$scope', '$filter', '$timeout', '$document', '$mdToast', "$translate", "ErrorHandlingService",
		function(Auth, User, $http, $stateParams, $state, $cacheFactory, $scope, $filter, $timeout, $document, $mdToast, $translate, ErrorHandlingService) {
			var that = this;
			that.Auth = Auth;
			function buildTree(result){
				var treeMap = {}
				
				
				for (var i = 0; i < result.length; i++) {
					treeMap[result[i]._id] = result[i];

					if (result[i].RankID > 0) {
						if(!treeMap[result[i].parent_id]){
							console.log("##### Error on: ");
							console.log(result[i]);
						}
						if (treeMap[result[i].parent_id].children) {
							treeMap[result[i].parent_id].children.push(result[i])
						} else {
							treeMap[result[i].parent_id].children = [result[i]]
						}
					}
					
					
				}
				return treeMap[result[0]._id].children.sort(function(a, b) {
					return a.count < b.count
				});
				
			}
		

			
			that.resetFilter = function(){
				delete that.filter;
			}
			that.generateTree = function(){
				delete that.treeData;
				that.loadingFromserver = true;
				that.statusmsg = $translate.instant("Bygger")+" "+$translate.instant("klassifikation") +" ...";
				$http.post("/api/taxa/tree/danishtaxa", {cachekey : "taxontreedk", action: "generateDkTree"})
				.then(function(res) {
					
					that.treeData = buildTree(res.data);
					that.treeData[0].selected = true;
					//that.cache.put("tree", JSON.stringify(that.treeData));
					that.loadingFromserver = false;
					delete that.statusmsg;
				})
				.catch(function(err){
					that.loadingFromserver = false;
					delete that.statusmsg;
					ErrorHandlingService.handle500();
					
					
				})
				
			}

			
			that.loadingFromserver = true;
			that.statusmsg = $translate.instant("Bygger")+" "+$translate.instant("klassifikation") +" ...";
				
				$timeout(function(){
					$http.get("/api/taxa/tree/danishtaxa?cachekey=taxontreedk").then(function(res) {
						
						that.treeData = buildTree(res.data);
						that.treeData[0].selected = true;
						//that.cache.put("tree", JSON.stringify(that.treeData));
						that.loadingFromserver = false;
						delete that.statusmsg;
					})
					.catch(function(err){
						that.loadingFromserver = false;
						delete that.statusmsg;
						ErrorHandlingService.handle500();
					
					
					})
				}, 250)

				




		}
	])
	.config(function(ivhTreeviewOptionsProvider) {
		ivhTreeviewOptionsProvider.set({

			twistieCollapsedTpl: '<ng-md-icon icon="chevron_right"></ng-md-icon>',
			twistieExpandedTpl: '<ng-md-icon icon="expand_more"></ng-md-icon>',
			twistieLeafTpl: '<span style="cursor: default;">&#8192;&#8192;</span>'
		});
	})
	.directive('mdBox', function(ivhTreeviewMgr, $http, $timeout) {
		return {
			restrict: 'AE',
			require: "^ivhTreeview",
			template: [
				'<span class="ascii-box">',
				'<span ng-show="!trvw.isExpanded(node) && node.count > 0  && !node.loading" ><ng-md-icon class="folder-icon" style="min-height: 100%; line-height: 0" icon="folder"></ng-md-icon></span>',
				'<span ng-show="trvw.isExpanded(node) && node.count > 0  && !node.loading" ><ng-md-icon class="folder-icon" style="min-height: 100%; line-height: 0" icon="folder_open"></ng-md-icon></span>',

				'</span>',
			].join(''),
			link: function(scope, element, attrs, ivhTreeview) {

				element.on('click', function() {
				//	ivhTreeviewMgr.select(ivhTreeview.root(), scope.node, !scope.node.selected);

					if (scope.node.count > 0 && !scope.node.childrenAtSpeciesLevelLoaded) {


						scope.node.loading = true;


							$http.get("/api/taxa/tree/danishtaxa?root="+scope.node._id).then(function(res) {
								
								if(!scope.node.children || scope.node.children.length ===0){
									scope.node.children = res.data
								} else {
									scope.node.children = scope.node.children.concat(_.filter(res.data, function(d){
										return d.RankID > 9999;
									}))
								}
									scope.node.loading = false;
									scope.node.childrenAtSpeciesLevelLoaded = true;
									$timeout(function(){$("#resetTaxonTreeFilter").trigger('click');})
									ivhTreeviewMgr.expand(ivhTreeview.root(), scope.node, !scope.node.isExpanded)
								
							}) 
					} 
					scope.$apply();
				});

			}
		};
	})
	.directive('spLink', function(ivhTreeviewMgr, $http, SpeciesModalService) {
		return {
			restrict: 'AE',

			template: '<a><em>{{node.FullName}}</em> <strong>{{node.vernacularname_dk | capitalize}}</strong> <span ng-if="node.count > 0">({{node.count}})</span</a>',
				
			link: function(scope, element, attrs) {

				element.on('click', function(ev) {
				//	ivhTreeviewMgr.select(ivhTreeview.root(), scope.node, !scope.node.selected);

					SpeciesModalService.show(ev, scope.node._id)
				});

			}
		};
	});
