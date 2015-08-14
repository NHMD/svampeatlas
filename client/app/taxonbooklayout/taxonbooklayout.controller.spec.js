'use strict';

describe('Controller: TaxonBookLayoutCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var TaxonBookLayoutCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxonBookLayoutCtrl = $controller('TaxonBookLayoutCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
