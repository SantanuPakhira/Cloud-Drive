const mongoose = require('mongoose');
require('dotenv').config();

async function connectToDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB URI is not defined in the environment variables.');
        }

        await mongoose.connect(process.env.MONGO_URI); // ✅ Remove deprecated options
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
}

module.exports = connectToDB;