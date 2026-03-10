const User = require('../models/User');
const jwt = require('jsonwebtoken');
const t = require('../utils/i18n');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, language } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: t('user_exists', language) });
        }

        const user = await User.create({ name, email, password, role, language });

        res.status(201).json({
            success: true,
            message: t('reg_success', user.language),
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: t('auth_error', user?.language || 'en') });
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};