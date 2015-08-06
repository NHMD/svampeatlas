'use strict';

describe('Service: TaxonAttributes', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var TaxonAttributes;
  beforeEach(inject(function (_TaxonAttributes_) {
    TaxonAttributes = _TaxonAttributes_;
  }));

  it('should do something', function () {
    expect(!!TaxonAttributes).toBe(true);
  });

});
