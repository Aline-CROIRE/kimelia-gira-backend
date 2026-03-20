const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

// @desc    Create new property
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, type, propertyType, address, lat, lng, bedrooms, bathrooms, size } = req.body;

        const translatedTitle = await autoTranslate(title);
        const translatedDescription = await autoTranslate(description);

        const propertyData = {
            owner: req.user.id,
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

// @desc    Update property
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ success: false, message: "Asset not found" });
        }

        // Authorization Check
        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        const updateData = { ...req.body };

        // Defensive Mapping for Features (Fixes your "undefined" error)
        if (req.body.bedrooms || req.body.bathrooms || req.body.size) {
            updateData.features = {
                bedrooms: Number(req.body.bedrooms) !== undefined ? Number(req.body.bedrooms) : (property.features?.bedrooms || 0),
                bathrooms: Number(req.body.bathrooms) !== undefined ? Number(req.body.bathrooms) : (property.features?.bathrooms || 0),
                size: Number(req.body.size) !== undefined ? Number(req.body.size) : (property.features?.size || 0),
            };
        }

        // AI re-translation if text changed
        if (req.body.title && req.body.title !== property.title.en) {
            updateData.title = await autoTranslate(req.body.title);
        }
        if (req.body.description && req.body.description !== property.description.en) {
            updateData.description = await autoTranslate(req.body.description);
        }

        property = await Property.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(400).json({ success: false, message: "Server Error: " + err.message });
    }
};

// @desc    Get all properties
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email');
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get single property
exports.getProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('owner', 'name email');
        if (!property) return res.status(404).json({ success: false, message: "Not found" });
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: "Invalid ID format" });
    }
};

// @desc    Delete property
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
        location: { $geoWithin: { $centerSphere: [[parseFloat(lng), parseFloat(lat)], radius] } }
    });
    res.status(200).json({ success: true, count: properties.length, data: properties });
};