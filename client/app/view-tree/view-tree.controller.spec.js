'use strict';

describe('Controller: ViewTreeCtrl', function () {

  // load the controller's module
  beforeEach(module('specifyDataCleanerApp'));

  var ViewTreeCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewTreeCtrl = $controller('ViewTreeCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
