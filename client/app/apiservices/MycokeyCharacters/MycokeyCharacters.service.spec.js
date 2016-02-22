'use strict';

describe('Service: TaxonomyTags', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var TaxonomyTags;
  beforeEach(inject(function (_TaxonomyTags_) {
    TaxonomyTags = _TaxonomyTags_;
  }));

  it('should do something', function () {
    expect(!!TaxonomyTags).toBe(true);
  });

});
