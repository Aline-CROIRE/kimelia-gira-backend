const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

// Initialize Firebase only if the key exists
try {
    // Look for the file in the root directory
    const serviceAccount = require(path.join(__dirname, '../../firebase-key.json'));
    
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("✅ Firebase Admin Initialized");
} catch (error) {
    console.warn("⚠️ Firebase key missing or invalid. Push notifications will be disabled. Error:", error.message);
}

const sendPushNotification = async (token, title, body) => {
    if (!token || !admin.apps.length) return;

    const message = {
        notification: { title, body },
        token: token
    };

    try {
        await admin.messaging().send(message);
        console.log("🔔 Push notification sent successfully");
    } catch (error) {
        console.error("❌ Firebase Error:", error.message);
    }
};

module.exports = sendPushNotification;