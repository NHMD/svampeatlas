'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('checklist', {
		 title: 'Checkliste over danske svampe og laver - Danmarks Svampeatlas', 
		 ogDescription: 'Hvilke arter af svampe og laver findes i Danmark? Få svaret her. Se videnskabelige og danske navne samt synonymer og udbredelseskort.',
        url: '/checklist',
        templateUrl: 'app/dkchecklist/dkchecklist.html',
        controller: 'DkCheckListCtrl'
      });
  });