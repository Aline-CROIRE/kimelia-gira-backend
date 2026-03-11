const express = require('express');
const { toggleFavorite, sendInquiry, getFavorites } = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All interaction routes require the user to be logged in

/**
 * @swagger
 * /interactions/favorites:
 *   get:
 *     summary: Get logged-in user's favorite properties
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/favorites', getFavorites);

/**
 * @swagger
 * /interactions/favorites/{propertyId}:
 *   post:
 *     summary: Toggle a property in favorites (Add/Remove)
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 */
router.post('/favorites/:propertyId', toggleFavorite);

/**
 * @swagger
 * /interactions/inquiry/{propertyId}:
 *   post:
 *     summary: Send a message to the property owner
 *     tags: [Interactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Hi, I am interested in viewing this house on Saturday."
 */
router.post('/inquiry/:propertyId', sendInquiry);

module.exports = router;