const calculateValuation = require('../utils/valuationEngine');
const t = require('../utils/i18n');

// @desc    Get AI Property Valuation
// @route   POST /api/v1/valuation/estimate
exports.getEstimate = async (req, res) => {
    try {
        const { propertyType, size, bedrooms, bathrooms, locationFactor, condition, language } = req.body;

        // Validation
        if (!propertyType || !size || !locationFactor) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide propertyType, size, and locationFactor" 
            });
        }

        const estimation = calculateValuation({
            propertyType,
            size,
            bedrooms: bedrooms || 0,
            bathrooms: bathrooms || 0,
            locationFactor,
            condition: condition || 'good'
        });

        res.status(200).json({
            success: true,
            data: estimation,
            message: language === 'rw' ? "Igereranya ryakozwe neza" : 
                     language === 'fr' ? "Estimation réussie" : 
                     "Estimation successful"
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};