const mongoose = require('mongoose')

const parkingLotSchema = mongoose.Schema({
    parkingName: {
        type: String,
        required: true
    },
    parkingPhone: {
        type: String,
        required: true
    },
    parkingCoordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    totalCarCells: {
        type: Number,
        required: true
    },
    freeCarCells: {
        type: Number,
        required: true
    },
    totalBikeCells: {
        type: Number,
        required: true
    },
    freeBikeCells: {
        type: Number,
        required: true
    },
    carPerHour: {
        type: Number,
        required: true
    },
    bikePerHour: {
        type: Number,
        required: true
    },
    carPerMonth: {
        type: Number,
        required: true
    },
    bikePerMonth: {
        type: Number,
        required: true
    },
    parkingPolicies: {
        type: String
    }
}, { timestamps: true})

module.exports = mongoose.model('parkingLot', parkingLotSchema)