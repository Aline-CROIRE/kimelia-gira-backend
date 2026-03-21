const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.ObjectId, ref: 'Property', required: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    phone: { type: String, required: true }, // Added for better lead quality
    conversation: [{
        senderId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    status: { type: String, enum: ['pending', 'replied'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);