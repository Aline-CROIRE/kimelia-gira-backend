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
require('./config/passport');

// Connect to Database
connectDB();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const valuationRoutes = require('./routes/valuationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

const app = express();

// Security Middlewares
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

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100
});
app.use('/api/', limiter);

// Initialization
app.use(passport.initialize());
if (process.env.NODE_ENV === 'development') { app.use(morgan('dev')); }

// API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/valuation', valuationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/interactions', interactionRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);

// Welcome Route
app.get('/', (req, res) => res.json({ message: "Kimelia Gira API is LIVE" }));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));