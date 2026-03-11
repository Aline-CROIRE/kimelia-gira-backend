const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

// @desc    Create new property
// @route   POST /api/v1/properties
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, type, propertyType, location } = req.body;

        // AI Magic: Auto-translate the title and description
        const translatedTitle = await autoTranslate(title);
        const translatedDescription = await autoTranslate(description);

        const propertyData = {
            owner: req.user.id,
            title: translatedTitle,
            description: translatedDescription,
            price,
            type,
            propertyType,
            location: location ? JSON.parse(location) : {}, 
            images: req.files ? req.files.map(file => file.path) : []
        };

        const property = await Property.create(propertyData);

        res.status(201).json({ 
            success: true, 
            message: "Property listed with AI auto-translation!",
            data: property 
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all properties
// @route   GET /api/v1/properties
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email');
        res.status(200).json({ 
            success: true, 
            count: properties.length, 
            data: properties 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};