const translate = require('google-translate-api-next');

const autoTranslate = async (text) => {
    const targetLangs = ['en', 'rw', 'fr'];
    const translations = {};

    try {
        // Run translations in parallel for speed
        await Promise.all(targetLangs.map(async (lang) => {
            const res = await translate(text, { to: lang });
            translations[lang] = res.text;
        }));
        
        return translations;
    } catch (err) {
        console.error("Translation Error:", err);
        // Fallback: If translation fails, put the original text in all fields
        return { en: text, rw: text, fr: text };
    }
};

module.exports = autoTranslate;