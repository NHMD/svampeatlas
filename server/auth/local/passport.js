var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function localAuthenticate(User, Initialer, password, done) {
  User.find({
    where: {
      Initialer: Initialer.toLowerCase()
    }
  })
    .then(function(user) {
      if (!user) {
        return done(null, false, {
          message: 'This Initialer is not registered.'
        });
      }
      user.authenticate(password, function(authError, authenticated) {
        if (authError) {
          return done(authError);
        }
        if (!authenticated) {
          return done(null, false, {
            message: 'This password is not correct.'
          });
        } else {
          return done(null, user);
        }
      });
    })
    .catch(function(err) {
      return done(err);
    });
}

exports.setup = function(User, config) {
  passport.use(new LocalStrategy({
    usernameField: 'Initialer',
    passwordField: 'password' // this is the virtual field on the model
  }, function(Initialer, password, done) {
    return localAuthenticate(User, Initialer, password, done);
  }));
};
