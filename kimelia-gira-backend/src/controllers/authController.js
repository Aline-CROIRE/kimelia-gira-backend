const User = require('../models/User');
const jwt = require('jsonwebtoken');
const t = require('../utils/i18n');
const { sendEmail, getWelcomeContent } = require('../utils/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @desc    Register user
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, language, fcmToken } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: t('user_exists', language) });
        }
        const user = await User.create({ name, email, password, role, language, fcmToken });

        const emailContent = getWelcomeContent(user.name, user.language);
        await sendEmail({
            email: user.email,
            name: user.name,
            subject: emailContent.subject,
            html: `<h1>${emailContent.subject}</h1><p>${emailContent.body}</p>`,
            text: emailContent.body
        });

        res.status(201).json({
            success: true,
            message: t('reg_success', user.language),
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Login user
exports.login = async (req, res) => {
    try {
        const { email, password, fcmToken } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: t('auth_error', user?.language || 'en') });
        }
        if (fcmToken) { user.fcmToken = fcmToken; await user.save(); }

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: { id: user._id, name: user.name, email: user.email, role: user.role, language: user.language }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    OAuth Success Handler
exports.googleAuthSuccess = (req, res) => {
    // Generate token for the user found/created by passport
    const token = generateToken(req.user._id);
    
    // In production, you would redirect to your frontend with the token
    res.status(200).json({
        success: true,
        token,
        user: req.user
    });
};