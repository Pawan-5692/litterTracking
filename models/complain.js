const {Schema, model} = require('mongoose')

const complainSchema = new Schema({
    imageURL:{
        type:String,
        required : true,
    },
    complain: {
        type:String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    location: [{
        latitude: {
            type: String,
            required: true
        },
        longitude: {
            type: String,
            required: true
        }
    }],
    date:{
        type: Date, 
        default: Date.now(),
    },
    status:{
        type: String,
        default: "pending",
        required: true,
    }
},{timestamps: true})

const complainModel = model('complain', complainSchema);

module.exports = {complainModel}
