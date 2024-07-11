const {Schema, model} = require('mongoose')

const assignSchema = new Schema({
    assignee: {type: String, required: true},
    assigner: {type: String, required: true},
    task: {type: String, required: true},
    status: {type: String, default:"pending",required: true, },
    date: {type: Date, default: Date.now(),}
}, {timestamps: true})

const assignModel = model('Task', assignSchema)

module.exports = {assignModel,}
