const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');
const { sendEmail } = require('../utils/emailService');

// @desc    Toggle Favorite Property (Add/Remove)
// @route   POST /api/v1/interactions/favorites/:propertyId
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const propertyId = req.params.propertyId;

        // Check if already in favorites
        const isFavorited = user.favorites.includes(propertyId);

        if (isFavorited) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
        } else {
            // Add to favorites
            user.favorites.push(propertyId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: isFavorited ? "Removed from favorites" : "Added to favorites",
            favorites: user.favorites
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Send an Inquiry to Property Owner
// @route   POST /api/v1/interactions/inquiry/:propertyId
exports.sendInquiry = async (req, res) => {
    try {
        const { message } = req.body;
        const property = await Property.findById(req.params.propertyId).populate('owner');

        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        // Prevent owner from inquiring about their own property
        if (property.owner._id.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot inquire about your own property" });
        }

        // Create the inquiry
        const inquiry = await Inquiry.create({
            property: property._id,
            sender: req.user.id,
            owner: property.owner._id,
            message
        });

        // Send Email Notification to the Owner
        // We use the owner's preferred language for the email subject
        const subjects = {
            en: "New Inquiry for your property!",
            rw: "Ubutumwa bushya ku mutungo wawe!",
            fr: "Nouvelle demande pour votre propriété !"
        };
        const emailSubject = subjects[property.owner.language || 'en'];

        await sendEmail({
            email: property.owner.email,
            name: property.owner.name,
            subject: emailSubject,
            text: `You have a new inquiry from ${req.user.name}:\n\n"${message}"\n\nLogin to Kimelia Gira to reply.`,
            html: `<h3>Hello ${property.owner.name},</h3>
                   <p>You have a new inquiry regarding <strong>${property.title[property.owner.language || 'en']}</strong>.</p>
                   <p><strong>Message from ${req.user.name}:</strong></p>
                   <blockquote style="border-left: 4px solid #1F3A93; padding-left: 10px;">${message}</blockquote>
                   <p>Login to your dashboard to reply.</p>`
        });

        res.status(201).json({ success: true, data: inquiry, message: "Inquiry sent successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get user's favorites
// @route   GET /api/v1/interactions/favorites
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        res.status(200).json({ success: true, count: user.favorites.length, data: user.favorites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};