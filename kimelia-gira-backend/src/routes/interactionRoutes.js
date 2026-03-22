const express = require('express');
const { 
    toggleFavorite, 
    getFavorites, 
    sendInquiry, 
    getMyInquiries,
    replyInquiry,
    markAsRead,
    deleteInquiry,
    revokeMessage
} = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/inbox', getMyInquiries); 
router.get('/favorites', getFavorites);

router.post('/toggle/:propertyId', toggleFavorite);
router.post('/send/:propertyId', sendInquiry);
router.put('/reply/:id', replyInquiry);
router.put('/read/:id', markAsRead);

router.delete('/chat/:id', deleteInquiry);
router.delete('/chat/:id/message/:messageId', revokeMessage);

module.exports = router;