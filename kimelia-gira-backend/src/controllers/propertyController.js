const Property = require('../models/Property');
const autoTranslate = require('../utils/translator');

// @desc    Create new property
// @route   POST /api/v1/properties
exports.createProperty = async (req, res) => {
    try {
        const { title, description, price, type, propertyType, location } = req.body;

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
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all properties (With advanced search & filtering)
// @route   GET /api/v1/properties
exports.getProperties = async (req, res) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude from direct matching
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc) for price filtering
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Property.find(JSON.parse(queryStr)).populate('owner', 'name email');

        // Select Fields (e.g., ?select=title,price)
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // Executing query
        const properties = await query;

        res.status(200).json({ 
            success: true, 
            count: properties.length, 
            pagination: { page, limit },
            data: properties 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};