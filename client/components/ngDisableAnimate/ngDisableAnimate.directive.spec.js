'use strict';

describe('Directive: ngDisableAnimate', function () {

  // load the directive's module
  beforeEach(module('svampeatlasApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-disable-animate></ng-disable-animate>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngDisableAnimate directive');
  }));
});