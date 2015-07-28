'use strict';

describe('Service: TaxonRank', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var TaxonRank;
  beforeEach(inject(function (_TaxonRank_) {
    TaxonRank = _TaxonRank_;
  }));

  it('should do something', function () {
    expect(!!TaxonRank).toBe(true);
  });

});
