'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var SearchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SearchCtrl = $controller('TaxonomyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
