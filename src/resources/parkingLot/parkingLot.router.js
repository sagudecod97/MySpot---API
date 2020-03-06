const Router = require('express').Router
const { 
    getParkingLot, 
    getAllParkingLots, 
    deleteParkingLot,
    updateParkingLot,
    createParkingLot
} = require('./parkingLot.controller')

const router = Router()

router
    .get('/', getAllParkingLots)
    .post('/', createParkingLot)

router
    .get('/:id', getParkingLot)
    .delete('/:id', deleteParkingLot)
    .put('/:id', updateParkingLot)

module.exports = router
