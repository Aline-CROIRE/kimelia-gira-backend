const express = require('express');
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /recommendations:
 *   get:
 *     summary: Get AI-powered property recommendations
 *     tags: [AI Recommendations]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', protect, getRecommendations);

module.exports = router;