const express = require('express');
const { createProperty, getProperties } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

const router = express.Router();

/**
 * @swagger
 * /properties:
 *   post:
 *     summary: Create a new property
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
 *               "title[en]": { type: string }
 *               "title[rw]": { type: string }
 *               "title[fr]": { type: string }
 *               "description[en]": { type: string }
 *               "description[rw]": { type: string }
 *               "description[fr]": { type: string }
 *               price: { type: number }
 *               type: { type: string, enum: [sale, rent] }
 *               propertyType: { type: string, enum: [apartment, house, land] }
 *               images: { type: array, items: { type: string, format: binary } }
 *     responses:
 *       201:
 *         description: Property created
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