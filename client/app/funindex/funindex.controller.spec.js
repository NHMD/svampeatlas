'use strict';

describe('Controller: FunindexCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var FunindexCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FunindexCtrl = $controller('FunindexCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
