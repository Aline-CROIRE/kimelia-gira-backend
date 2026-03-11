const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    property: { type: mongoose.Schema.ObjectId, ref: 'Property', required: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'read', 'replied', 'closed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Inquiry', InquirySchema);