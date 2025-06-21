const url = require('url');
const {UserGroup} = require('../models/auth/UserGroup'); 
const {User} = require('../models/auth/User');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback',
    passReqToCallback: true 
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      const group = req.query.group ;
      let groupId = 0;
      if (group == 'patient'){
        groupId = 1
      }
      else if(group == 'doctor'){
        groupId = 2
      }

      let user = await User.findOne({ where: { email: profile.emails[0].value } });

      if (user) {
        return done(null, user);
      } else {
        // Create new user with group
        const newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          isVerified: true,
        });
        await UserGroup.create({
          user_id: newUser.id,
          group_id: groupId
        })
        return done(null, newUser);
      }
    } catch (err) {
      console.error(err);
      return done(err, null);
    }
  }
));

