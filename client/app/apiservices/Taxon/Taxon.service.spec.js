'use strict';

describe('Service: Taxon', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var Taxon;
  beforeEach(inject(function (_Taxon_) {
    Taxon = _Taxon_;
  }));

  it('should do something', function () {
    expect(!!Taxon).toBe(true);
  });

});
