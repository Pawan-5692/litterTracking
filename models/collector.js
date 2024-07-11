const {Schema, model} = require('mongoose')
const { createHmac, randomBytes } = require('crypto');
const { createTokenForUser } = require('../services/authentication.js');
const collectorSchema = new Schema({
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
        enum: ['user', 'collector'],
        default: 'collector',
    },
    contact: {
        type: Number,
        required: true,
        unique: true,
    }
})



collectorSchema.pre("save", function(next) {
    const collector = this;
    if (!collector.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');

    const hashedPassword = createHmac("sha256", salt)
        .update(collector.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next(); 
});



collectorSchema.statics.matchPassword = async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('Invalid email or password');

    const hashedPassword = createHmac('sha256', user.salt).update(password).digest("hex");
    if (user.password !== hashedPassword) throw new Error('Invalid email or password');

    const token = createTokenForUser(user);
    return token;
};

const collectorModel = model('collector',collectorSchema)
module.exports = {
    collectorModel
}