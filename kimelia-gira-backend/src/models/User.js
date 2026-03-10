const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // 'select: false' hides password in queries
    role: { 
        type: String, 
        enum: ['buyer', 'owner', 'renter', 'admin'], 
        default: 'buyer' 
    },
    language: { 
        type: String, 
        enum: ['en', 'rw', 'fr'], 
        default: 'en' 
    },
    profileImage: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);