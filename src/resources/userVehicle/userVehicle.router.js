const Router = require('express').Router
const {
    createUserVehicle,
    getUserVehicle,
    getUserVehicles,
    updateUserVehicle,
    deleteUserVehicle
} = require('./userVehicle.controller')

const router = Router()

router
    .post('/', createUserVehicle)

router
    .get('/:vehicle_id', getUserVehicle)
    .get('/user/:id', getUserVehicles)
    .put('/:vehicle_id', updateUserVehicle)
    .delete('/:vehicle_id', deleteUserVehicle)

module.exports = router