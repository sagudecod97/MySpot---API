const Admin = require('./admin.model')
const ParkingLot = require('../parkingLot/parkingLot.model')

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin
        .findOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!admin || admin.isOnline === false) {
            res.status(404).json({'Error': 'Admin email doesn\'t exist'})
        }

        res.status(200).json({ data: admin })
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the Admin'})
    }
}

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin
        .find({})
        .lean()
        .exec()

        res.status(200).json({ data: admins })
    } catch(err) {
        console.error(err)
        res.status(500).json({'Error': 'Getting all the admins'})
    }
}

const updateAdmin = async (req, res) => {
    try {
        const updatedAdmin = await Admin
        .findByIdAndUpdate(
            req.params.id,
            {...req.body},
            { new: true})
        .lean()
        .exec()

        if (!updatedAdmin) {
            res.json(400).json({'Error': 'Couldn\'t update the user'})
        }

        res.status(200).json({ updatedAdmin: updatedAdmin})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'The admin id doesn\'t exist'})
    }
}

const deleteAdmin = async (req, res) => {
    try {
        const deletedAdmin = await Admin
        .deleteOne({ email: req.body.email})
        .exec()
        .lean()

        if (!deletedAdmin) {
            res.status(404).json({'Error': 'Admin id doesn\'t exist'})
        }
        res.status(200).json({ adminDeleted: deletedAdmin})
    } catch(err) {
        console.error(err)
        res.status(500).json({'Error': 'Deleting the admin'})
    }
}

const addParkingSpotCar = async (req, res) => {
    try {
        const parkingLot = await ParkingLot
        .findById(req.params.parking_id)
        .exec()

        if (parkingLot.freeCarCells + 1 > parkingLot.totalCarCells) {
            res.status(400).json({'Error': 'All total car cells are free'})
        } else {
            await ParkingLot
            .findByIdAndUpdate(
                req.params.parking_id,
                { 'freeCarCells': parkingLot.freeCarCells + 1},
                { new: true}
            )
            .exec()

            res.status(200).send({'OK': 200})
        }

    } catch(err) {

    }
}

module.exports = {
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    addParkingSpotCar
}