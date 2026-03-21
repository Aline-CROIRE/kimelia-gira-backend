const express = require('express');
const { 
    toggleFavorite, 
    getFavorites, 
    sendInquiry, 
    getMyInquiries,
    replyInquiry 
} = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

// --- 1. UNIQUE LIST PATHS (MUST BE AT TOP) ---
router.get('/chat/list/all', getMyInquiries); 
router.get('/favs/all', getFavorites);

// --- 2. DYNAMIC ID PATHS ---
router.post('/favs/toggle/:propertyId', toggleFavorite);
router.post('/chat/submit/:propertyId', sendInquiry);
router.put('/chat/reply/:id', replyInquiry);

module.exports = router;