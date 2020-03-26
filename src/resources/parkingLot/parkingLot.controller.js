const ParkingLot = require('./parkingLot.model')

// Creates a parking lot
const createParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot // Creates the parking lot
        .create({...req.body})

        return res.status(200).json({data: parkingLot}) // Return the created parkinglot data

    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'the data to create parking lot is wrong'}) // Couldn't create the parking lot
    }
}

// Get a parking lot
const getParkingLot = async (req, res) => {
    try {
        const parkingLot = await ParkingLot // Gets the required parking lot
        .findById({ _id: req.params.id })
        .lean()
        .exec()

        if (!parkingLot) { // Checks if the parking lot exists
            return res.status(400).json({'Error': 'Parking lot doesn\'t exist'})
        }
        
        return res.status(200).json({ data: parkingLot}) // Returns the required parking lot
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Couldn\'t get parking lot'}) // Couldn't get the parking lot
    }
}

// Get All parking lots
const getAllParkingLots = async (req, res) => {
    try {
        const parkingLots = await ParkingLot // Get all the parking lots
        .find({})
        .lean()
        .exec()

        return res.status(200).json({ data: parkingLots}) // Returns a list of parking lots
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the parking lots'}) // Couldn't get the parking lots
    }
}

// Updates a parking lot
const updateParkingLot = async (req, res) => {
    try {
        const updatedParkingLot = await ParkingLot // Updates an specific parking lot
        .findByIdAndUpdate(
            req.params.id,
            {... req.body},
            { new: true})
        .lean()
        .exec()

        if (!updatedParkingLot) { // Checks if the parking lot to update existed
            return res.status(400).json({ 'Error': 'Updating the parking lot'})
        }

        return res.status(200).json({ data: updatedParkingLot}) // Returns the updated parking lot data 
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'The parking lot id doesn\'t not exist'}) // Couldn't update the parking lot
    }
}

// Deletes the parking lot
const deleteParkingLot = async (req, res) => {
    try {
        const deletedParkingLot = await ParkingLot // Deletes an specific parking lot
        .findByIdAndRemove(req.params.id)
        .exec()

        if (!deletedParkingLot) { // Checks if the parking lot existed
            return res.status(400).json({'Error': 'Parking lot id doesn\'t exist'})
        }

        return res.status(200).json({delete: deletedParkingLot}) // Returns the deleted parking lot data

    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Deleting the parking lot'})
    }
}

module.exports = { 
    createParkingLot, 
    getParkingLot, 
    getAllParkingLots, 
    updateParkingLot, 
    deleteParkingLot
}
