const UserVehicle = require('./userVehicle.model')

const createUserVehicle = async (req, res) => {
    try {
        const userVehicle = await UserVehicle
        .create({...req.body})

        return res.status(201).json({data: userVehicle})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'The data to create vehicle is wrong'})
    } 
}

const getUserVehicle = async (req, res) => {
    try {
        const userVehicle = await UserVehicle
        .findOne({_id: req.params.vehicle_id})
        .lean()
        .exec()

        if (!userVehicle) {
            return res.status(400).json({'Error': 'The vehicle doesn\'t exist'})
        }

        return res.status(200).json({data: userVehicle})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the vehicle of the user'})
    }
}

const getUserVehicles = async (req, res) => {
    try {
        const userVehicles = await UserVehicle
        .find({ owner: req.params.id})
        .populate('owner')

        return res.status(200).json({data: userVehicles})
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': ''})
    } 
}

const updateUserVehicle = async (req, res) => {
    try {
        const updatedVehicle = await UserVehicle
        .findByIdAndUpdate(
            { _id: req.params.vehicle_id},
            {...req.body},
            {new: true}
        )
        .lean()
        .exec()
         
        if (!updatedVehicle || updatedVehicle === null) {
            return res.status(400).json({'Error': 'The vehicle id doesn\'t not exist'})
        }

        return res.status(200).json({data: updatedVehicle})
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Couldn\'t update the vehicle'})
    }
}

const deleteUserVehicle = async (req, res) => {
    try {
        const deletedVehicle = await UserVehicle
        .findByIdAndRemove({_id: req.params.vehicle_id})
        .exec()

        if (!deletedVehicle) {
            return res.status(400).json({'Error': 'The vehicle id doesn\'t exist'})
        }

        return res.status(200).json({dataDeleted: deletedVehicle})
    } catch(err) {
        console.error(err)
        return res.status(400).json({'Error': 'While deleting the vehicle'})
    }
}

module.exports = { 
    createUserVehicle, 
    getUserVehicle,
    getUserVehicles,
    updateUserVehicle,
    deleteUserVehicle
}
