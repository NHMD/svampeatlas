'use strict';

describe('Controller: TaxonCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var TaxonomyCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxonCtrl = $controller('TaxonCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
