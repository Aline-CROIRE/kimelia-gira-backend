const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

// Configuration Imports
dotenv.config();
const connectDB = require('./config/db');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middleware/errorMiddleware');

// Import Passport Strategy (Google OAuth)
require('./config/passport');

// Connect to MongoDB Atlas
connectDB();

// --- ROUTE FILES ---
const authRoutes = require('./routes/authRoutes');           // Register, Login, Google OAuth, Profile
const propertyRoutes = require('./routes/propertyRoutes');   // Create, Get, Search, Maps, Radius
const valuationRoutes = require('./routes/valuationRoutes'); // AI Price Estimation
const adminRoutes = require('./routes/adminRoutes');         // Platform Stats, User Management
const interactionRoutes = require('./routes/interactionRoutes'); // Favorites, Inquiries (Email)
const recommendationRoutes = require('./routes/recommendationRoutes'); // AI Smart Suggestions

const app = express();

// --- SECURITY MIDDLEWARE ---

// 1. Body Parser (Allows server to read JSON)
app.use(express.json());

// 2. Enable CORS (Allows React and Flutter to talk to the server)
app.use(cors());

// 3. Helmet (Security headers + Content Security Policy for OAuth)
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https://res.cloudinary.com", "https://*.googleusercontent.com"],
                connectSrc: ["'self'", "http://localhost:5000", "https://accounts.google.com"],
            },
        },
        crossOriginEmbedderPolicy: false,
    })
);

// 4. Rate Limiting (Prevents Brute Force/Spam)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api/', limiter);

// 5. Initialize Passport for OAuth
app.use(passport.initialize());

// 6. Request Logging (Shows API calls in the console)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// --- API DOCUMENTATION ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// --- MOUNT ROUTES ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/valuation', valuationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/interactions', interactionRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: "Kimelia Gira API is LIVE and Healthy",
        docs: "/api-docs" 
    });
});

// --- ERROR HANDLING ---
// This middleware catches all errors and returns them as clean JSON
app.use(errorHandler);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections (e.g. secret keys missing)
process.on('unhandledRejection', (err, promise) => {
    console.log(`❌ Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});