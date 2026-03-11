const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const User = require('../models/User');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Clear existing data
        await Property.deleteMany();
        console.log('🗑️ Old properties deleted...');

        const admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            console.log('❌ Please create an admin user first via Swagger!');
            process.exit();
        }

        const sampleProperties = [
            {
                owner: admin._id,
                title: { en: "Modern Villa in Nyarutarama", rw: "Villa igezweho i Nyarutarama", fr: "Villa moderne à Nyarutarama" },
                description: { en: "Luxury villa with pool", rw: "Villa y'agatangaza ifite pisine", fr: "Villa de luxe avec piscine" },
                price: 150000000,
                type: "sale",
                propertyType: "house",
                status: "available",
                location: { address: "KG 9 Ave, Kigali", type: "Point", coordinates: [30.1044, -1.9441] }
            },
            {
                owner: admin._id,
                title: { en: "Apartment in Kacyiru", rw: "Inzu ikodeshwa i Kacyiru", fr: "Appartement à Kacyiru" },
                description: { en: "Near the US Embassy", rw: "Hafi ya Ambasade y'Amerika", fr: "Près de l'ambassade des États-Unis" },
                price: 800000,
                type: "rent",
                propertyType: "apartment",
                status: "available",
                location: { address: "KG 544 St, Kigali", type: "Point", coordinates: [30.0884, -1.9351] }
            }
        ];

        await Property.create(sampleProperties);
        console.log('✅ Sample data seeded successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();