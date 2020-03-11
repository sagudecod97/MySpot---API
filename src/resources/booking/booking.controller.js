const Booking = require('./booking.model')
const ParkingLot = require('../parkingLot/parkingLot.model')
const UserVehicle = require('../userVehicle/userVehicle.model')

const createBooking = async (req, res) => {
    try {
        const userVehicle = await UserVehicle
        .findById(req.body.userVehicleId)
        .exec()

        if (!userVehicle) {
            return res.status(400).json({'Error': 'Vehicle id doesn\'t exist'})
        }
        const parkingLot = await ParkingLot
        .findById(req.body.parkingLotId)
        .exec()

        if (!parkingLot) {
            return res.status(400).json({'Error': 'Parking Lot doesn\'t exist'})
        }

        if (userVehicle.isACar == true && parkingLot.freeCarCells !== 0) {
            await ParkingLot
            .findByIdAndUpdate(
                req.body.parkingLotId,
                { 'freeCarCells': parkingLot.freeCarCells - 1},
                { new: true})
            .exec()
        } else if (userVehicle.isACar == true) {
            return res.status(400).json({'Error': 'There\'s not space available for cars'})
        }

        if (userVehicle.isACar == false && parkingLot.freeBikeCells !== 0) {
            await ParkingLot
            .findByIdAndUpdate(
                req.body.parkingLotId,
                { 'freeBikeCells': parkingLot.freeBikeCells - 1},
                { new: true})
            .exec()
        } else {
            return res.status(400).json({'Error': 'There\'s not space available for bike'})
        }

        const createdBooking = await Booking
        .create({...req.body})

        return res.status(201).json({data: createdBooking})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The data is for the booking is wrong'})
    }
}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking
        .findById(req.params.id)
        .populate(['userVehicleId', 'parkingLotId'])
        .lean()
        .exec()

        if (!booking) {
            return res.status(404).json({'Error': 'Booking id doesn\'t exist'})
        }

        return res.status(200).json({data: booking})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the booking'})
    }
}

const getAllUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking
        .find({ userId: req.params.user_id})
        .populate(['userVehicleId', 'parkingLotId'])
        .lean()
        .exec()

        if (userBookings.length === 0) {
            return res.status(400).json({'Error': 'User id doesn\'t exist or user hasn\'t got any bookings'})
        } else {
            return res.status(200).json({data: userBookings})
        }

    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the bookings'})
    }
}

const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking
        .findByIdAndUpdate(
            { _id: req.params.id},
            {...req.body},
            { new: true}
        )
        .lean()
        .exec()

        if (!updateBooking) {
            return res.status(404).json({'Error': 'The booking id doesn\'t exist'})
        }

        return res.status(200).json({data: updatedBooking})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The booking id doesn\'t exist'})
    }
}

const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking
        .findByIdAndRemove({ _id: req.params.id})
        .exec()

        if (!deletedBooking) {
            return res.status(404).json({'Error': 'The booking id doesn\'t exist'})
        }

        return res.status(200).json({data: deletedBooking})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Deleting the booking'})
    }
}

module.exports = { 
    createBooking,
    getBooking,
    getAllUserBookings,
    updateBooking,
    deleteBooking
}
