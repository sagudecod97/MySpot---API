const UserVehicle = require('./userVehicle.model')

// Creates a Vehicle
const createUserVehicle = async (req, res) => {
    try {
        const userVehicle = await UserVehicle // Creates a vehicle associated with a user
        .create({...req.body})

        return res.status(201).json({data: userVehicle}) // Returns the Vehicle's data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The data to create vehicle is wrong'}) // Couldn't create the user
    } 
}

// Gets user
const getUserVehicle = async (req, res) => {
    try {
        const userVehicle = await UserVehicle // Gets a user vehicle
        .findOne({_id: req.params.vehicle_id})
        .lean()
        .exec()

        if (!userVehicle) { // Checks if the vehicle exists
            return res.status(400).json({'Error': 'The vehicle doesn\'t exist'})
        }

        return res.status(200).json({data: userVehicle}) // Returns the vehicle's data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the vehicle of the user'}) // Couldn't get the vehicle
    }
}

// Get Vehicles
const getUserVehicles = async (req, res) => {
    try {
        const userVehicles = await UserVehicle // Gets all the vehicles associated to an user
        .find({ owner: req.params.id})
        .populate('owner')
 
        return res.status(200).json({data: userVehicles}) // Returns a list of an user's vehicles
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': ''}) // Couldn't get the user's vehicles
    } 
}

// Updates vehicles
const updateUserVehicle = async (req, res) => {
    try {
        const updatedVehicle = await UserVehicle // Updates an specific vehicle
        .findByIdAndUpdate(
            { _id: req.params.vehicle_id},
            {...req.body},
            {new: true}
        )
        .lean()
        .exec()
         
        if (!updatedVehicle || updatedVehicle === null) { // Checks if the vehicle exists
            return res.status(400).json({'Error': 'The vehicle id doesn\'t not exist'})
        }

        return res.status(200).json({data: updatedVehicle}) // Returns the updated vehicle's data
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Couldn\'t update the vehicle'}) // Couldn't update the specific vehicle
    }
}

// Delete vehicle
const deleteUserVehicle = async (req, res) => {
    try {
        const deletedVehicle = await UserVehicle // Deletes an specific vehicle
        .findByIdAndRemove({_id: req.params.vehicle_id})
        .exec()

        if (!deletedVehicle) { // Checks if the vehicle existed
            return res.status(400).json({'Error': 'The vehicle id doesn\'t exist'})
        }

        return res.status(200).json({dataDeleted: deletedVehicle}) // Returns the deleted vehicle's data
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'While deleting the vehicle'}) // Couldn't delete the vehicle
    }
}

module.exports = { 
    createUserVehicle, 
    getUserVehicle,
    getUserVehicles,
    updateUserVehicle,
    deleteUserVehicle
}
