const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    // Multi-language fields
    title: {
        en: { type: String, required: true },
        rw: { type: String, required: true },
        fr: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        rw: { type: String, required: true },
        fr: { type: String, required: true }
    },
    type: { type: String, enum: ['sale', 'rent'], required: true },
    propertyType: { type: String, enum: ['apartment', 'house', 'land', 'commercial'], required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'RWF' },
    location: {
        address: String,
        coordinates: { type: [Number], index: '2dsphere' } // [lng, lat] for Maps
    },
    features: {
        bedrooms: Number,
        bathrooms: Number,
        size: Number, // in square meters
        hasParking: { type: Boolean, default: false },
        hasGarden: { type: Boolean, default: false }
    },
    images: [{ type: String }], // Cloudinary URLs
    status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', PropertySchema);