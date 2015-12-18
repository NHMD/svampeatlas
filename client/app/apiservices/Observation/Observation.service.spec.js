'use strict';

describe('Service: Observation', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var Observation;
  beforeEach(inject(function (_Observation_) {
    Observation = _Observation_;
  }));

  it('should do something', function () {
    expect(!!Observation).toBe(true);
  });

});
