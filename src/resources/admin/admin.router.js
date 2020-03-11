const Router = require('express').Router
const {
    getAdmin,
    updateAdmin,
    addParkingSpotCar,
    lessParkingSpotCar
} = require('./admin.controller')

const router = Router()

router
    .get('/:id', getAdmin)
    .put('/:id', updateAdmin)
    .get('/add-spot/:parking_id', addParkingSpotCar)
    .get('/less-spot/:parking_id', lessParkingSpotCar)

module.exports = router