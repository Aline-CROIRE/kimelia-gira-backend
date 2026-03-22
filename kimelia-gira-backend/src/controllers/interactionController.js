const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const propertyId = req.params.propertyId;
        if (!user.favorites) user.favorites = [];
        const isFav = user.favorites.includes(propertyId);
        if (isFav) {
            await User.findByIdAndUpdate(req.user.id, { $pull: { favorites: propertyId } });
        } else {
            await User.findByIdAndUpdate(req.user.id, { $addToSet: { favorites: propertyId } });
        }
        return res.status(200).json({ success: true, isFavorite: !isFav });
    } catch (err) { return res.status(500).json({ success: false }); }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');
        return res.status(200).json({ success: true, data: user.favorites || [] });
    } catch (err) { return res.status(500).json({ success: false }); }
};

exports.sendInquiry = async (req, res) => {
    try {
        const { message, phone } = req.body;
        const property = await Property.findById(req.params.propertyId);
        if (!property) return res.status(404).json({ success: false });

        const inquiry = await Inquiry.create({
            property: property._id,
            sender: req.user.id,
            owner: property.owner,
            phone,
            conversation: [{ senderId: req.user.id, text: message }],
            status: 'pending'
        });
        return res.status(201).json({ success: true, data: inquiry });
    } catch (err) { return res.status(500).json({ success: false }); }
};

exports.getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({ $or: [{ sender: req.user.id }, { owner: req.user.id }] })
            .populate('property', 'title price images')
            .populate('sender', 'name email')
            .populate('owner', 'name email')
            .sort('-updatedAt');
        return res.status(200).json({ success: true, data: inquiries || [] });
    } catch (err) { return res.status(500).json({ success: false }); }
};

exports.replyInquiry = async (req, res) => {
    try {
        const { text } = req.body;
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ success: false, message: "Chat not found" });

        inquiry.conversation.push({
            senderId: req.user.id,
            text: text
        });

        if (req.user.id === inquiry.owner.toString()) {
            inquiry.status = 'replied';
        }

        await inquiry.save();
        
        const updated = await Inquiry.findById(inquiry._id)
            .populate('property sender owner');

        return res.status(200).json({ success: true, data: updated });
    } catch (err) {
        return res.status(500).json({ success: false });
    }
};