'use strict';

describe('Service: RedListEditions', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var NatureTypes;
  beforeEach(inject(function (_NatureTypes_) {
    NatureTypes = _NatureTypes_;
  }));

  it('should do something', function () {
    expect(!!NatureTypes).toBe(true);
  });

});
