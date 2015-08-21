var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function(User, config) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
	passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
	  
  
	  if(req.user){
	  	
	      User.update({ facebook : profile.id}, {where: {
	        '_id': req.user._id
	      }})
			.then(function(user) {
				
                return done(null, user);
              })
             
	        .catch(function(err) {
				console.log(err)
	          return done(err);
	        });
		
	  }
	  
	 else {
    User.find({where: {
      'facebook': profile.id
    }})
      .then(function(user) {
        if (!user) {
			
          user = User.build({
            name: profile.displayName,
            email: profile.emails[0].value,
  
            username: profile.username,
            provider: 'facebook',
            facebook: profile.id
          });
          user.save()
            .then(function(user) {
              return done(null, user);
            })
            .catch(function(err) {
              return done(err);
            });
        } else {
          return done(null, user);
        }
      })
      .catch(function(err) {
        return done(err);
      });
  }
  }));
};
