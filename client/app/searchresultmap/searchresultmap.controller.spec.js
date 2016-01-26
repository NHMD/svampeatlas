'use strict';

describe('Controller: SearchListCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var SearchListCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchListCtrl = $controller('SearchListCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
