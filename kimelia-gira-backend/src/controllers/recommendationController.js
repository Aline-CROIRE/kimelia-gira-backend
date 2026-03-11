const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get AI-based property recommendations for the user
// @route   GET /api/v1/recommendations
exports.getRecommendations = async (req, res) => {
    try {
        // 1. Get user with their favorites
        const user = await User.findById(req.user.id).populate('favorites');

        // 2. If user has no favorites, return the latest 5 properties as a fallback
        if (!user.favorites || user.favorites.length === 0) {
            const fallbackProperties = await Property.find().sort('-createdAt').limit(5);
            return res.status(200).json({
                success: true,
                message: "No favorites found. Showing latest properties instead.",
                data: fallbackProperties
            });
        }

        // 3. Extract preferences from favorites
        const favoriteIds = user.favorites.map(fav => fav._id);
        const types = user.favorites.map(fav => fav.propertyType);
        const prices = user.favorites.map(fav => fav.price);

        // Find most frequent property type
        const mostCommonType = types.sort((a, b) =>
            types.filter(v => v === a).length - types.filter(v => v === b).length
        ).pop();

        // Calculate average price
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
        const priceMin = avgPrice * 0.7; // 30% below avg
        const priceMax = avgPrice * 1.3; // 30% above avg

        // 4. Query for similar properties
        // Conditions: Same type, similar price range, NOT already in favorites
        const recommendations = await Property.find({
            _id: { $nin: favoriteIds }, // Don't recommend what they already liked
            propertyType: mostCommonType,
            price: { $gte: priceMin, $lte: priceMax },
            status: 'available'
        }).limit(6);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            message: `Recommendations based on your interest in ${mostCommonType}s`,
            data: recommendations
        });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};