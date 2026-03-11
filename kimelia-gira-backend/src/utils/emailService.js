const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const sendEmail = async (options) => {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.text,
        html: options.html,
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Test Email sent to Mailtrap for: ${options.email}`);
    } catch (error) {
        console.error("❌ Email Error:", error.message);
    }
};

// Templates for Multi-language Welcome
const getWelcomeContent = (name, lang) => {
    const content = {
        en: { 
            subject: "Welcome to Kimelia Gira", 
            body: `Hello ${name}, welcome to the best PropTech platform in Rwanda. We are glad to have you!` 
        },
        rw: { 
            subject: "Murakaza neza kuri Kimelia Gira", 
            body: `Muraho ${name}, ikaze ku rubuga rwa mbere rw'imitungo itimukanwa mu Rwanda. Twishimiye kubana nawe!` 
        },
        fr: { 
            subject: "Bienvenue sur Kimelia Gira", 
            body: `Bonjour ${name}, bienvenue sur la meilleure plateforme PropTech au Rwanda. Nous sommes ravis de vous compter parmi nous !` 
        }
    };
    return content[lang] || content['en'];
};

module.exports = { sendEmail, getWelcomeContent };