'use strict';

describe('Service: TaxonRedListData', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var TaxonRedListData;
  beforeEach(inject(function (_TaxonRedListData_) {
    TaxonRedListData = _TaxonRedListData_;
  }));

  it('should do something', function () {
    expect(!!TaxonRedListData).toBe(true);
  });

});
