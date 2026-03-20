const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

// @desc    Create new property
// @route   POST /api/v1/properties
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, type, propertyType, address, lat, lng, bedrooms, bathrooms, size } = req.body;

        // AI Translation logic
        const translatedTitle = await autoTranslate(title);
        const translatedDescription = await autoTranslate(description);

        const propertyData = {
            owner: req.user._id,
            title: translatedTitle,
            description: translatedDescription,
            price: Number(price),
            type,
            propertyType,
            location: {
                address: address || "Kigali, Rwanda",
                type: 'Point',
                coordinates: [parseFloat(lng) || 30.0619, parseFloat(lat) || -1.9441]
            },
            features: {
                bedrooms: Number(bedrooms) || 0,
                bathrooms: Number(bathrooms) || 0,
                size: Number(size) || 0
            },
            images: req.files ? req.files.map(file => file.path) : [],
            status: 'available'
        };

        const property = await Property.create(propertyData);
        res.status(201).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all properties
// @route   GET /api/v1/properties
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email');
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single property (THIS FIXES THE 404)
// @route   GET /api/v1/properties/:id
exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid ID format" });
    }
};

// @desc    Update property
// @route   PUT /api/v1/properties/:id
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Not found" });

        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Not found" });

        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        await property.deleteOne();
        res.status(200).json({ success: true, message: "Property removed" });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Radius Search
exports.getPropertiesInRadius = async (req, res) => {
    const { lat, lng, distance } = req.params;
    const radius = distance / 6378;
    const properties = await Property.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({ success: true, count: properties.length, data: properties });
};