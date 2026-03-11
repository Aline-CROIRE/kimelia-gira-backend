const express = require('express');
const router = express.Router();
const { createProperty, getProperties } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property (AI Auto-translates Title & Description)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: 
 *                 type: string
 *               description: 
 *                 type: string
 *               price: { type: number }
 *               type: { type: string, enum: [sale, rent] }
 *               propertyType: { type: string, enum: [house, apartment, land] }
 *               location: 
 *                 type: string
 *               images: { type: array, items: { type: string, format: binary } }
 */
router.post('/', protect, upload.array('images', 5), createProperty);

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Properties]
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get('/', getProperties);

module.exports = router;