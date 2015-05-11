'use strict';

var config = protractor.getInstance().params;
var UserModel = require(config.serverConfig.root + '/server/sqldb').User;

describe('Logout View', function() {
  var login = function(user) {
    browser.get('/login');
    require('../login/login.po').login(user);
  };

  var testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  };

  beforeEach(function(done) {
    UserModel.destroy()
      .then(function() {
        return UserModel.create(testUser);
      })
      .then(function() {
        return login(testUser);
      })
      .finally(done);
  });

  describe('with local auth', function() {

    it('should logout a user and redirecting to "/"', function() {
      var navbar = require('../../components/navbar/navbar.po');

      expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);

      browser.get('/logout');

      navbar = require('../../components/navbar/navbar.po');

      expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/');
      expect(navbar.navbarAccountGreeting.isDisplayed()).toBe(false);
    });

  });
});
