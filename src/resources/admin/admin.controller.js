const Admin = require('./admin.model')

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin
        .findOne({ email: req.params.body})
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

module.exports = {
    getAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
}