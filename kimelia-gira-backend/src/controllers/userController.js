const User = require('../models/User');

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};

// @desc    Update user profile (Name, Language, Profile Image)
// @route   PUT /api/v1/auth/updatedetails
exports.updateDetails = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            language: req.body.language
        };

        // If a new profile image is uploaded via Cloudinary
        if (req.file) {
            fieldsToUpdate.profileImage = req.file.path;
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};