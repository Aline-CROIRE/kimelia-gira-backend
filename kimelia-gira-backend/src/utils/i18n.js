const translations = {
    en: {
        welcome: "Welcome to Kimelia Gira",
        auth_error: "Invalid credentials",
        user_exists: "User already exists",
        reg_success: "Registration successful"
    },
    rw: {
        welcome: "Murakaza neza kuri Kimelia Gira",
        auth_error: "Umwirondoro si wo",
        user_exists: "Uyu mukoresha asanzwe ahari",
        reg_success: "Kwiyandikisha byagenze neza"
    },
    fr: {
        welcome: "Bienvenue sur Kimelia Gira",
        auth_error: "Identifiants invalides",
        user_exists: "L'utilisateur existe déjà",
        reg_success: "Inscription réussie"
    }
};

const t = (key, lang = 'en') => {
    return translations[lang][key] || translations['en'][key];
};

module.exports = t;