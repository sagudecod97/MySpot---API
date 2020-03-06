const Booking = require('./booking.model')

const createBooking = async (req, res) => {
    try {
        const createdBooking = await Booking
        .create({...req.body})

        res.status(201).json({data: createdBooking})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'The data is for the booking is wrong'})
    }
}

const getBooking = async (req, res) => {
    try {
        const booking = await Booking
        .findById(req.params.id)
        .lean()
        .exec()

        if (!booking) {
            res.status(404).json({'Error': 'Booking id doesn\'t exist'})
        }

        res.status(200).json({data: booking})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the booking'})
    }
}

const getAllUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking
        .find({ owner: req.params.user_id})
        .lean()
        .exec()

        res.status(200).json({data: userBookings})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the bookings'})
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
            res.status(404).json({'Error': 'The booking id doesn\'t exist'})
        }

        res.status(200).json({data: updatedBooking})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'The booking id doesn\'t exist'})
    }
}

const deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking
        .findByIdAndRemove({ _id: req.params.id})
        .exec()

        if (!deletedBooking) {
            res.status(404).json({'Error': 'The booking id doesn\'t exist'})
        }

        res.status(200).json({data: deletedBooking})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'Deleting the booking'})
    }
}

module.exports = { 
    createBooking,
    getBooking,
    getAllUserBookings,
    updateBooking,
    deleteBooking
}