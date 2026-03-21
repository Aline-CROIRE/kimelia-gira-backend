const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { 
        type: String, 
        enum: ['buyer', 'owner', 'renter', 'admin', 'broker'], 
        default: 'buyer' 
    },
    language: { type: String, enum: ['en', 'rw', 'fr'], default: 'en' },
    profileImage: { type: String, default: '' },
    // CRITICAL: Ensure this defaults to an empty array
    favorites: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Property',
        default: []
    }],
    createdAt: { type: Date, default: Date.now }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);