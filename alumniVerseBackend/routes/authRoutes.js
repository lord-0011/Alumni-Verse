const express = require('express');
const router = express.Router();

// 🔑 FIX: Ensure the import path is exactly correct. 
// We are explicitly including the '.js' extension to resolve module confusion.
const { registerUser, loginUser, googleAuth, googleAuthCallback } = require('../controllers/authController.js'); 

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth routes
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback);

module.exports = router;