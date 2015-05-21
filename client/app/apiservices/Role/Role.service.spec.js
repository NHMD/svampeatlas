'use strict';

describe('Service: Role', function () {

  // load the service's module
  beforeEach(module('svampeatlasApp'));

  // instantiate service
  var Role;
  beforeEach(inject(function (_Role_) {
    Role = _Role_;
  }));

  it('should do something', function () {
    expect(!!Role).toBe(true);
  });

});
