const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists in our DB
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        }

        // If not, create a new user
        user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: Math.random().toString(36).slice(-10), // Random password for OAuth users
            profileImage: profile.photos[0].value,
            isVerified: true,
            language: 'en' // Default language
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
  }
));

module.exports = passport;