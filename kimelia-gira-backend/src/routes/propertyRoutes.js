const express = require('express');
const { 
    createProperty, 
    getProperties, 
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
 *   description: Property listing management and search
 */

/**
 * @swagger
 * /properties:
 *   get:
 *     summary: Get all approved properties with advanced filtering
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: propertyType
 *         schema: { type: string, enum: [house, apartment, land, commercial] }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [sale, rent] }
 *       - in: query
 *         name: price[gte]
 *         schema: { type: number }
 *         description: "Minimum price (e.g. 1000000)"
 *   post:
 *     summary: Create a new property listing (AI Auto-translates content)
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
 *               title: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               type: { type: string, enum: [sale, rent] }
 *               propertyType: { type: string, enum: [house, apartment, land] }
 *               address: { type: string }
 *               lat: { type: number }
 *               lng: { type: number }
 *               images: { type: array, items: { type: string, format: binary } }
 */
router.route('/')
    .get(getProperties)
    .post(protect, upload.array('images', 5), createProperty);

/**
 * @swagger
 * /properties/{id}:
 *   put:
 *     summary: Update a property listing (Owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *   delete:
 *     summary: Delete a property listing (Owner only)
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.route('/:id')
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

/**
 * @swagger
 * /properties/radius/{lat}/{lng}/{distance}:
 *   get:
 *     summary: Find properties within a specific kilometer radius for Map view
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: lat
 *         required: true
 *       - in: path
 *         name: lng
 *         required: true
 *       - in: path
 *         name: distance
 *         description: "Distance in kilometers"
 *         required: true
 */
router.get('/radius/:lat/:lng/:distance', getPropertiesInRadius);

module.exports = router;