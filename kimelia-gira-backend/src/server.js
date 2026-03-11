const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const valuationRoutes = require('./routes/valuationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Swagger Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/valuation', valuationRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Kimelia Gira API", documentation: "/api-docs" });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected...'))
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});