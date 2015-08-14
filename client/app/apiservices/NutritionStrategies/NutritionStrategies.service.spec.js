'use strict';

describe('Service: NutritionStrategies', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var NutritionStrategies;
  beforeEach(inject(function (_NutritionStrategies_) {
    NutritionStrategies = _NutritionStrategies_;
  }));

  it('should do something', function () {
    expect(!!NutritionStrategies).toBe(true);
  });

});
