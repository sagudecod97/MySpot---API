const Router = require('express').Router
const {
    getAdmin,
    updateAdmin,
    addParkingSpotCar
} = require('./admin.controller')

const router = Router()

router
    .get('/:id', getAdmin)
    .put('/:id', updateAdmin)
    .get('/add-spot/:parking_id', addParkingSpotCar)

module.exports = router