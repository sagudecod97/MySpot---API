const mongoose = require('mongoose')

const bookingSchema = mongoose.Schema({
    userVehicleId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userVehicle',
        required: true
    },
    parkingLotId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'parkingLot',
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    relativePrice: {
            type: Number
    }
}, { timestamps: true})

module.exports = mongoose.model('booking', bookingSchema)