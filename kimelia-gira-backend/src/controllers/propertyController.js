const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

// @desc    Create new property
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, type, propertyType, address, lat, lng } = req.body;
        const translatedTitle = await autoTranslate(title);
        const translatedDescription = await autoTranslate(description);

        const property = await Property.create({
            owner: req.user.id,
            title: translatedTitle,
            description: translatedDescription,
            price,
            type,
            propertyType,
            location: {
                address,
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            images: req.files ? req.files.map(file => file.path) : []
        });

        res.status(201).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all available properties (Public)
exports.getProperties = async (req, res) => {
    try {
        const properties = await Property.find({ status: 'available' }).populate('owner', 'name email');
        res.status(200).json({ success: true, count: properties.length, data: properties });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update property (Owner Only)
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Not found" });

        // Check ownership
        if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: "Not authorized" });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete property (Owner Only)
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

// @desc    Get properties in radius
exports.getPropertiesInRadius = async (req, res) => {
    const { lat, lng, distance } = req.params;
    const radius = distance / 6378; // Earth radius in km
    const properties = await Property.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
        status: 'available'
    });
    res.status(200).json({ success: true, count: properties.length, data: properties });
};