var passport = require('passport'),
FacebookStrategy = require('passport-facebook').Strategy
//Other strategies go here
;

var verifyHandler = function(token, tokenSecret, profile, done) {
process.nextTick(function() {

User.findOne({uid: profile.id}, function(err, user) {
  if (user) {
    return done(null, user);
  } else {

    var data = {
      provider: profile.provider,
      uid: profile.id,
      name: profile.displayName
    };

    if (profile.emails && profile.emails[0] && profile.emails[0].value) {
      data.email = profile.emails[0].value;
    }
    if (profile.name && profile.name.givenName) {
      data.firstname = profile.name.givenName;
    }
    if (profile.name && profile.name.familyName) {
      data.lastname = profile.name.familyName;
    }

    User.create(data, function(err, user) {
      return done(err, user);
    });
  }
});
});
};

passport.serializeUser(function(user, done) {
done(null, user.uid);
});

passport.deserializeUser(function(uid, done) {
User.findOne({uid: uid}, function(err, user) {
done(err, user);
});
});

module.exports.http = {

customMiddleware: function(app) {

    passport.use(new FacebookStrategy({
    clientID: "124564038305566", // Use your Facebook App Id
    clientSecret: "faafdf0285688ec7c72dc1536f5503b1", // Use your Facebook App Secret
    callbackURL: "http://localhost:1337/auth/facebook/callback"
    }, verifyHandler));

    app.use(passport.initialize());
        app.use(passport.session());
}
};