const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Passport Config
require('./config/passport');

// Route files
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const valuationRoutes = require('./routes/valuationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// 1. Security Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({
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
}));

// Rate Limiting: Max 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api/', limiter);

// 2. Auth & Logging
app.use(passport.initialize());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 3. Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 4. Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/valuation', valuationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/interactions', interactionRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// 5. Global Error Handler (Must be after routes)
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Kimelia Gira Backend Ready...'))
    .catch(err => console.error('❌ DB Error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));