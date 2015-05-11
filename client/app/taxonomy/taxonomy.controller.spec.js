'use strict';

describe('Controller: TaxonomyCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var TaxonomyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxonomyCtrl = $controller('TaxonomyCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
