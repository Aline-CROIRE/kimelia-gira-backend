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

router.route('/')
    .get(getProperties)
    .post(protect, upload.array('images', 5), createProperty);

router.route('/:id')
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

router.get('/radius/:lat/:lng/:distance', getPropertiesInRadius);

module.exports = router;