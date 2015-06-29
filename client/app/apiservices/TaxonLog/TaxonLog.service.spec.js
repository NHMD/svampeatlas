'use strict';

describe('Service: TaxonLog', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var TaxonLog;
  beforeEach(inject(function (_TaxonLog_) {
    TaxonLog = _TaxonLog_;
  }));

  it('should do something', function () {
    expect(!!TaxonLog).toBe(true);
  });

});
