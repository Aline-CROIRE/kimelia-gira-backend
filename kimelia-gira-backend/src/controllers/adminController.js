const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get dashboard statistics
// @route   GET /api/v1/admin/stats
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const propertiesByStatus = await Property.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProperties,
                propertiesByStatus
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().sort('-createdAt');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Update property status (Approve/Reject)
// @route   PUT /api/v1/admin/properties/:id
exports.updatePropertyStatus = async (req, res) => {
    try {
        const { status } = req.body; // e.g., 'sold', 'available'
        
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        property = await Property.findByIdAndUpdate(req.params.id, { status }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: property });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/v1/admin/users/:id
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};