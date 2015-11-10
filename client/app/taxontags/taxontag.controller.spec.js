'use strict';

describe('Controller: TaxonLogCtrl', function () {

  // load the controller's module
  beforeEach(module('svampeatlasApp'));

  var TaxonLogCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TaxonLogCtrl = $controller('TaxonLogCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
