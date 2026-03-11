const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

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
            location: JSON.parse(location), // Location usually comes as a string in multipart/form-data
            images: req.files ? req.files.map(file => file.path) : []
        };

        const property = await Property.create(propertyData);

        res.status(201).json({ 
            success: true, 
            message: "Property listed with AI auto-translation!",
            data: property 
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};