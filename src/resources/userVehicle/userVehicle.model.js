const mongoose = require('mongoose')

// Created the User vehicle schema with its required fields
const userVehicleSchema = mongoose.Schema({
    vehicleLicense: {
        required: true,
        type: String,
        required: true
    },
    isACar: {
        default: true,
        type: Boolean,
        required: true
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true})

module.exports = mongoose.model('userVehicle', userVehicleSchema)
