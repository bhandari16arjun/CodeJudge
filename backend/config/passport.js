const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/users'); 
const bcrypt = require('bcryptjs');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Date.now().toString(), 10);
      user = new User({
        name: profile.displayName,
        email,
        role: 'user', 
        password: dummyPassword ,
        GlobalRank : 0,
        contestRating : -1000,
        codingTitle: 'Newbie',
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));