'use strict';

describe('Service: TaxonAttributes', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var Locality;
  beforeEach(inject(function (_Locality_) {
    Locality = _Locality_;
  }));

  it('should do something', function () {
    expect(!!Locality).toBe(true);
  });

});
