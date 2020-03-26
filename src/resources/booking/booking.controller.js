const Booking = require('./booking.model')
const ParkingLot = require('../parkingLot/parkingLot.model')
const UserVehicle = require('../userVehicle/userVehicle.model')

// Creates a booking
const createBooking = async (req, res) => {
    try {
        const userVehicle = await UserVehicle // Finds the user vehicle to append to the booking
        .findById(req.body.userVehicleId)
        .exec()

        if (!userVehicle) {
            return res.status(400).json({'Error': 'Vehicle id doesn\'t exist'}) // There's not such vehicle
        }
        const parkingLot = await ParkingLot
        .findById(req.body.parkingLotId) // Finds the parking lot to append to the booking
        .exec()

        if (!parkingLot) {
            return res.status(400).json({'Error': 'Parking Lot doesn\'t exist'}) // There's not such parking lot
        }

        if (userVehicle.isACar == true && parkingLot.freeCarCells !== 0) { // Checks available free car parking lots
            await ParkingLot
            .findByIdAndUpdate( // Updates the quantity of free car parking lots
                req.body.parkingLotId,
                { 'freeCarCells': parkingLot.freeCarCells - 1},
                { new: true})
            .exec()
        } else if (userVehicle.isACar == true) {
            return res.status(400).json({'Error': 'There\'s not space available for cars'}) // Not available free parking lots for cars
        }

        if (userVehicle.isACar == false && parkingLot.freeBikeCells !== 0) { // Checks available free bike parking lots
            await ParkingLot 
            .findByIdAndUpdate( // Updates the quantity of free bike parking lots
                req.body.parkingLotId,
                { 'freeBikeCells': parkingLot.freeBikeCells - 1},
                { new: true})
            .exec()
        } else {
            return res.status(400).json({'Error': 'There\'s not space available for bike'}) // Not available free parking lots for bikes
        }

        const createdBooking = await Booking
        .create({...req.body}) // Created the bookin

        return res.status(201).json({data: createdBooking}) // Returns the booking data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The data is for the booking is wrong'}) // Failed creating the booking
    }
}

// Gets a booking
const getBooking = async (req, res) => {
    try {
        const booking = await Booking // Gets an required booking
        .findById(req.params.id)
        .populate(['userVehicleId', 'parkingLotId'])
        .lean()
        .exec()

        if (!booking) {
            return res.status(404).json({'Error': 'Booking id doesn\'t exist'}) // Such booking doesn't exist
        }

        return res.status(200).json({data: booking}) // Returns the booking data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the booking'}) // Failed getting the bookin
    }
}

// Gets all the booking of a user
const getAllUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking // Gets a user bookings
        .find({ userId: req.params.user_id})
        .populate(['userVehicleId', 'parkingLotId'])
        .lean()
        .exec()

        if (userBookings.length === 0) { // Checks if user has any bookings
            return res.status(400).json({'Error': 'User id doesn\'t exist or user hasn\'t got any bookings'})
        } else {
            return res.status(200).json({data: userBookings}) // Returns the user bookings data
        }

    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the bookings'}) // Failed getting the bookings
    }
}

// Updates a booking
const updateBooking = async (req, res) => {
    try {
        const updatedBooking = await Booking // Updates a booking
        .findByIdAndUpdate(
            { _id: req.params.id},
            {...req.body},
            { new: true}
        )
        .lean()
        .exec()

        if (!updateBooking) {
            return res.status(404).json({'Error': 'The booking id doesn\'t exist'}) // Such booking doesn't exist
        }

        return res.status(200).json({data: updatedBooking}) // Returns the updated booking data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The booking id doesn\'t exist'}) // Failed updating the booking
    }
}

// Deletes the booking
const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking // Deletes the booking
        .findByIdAndRemove({ _id: req.params.id})
        .exec()

        if (!deletedBooking) { // Checks if booking exists
            return res.status(404).json({'Error': 'The booking id doesn\'t exist'})
        }

        return res.status(200).json({data: deletedBooking}) // Retursn the deleted booking's data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Deleting the booking'}) // Failed deleting the booking
    }
}

module.exports = { 
    createBooking,
    getBooking,
    getAllUserBookings,
    updateBooking,
    deleteBooking
}
