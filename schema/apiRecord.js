const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
    endpoint: {
        type: String,
        required: true,
        unique: false,
    },
    statusCode: {
        type: Number
    },
    method: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('apiRecord', schema) //apiRecord is the name of the collection in the db
