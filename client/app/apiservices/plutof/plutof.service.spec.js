'use strict';

describe('Service: indexfungorum', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var indexfungorum;
  beforeEach(inject(function (_indexfungorum_) {
    indexfungorum = _indexfungorum_;
  }));

  it('should do something', function () {
    expect(!!indexfungorum).toBe(true);
  });

});
