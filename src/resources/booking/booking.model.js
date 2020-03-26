const mongoose = require('mongoose')

// Creates the booking schema with its requiered fields and relations to other schemas
const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required: true
    },
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
