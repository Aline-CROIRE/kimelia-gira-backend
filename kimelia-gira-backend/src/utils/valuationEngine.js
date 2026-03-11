/**
 * Kimelia Gira AI Valuation Engine
 * This engine calculates property value based on weighted factors.
 */

const calculateValuation = (data) => {
    const { propertyType, size, bedrooms, bathrooms, locationFactor, condition } = data;

    // 1. Base price per square meter (Default for Kigali/Urban area: ~$600/sqm)
    let basePricePerSqm = 600000; // In RWF

    // 2. Adjust base price by Property Type
    const typeMultipliers = {
        house: 1.2,
        apartment: 1.1,
        land: 0.8,
        commercial: 1.5
    };
    let multiplier = typeMultipliers[propertyType] || 1.0;

    // 3. Location Multiplier (1.0 = standard, 2.0 = prime/city center, 0.5 = rural)
    multiplier *= locationFactor;

    // 4. Calculate initial price
    let estimatedPrice = size * basePricePerSqm * multiplier;

    // 5. Add value for rooms
    estimatedPrice += (bedrooms * 2000000); // Add 2M RWF per bedroom
    estimatedPrice += (bathrooms * 1000000); // Add 1M RWF per bathroom

    // 6. Adjust for condition
    const conditionMultipliers = {
        new: 1.2,
        good: 1.0,
        renovated: 1.1,
        old: 0.7
    };
    estimatedPrice *= (conditionMultipliers[condition] || 1.0);

    // 7. Add a random "Market Variance" (Simulating AI fluctuation)
    const variance = (Math.random() * (1.05 - 0.95) + 0.95);
    estimatedPrice = Math.round(estimatedPrice * variance);

    // Return the breakdown
    return {
        estimatedPrice,
        currency: "RWF",
        lowEstimate: Math.round(estimatedPrice * 0.9),
        highEstimate: Math.round(estimatedPrice * 1.1),
        confidenceScore: 85 // Percentage
    };
};

module.exports = calculateValuation;