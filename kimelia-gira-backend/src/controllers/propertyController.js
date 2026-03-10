const Property = require('../models/Property');

// @desc    Create new property
// @route   POST /api/v1/properties
exports.createProperty = async (req, res) => {
    try {
        req.body.owner = req.user.id; // From 'protect' middleware
        
        // Handle images if uploaded
        if (req.files) {
            req.body.images = req.files.map(file => file.path);
        }

        const property = await Property.create(req.body);
        res.status(201).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all properties (with filtering)
// @route   GET /api/v1/properties
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email');
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};