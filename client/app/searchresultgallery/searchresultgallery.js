'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('search-gallery', {
		  params: {
		      locality_id: null,
			  date: null,
			  taxon_id: null,
			  searchid : {value: null, squash: true}
		    },
        url: '/search/:searchid/result/gallery/:searchterm?',
        templateUrl: 'app/searchresultgallery/searchresultgallery.html',
        controller: 'SearchGalleryCtrl'
      });
  });