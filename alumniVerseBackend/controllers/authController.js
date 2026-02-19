const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Function to generate a JSON Web Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 */
const registerUser = async (req, res) => {
  const { name, email, password, role, collegeName, ...otherInfo } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      authMethod: 'traditional',
      collegeName,
      ...otherInfo,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 */
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is trying to use password login for a Google account
    if (user.authMethod === 'google') {
      return res.status(400).json({
        message: 'This account uses Google Sign-In. Please use "Sign in with Google" button.'
      });
    }

    if (user.role === role && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeName: user.collegeName,
        profilePicture: user.profilePicture,
        isOnboarded: user.isOnboarded,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or role mismatch' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Initiate Google OAuth
 * @route   GET /api/auth/google
 */
const googleAuth = (req, res, next) => {
  // Store role in session before redirecting to Google
  const { role } = req.query;

  if (!role || !['student', 'alumni'].includes(role)) {
    return res.status(400).json({ message: 'Valid role (student/alumni) is required' });
  }

  req.session.oauthRole = role;

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: role,
  })(req, res, next);
};

/**
 * @desc    Google OAuth callback
 * @route   GET /api/auth/google/callback
 */
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth Error:', err.message);
      // Redirect to frontend with error
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(err.message)}`);
    }

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Determine redirect based on onboarding status
    let redirectUrl;
    if (!user.isOnboarded) {
      // New user or user who hasn't completed onboarding → go to onboarding
      redirectUrl = `${process.env.FRONTEND_URL}/onboarding/${user.role}?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`;
    } else {
      // Existing user who completed onboarding → go to home
      redirectUrl = `${process.env.FRONTEND_URL}/auth/success?token=${token}&userId=${user._id}&name=${encodeURIComponent(user.name)}&role=${user.role}&email=${encodeURIComponent(user.email)}&isOnboarded=true`;
    }

    res.redirect(redirectUrl);
  })(req, res, next);
};

module.exports = { registerUser, loginUser, googleAuth, googleAuthCallback };
