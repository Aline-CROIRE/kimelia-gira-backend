const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.ObjectId, ref: 'Property', required: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true },
    conversation: [{
        senderId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        text: String,
        isRead: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    // NEW: Array of user IDs who have hidden this chat
    deletedBy: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);