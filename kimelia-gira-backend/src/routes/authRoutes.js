const express = require('express');
const { register, login, googleAuthSuccess } = require('../controllers/authController');
const { getMe, updateDetails } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');
const passport = require('passport');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login, and profile management
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [buyer, owner, renter, admin], default: buyer }
 *               language: { type: string, enum: [en, rw, fr], default: en }
 */
router.post('/register', register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               fcmToken: { type: string, description: "Firebase token for push notifications" }
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Login with Google OAuth2
 *     tags: [Authentication]
 */
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback (Internal use by Google)
router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleAuthSuccess
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/updatedetails:
 *   put:
 *     summary: Update user profile details or profile picture
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               language: { type: string, enum: [en, rw, fr] }
 *               profileImage: { type: string, format: binary }
 */
router.put('/updatedetails', protect, upload.single('profileImage'), updateDetails);

module.exports = router;