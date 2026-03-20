const express = require('express');
const { 
    createProperty, 
    getProperties, 
    getProperty, 
    updateProperty, 
    deleteProperty, 
    getPropertiesInRadius 
} = require('../controllers/propertyController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Properties
 *   description: Property management and discovery engine
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all properties with advanced filtering
 *     tags: [Properties]
 *   post:
 *     summary: Create a new property listing (AI Optimized)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.route('/')
    .get(getProperties)
    .post(protect, upload.array('images', 5), createProperty);

/**
 * @swagger
 * /properties/radius/{lat}/{lng}/{distance}:
 *   get:
 *     summary: Find properties within a specific radius
 *     tags: [Properties]
 */
router.get('/radius/:lat/:lng/:distance', getPropertiesInRadius);

/**
 * @swagger
 * /properties/{id}:
 *   get:
 *     summary: Get full details of a specific property
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *   put:
 *     summary: Update a listing (Owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Permanent delete (Owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 */
router.route('/:id')
    .get(getProperty) // This handles the Detail Page request
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;