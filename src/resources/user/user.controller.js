const User = require('./user.model')

const createUser = async (req, res) => {
    try {
        const user = await User
        .create({...req.body})
        
        console.log(user)

        res.status(201).json(user)
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'The data to create is wrong!'})
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User
        .find({})
        .lean()
        .exec()

        res.status(200).json({data: users})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the users'})
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User
        .findOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!user) {
            res.status(400).json({'Error': 'User doesn\'t exists'})
        }

        res.status(200).json(user)

    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the user'})
    }
}

const updateUser = async (req, res) => {
    try {
        const updateUser = await User
        .findByIdAndUpdate(
            req.params.id,
            req.body
        ,
        { new: true})
        .lean()
        .exec()

        if (!updateUser) {
            res.status(400).json({'Error': 'Couldn\'t update user'})
        }

        res.status(200).json({ data: updateUser})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'The user id doesn\'t exists'})
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User
        .deleteOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!deletedUser) {
            res.status(400).json({'Error': 'Couldn\'t delete the user'})
        }

        res.status(200).json({ dataDeleted: deletedUser})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'While deleting the user'})
    }
}

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser }