const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    title: {
        en: String, rw: String, fr: String
    },
    description: {
        en: String, rw: String, fr: String
    },
    type: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: { type: String, enum: ['apartment', 'house', 'land', 'commercial'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'RWF' },
    location: {
        address: String,
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: '2dsphere'
        }
    },
    features: {
        bedrooms: Number,
        bathrooms: Number,
        size: Number,
        hasParking: { type: Boolean, default: false }
    },
    images: [{ type: String }],
    status: { 
        type: String, 
        enum: ['pending', 'available', 'sold', 'rented', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);