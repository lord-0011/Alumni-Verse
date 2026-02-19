const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${(process.env.BACKEND_URL || 'http://localhost:5000').replace(/\/$/, '')}/api/auth/google/callback`,
      passReqToCallback: true, // Pass request to callback to access query params
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Extract role from state (passed during initial redirect)
        const role = req.query.state;

        if (!role) {
          return done(new Error('Role not specified'), null);
        }

        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - check if they're using Google auth
          if (user.authMethod !== 'google') {
            return done(
              new Error('This email is registered with traditional login. Please use email and password.'),
              null
            );
          }
          // Return existing user
          return done(null, user);
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            authMethod: 'google',
            role: role,
            profilePicture: profile.photos[0]?.value || '',
          });
          return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
