const express = require('express');
const { getEstimate } = require('../controllers/valuationController');
const router = express.Router();

/**
 * @swagger
 * /valuation/estimate:
 *   post:
 *     summary: Get an AI-powered property price estimate
 *     tags: [AI Valuation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - propertyType
 *               - size
 *               - locationFactor
 *             properties:
 *               propertyType:
 *                 type: string
 *                 enum: [house, apartment, land, commercial]
 *               size:
 *                 type: number
 *                 description: Size in square meters
 *               bedrooms:
 *                 type: number
 *               bathrooms:
 *                 type: number
 *               locationFactor:
 *                 type: number
 *                 description: "1.0 for normal, 2.0 for prime, 0.5 for rural"
 *               condition:
 *                 type: string
 *                 enum: [new, good, renovated, old]
 *               language:
 *                 type: string
 *                 enum: [en, rw, fr]
 *     responses:
 *       200:
 *         description: Valuation successful
 */
router.post('/estimate', getEstimate);

module.exports = router; 