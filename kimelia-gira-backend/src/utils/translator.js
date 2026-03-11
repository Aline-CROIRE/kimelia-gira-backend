const translate = require('google-translate-api-next');

const autoTranslate = async (text) => {
    if (!text) return { en: "", rw: "", fr: "" };
    
    const targetLangs = ['en', 'rw', 'fr'];
    const translations = {};

    try {
        // Run translations in parallel
        await Promise.all(targetLangs.map(async (lang) => {
            const res = await translate(text, { to: lang });
            translations[lang] = res.text;
        }));
        
        return translations;
    } catch (err) {
        console.error("Translation Utility Error:", err.message);
        // Fallback: use original text for all if translation fails
        return { en: text, rw: text, fr: text };
    }
};

module.exports = autoTranslate;