const Admin = require('./admin.model')
const ParkingLot = require('../parkingLot/parkingLot.model')

// Gets an Admin
const getAdmin = async (req, res) => {
    try {
        const admin = await Admin // Finds one admin
        .findOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!admin || admin.isOnline === false) {
            return res.status(404).json({'Error': 'Admin email doesn\'t exist'}) // Retuns not found if not exist
        }

        return res.status(200).json({ data: admin }) // Return admin's data on success
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the Admin'}) // Failed getting the admin
    }
}

// Gets all the admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin // Finds all the admins
        .find({})
        .lean()
        .exec()

        return res.status(200).json({ data: admins }) // Returns an array of admins
    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Getting all the admins'}) // Failed getting the admin
    }
}

const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin // Updates an admin
        .findByIdAndUpdate(
            req.params.id,
            {...req.body},
            { new: true})
        .lean()
        .exec()

        if (!updatedAdmin) {
            return res.json(400).json({'Error': 'Couldn\'t update the user'}) // Not admin to update
        }

        return res.status(200).json({ updatedAdmin: updatedAdmin}) // Updated admin's info
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The admin id doesn\'t exist'}) // Failed updating the admin
    }
}

// Deletes an admin
const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin
        .deleteOne({ email: req.body.email}) // Deletes the admin
        .exec()
        .lean()

        if (!deletedAdmin) {
            return res.status(404).json({'Error': 'Admin id doesn\'t exist'}) // Not admin to delete 
        }
        return res.status(200).json({ adminDeleted: deletedAdmin}) // Returns the delete admin's info
    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Deleting the admin'}) // Failed deleting the admin
    }
}

// Adds a new free sopt
const addParkingSpotCar = async (req, res) => {
    try {
        const parkingLot = await ParkingLot // Finds the required parking lot
        .findById(req.params.parking_id)
        .exec()

        if (parkingLot.freeCarCells + 1 > parkingLot.totalCarCells) { //Checks the free parking lots
            return res.status(400).json({'Error': 'All total car cells are free'}) // Not free parking lots
        } else {
            await ParkingLot
            .findByIdAndUpdate( // Updates the free parking lots
                req.params.parking_id,
                { 'freeCarCells': parkingLot.freeCarCells + 1},
                { new: true}
            )
            .exec()

            return res.status(200).send({'OK': 200})
        }

    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Adding the free car parking spot'}) // Failed adding the parking lot
    }
}

const lessParkingSpotCar = async (req, res) => {
    try {
        const parkingLot = await ParkingLot // Find the required parking lot
        .findById(req.params.parking_id)
        .exec()

        if (parkingLot.freeCarCells - 1 < 0) { // Checks if the parking lots aren't already free
            return res.status(400).json({'Error': 'All car parking lots occupied'})
        } else {
            await ParkingLot
            .findByIdAndUpdate( // Updates the parking lots available
                req.params.parking_id,
                { 'freeCarCells': parkingLot.freeCarCells - 1},
                { new: true }
            )
            .exec()

            return res.status(200).json({'OK': 200})
        }

    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Couldn\'t handle the add of a free spot'}) // Failed adding the parking lot
    }
}

module.exports = {
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    addParkingSpotCar,
    lessParkingSpotCar
}
