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

router.get('/chat/list/all', getMyInquiries); 
router.get('/favs/all', getFavorites);

router.post('/favs/toggle/:propertyId', toggleFavorite);
router.post('/chat/submit/:propertyId', sendInquiry);
router.put('/chat/add-message/:id', replyInquiry);

module.exports = router;