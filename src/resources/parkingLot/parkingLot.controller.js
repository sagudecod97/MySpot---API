const ParkingLot = require('./parkingLot.model')

const createParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot
        .create({...req.body})
        .lean()
        .exec()

        res.status(200).json({data: parkingLot})

    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'the data to create parking lot is wrong'})
    }
}

const getParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot
        .findById({ _id: req.params.id })
        .lean()
        .exec()

        if (!parkingLot) {
            res.status(400).json({'Error': 'Parking lot doesn\'t exist'})
        }
        
        res.status(200).json({ data: parkingLot})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Couldn\'t get parking lot'})
    }
}

const getAllParkingLots = async (req, res) => {
    try {
        const parkingLots = await ParkingLot
        .find({})
        .lean()
        .exec()

        res.status(200).json({ data: parkingLots})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the parking lots'})
    }
}

const updateParkingLot = async (req, res) => {
    try {
        const updatedParkingLot = await ParkingLot
        .findByIdAndUpdate(
            req.params.id,
            {... req.body},
            { new: true})
        .lean()
        .exec()

        if (!updatedParkingLot) {
            res.status(400).json({ 'Error': 'Updating the parking lot'})
        }

        res.status(200).json({ data: updatedParkingLot})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'The parking lot id doesn\'t not exist'})
    }
}

const deleteParkingLot = async (req, res) => {
    try {
        const deletedParkingLot = await ParkingLot
        .findByIdAndRemove(req.params.id)
        .exec()

        if (!deletedParkingLot) {
            res.status(400).json({'Error': 'Parking lot id doesn\'t exist'})
        }

        res.status(200).json({delete: deletedParkingLot})

    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Deleting the parking lot'})
    }
}

module.exports = { createParkingLot, getParkingLot, getAllParkingLots, updateParkingLot, deleteParkingLot}