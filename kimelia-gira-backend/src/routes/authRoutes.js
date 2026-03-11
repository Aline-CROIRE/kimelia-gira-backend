const express = require('express');
const { register, login, googleAuthSuccess } = require('../controllers/authController');
const { getMe, updateDetails } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const passport = require('passport');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleAuthSuccess
);

// Profile Management (Protected)
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, upload.single('profileImage'), updateDetails);

module.exports = router;