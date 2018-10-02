var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var auth = require('../auth.service');
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
	          return done(err);
	        });
		
	  }
	  
	 else {
		
    User.find({where: {
      'facebook': profile.id
    }})
      .then(function(user) {
        if (!user) {
			// Slet hvis nye brugere skal skabes direkte fra fb:
			 return done(null);
			 // Kommentér ind hvis nye brugere skal skabes direkte fra fb:
			 
			/*
          user = User.build({
            name: profile.displayName,
            email: profile.emails[0].value,
			Initialer: auth.generateInitials(profile.displayName),
            username: profile.username,
            provider: 'facebook',
            facebook: profile.id
          });
          user.save()
            .then(function(user) {
				req.user = user;
              return done(null, user);
            })
            .catch(function(err) {
				
				if(err.name === 'SequelizeUniqueConstraintError' && err.errors[0].message === 'Initialer must be unique') {
		           var user = User.build({
		              name: profile.displayName,
		              email: profile.emails[0].value,
		  			Initialer: auth.generateInitials(profile.displayName)+auth.getRandomTwoDigit(),
		              username: profile.username,
		              provider: 'facebook',
		              facebook: profile.id
		            });
		            user.save()
		              .then(function(user) {
		  				req.user = user;
		                return done(null, user);
		              })
		              .catch(function(err) {
		  				
		  				
		                return done(err);
		              });
				} else
              {
				  return done(err);
			  }
            });
			*/
        } else {
				req.user = user;
			
          return done(null, user);
        }
      })
      .catch(function(err) {
		 
        return done(err);
      });
  }
  }));
};
