const Router = require('express').Router
const {
    getBooking,
    getAllUserBookings,
    createBooking,
    updateBooking,
    deleteBooking
} = require('./booking.controller')

const router = Router()

router
    .post('/', createBooking)

router
    .get('/:id', getBooking)
    .get('/user/:user_id', getAllUserBookings)
    .put('/:id', updateBooking)
    .delete('/:id', deleteBooking)

module.exports = router