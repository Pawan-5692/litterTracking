const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication.js');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'collector','admin'],
        default: 'user',
    },
    contact: {
        type: Number,
        required: true,
        unique: true,
    }
}, { timestamps: true });

userSchema.pre("save", function(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

    user.salt = salt;
    user.password = hashedPassword;
    next(); 
});

userSchema.statics.matchPassword = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const hashedPassword = createHmac('sha256', user.salt).update(password).digest("hex");
    if (user.password !== hashedPassword) throw new Error('Invalid email or password');

    const token = createTokenForUser(user);
    return token;
};

const User = mongoose.model('User', userSchema);
module.exports = { User };