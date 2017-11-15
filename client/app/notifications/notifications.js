'use strict';

angular.module('svampeatlasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('notifications', {
		  title: 'Notifikationer', 
        url: '/notifications',
        templateUrl: 'app/notifications/notifications.html',
        controller: 'NotificationCtrl'
      });
  });