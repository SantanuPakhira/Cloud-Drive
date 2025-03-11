const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 charecter long']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        minlength: [13, 'email must be at least 13 charecter long']
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'password must be at least 5 charecter long']
    }
}, { timestamps: true });


const User = mongoose.model('User', userSchema)

module.exports = User;