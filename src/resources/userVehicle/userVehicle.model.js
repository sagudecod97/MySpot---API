const mongoose = require('mongoose')

const userVehicleSchema = mongoose.Schema({
    vehicleLicense: {
        required: true,
        type: String
    },
    isACar: {
        required: true,
        type: Boolean
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    }
}, { timestamps: true})

module.exports = mongoose.model('userVehicle', userVehicleSchema)