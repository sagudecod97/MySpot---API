const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName: {
        required: true,
        type: String,
        maxLength: 40
    },
    phone: {
        required: true,
        type: String,
        maxLength: 10,
        minLength: 10
    },
    mail: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String,
    }
}, { timestamps: true})
 
module.exports = mongoose.model('user', userSchema)