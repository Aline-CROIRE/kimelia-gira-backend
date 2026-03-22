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



// @desc    Mark conversation as read
// @route   PUT /api/v1/interactions/chat/read/:id
exports.markAsRead = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        if (!inquiry) return res.status(404).json({ success: false });

        // Set all messages not sent by the current user to isRead: true
        inquiry.conversation.forEach(msg => {
            if (msg.senderId.toString() !== req.user.id) {
                msg.isRead = true;
            }
        });

        await inquiry.save();
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};


exports.deleteMessage = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        const lastMsg = inquiry.conversation[inquiry.conversation.length - 1];

        // RULE: You can only revoke the LAST message if it's yours
        if (lastMsg._id.toString() !== req.params.messageId) {
            return res.status(400).json({ success: false, message: "Cannot revoke: Message has been followed by another." });
        }

        await Inquiry.findByIdAndUpdate(req.params.id, {
            $pull: { conversation: { _id: req.params.messageId } }
        });

        return res.status(200).json({ success: true });
    } catch (err) { return res.status(500).json({ success: false }); }
};






exports.getMyInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find({
            $and: [
                { $or: [{ sender: req.user.id }, { owner: req.user.id }] },
                { deletedBy: { $ne: req.user.id } } // Hide if user deleted it
            ]
        }).populate('property sender owner').sort('-updatedAt');
        res.status(200).json({ success: true, data: inquiries || [] });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.replyInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        inquiry.conversation.push({ senderId: req.user.id, text: req.body.text });
        inquiry.deletedBy = []; // Restore visibility for both on new message
        await inquiry.save();
        res.status(200).json({ success: true, data: inquiry });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.deleteInquiry = async (req, res) => {
    try {
        await Inquiry.findByIdAndUpdate(req.params.id, { $addToSet: { deletedBy: req.user.id } });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};

exports.revokeMessage = async (req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);
        const lastMsg = inquiry.conversation[inquiry.conversation.length - 1];
        if (lastMsg._id.toString() !== req.params.messageId) {
            return res.status(400).json({ success: false, message: "Too late to revoke" });
        }
        await Inquiry.findByIdAndUpdate(req.params.id, { $pull: { conversation: { _id: req.params.messageId } } });
        res.status(200).json({ success: true });
    } catch (err) { res.status(500).json({ success: false }); }
};