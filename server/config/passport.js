const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/auth/User'); // Ensure your User model is correctly imported

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ where: { googleId: profile.id } });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value, // Google emails array
          googleId: profile.id,
          verified: true
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'emails'] // Request email and display name from Facebook
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const existingUser = await User.findOne({ where: { facebookId: profile.id } });

      if (existingUser) {
        return done(null, existingUser);
      } else {
        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails ? profile.emails[0].value : null, // Ensure email exists
          facebookId: profile.id,
          verified: true
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id); // Use user ID for session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id); // Retrieve user from DB using ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
