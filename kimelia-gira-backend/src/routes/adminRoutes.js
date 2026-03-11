const express = require('express');
const { 
    getStats, 
    getUsers, 
    updatePropertyStatus, 
    deleteUser 
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply protection to all routes in this file
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get platform statistics (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all registered users (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /admin/properties/{id}:
 *   put:
 *     summary: Update property status (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, sold, rented]
 */
router.put('/properties/:id', updatePropertyStatus);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin Only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.delete('/users/:id', deleteUser);

module.exports = router;