const User = require('./user.model')

// Creates an user
const createUser = async (req, res) => {
    try {
        const user = await User // Creates an User
        .create({...req.body})

        return res.status(201).json(user) // Returns the created user
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'The data to create is wrong!'}) // Couldn't create the user
    }
}

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User // Gets all the Users
        .find({})
        .lean()
        .exec()

        return res.status(200).json({data: users}) // Returns a list of all the users
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the users'}) // Couldn't get the users
    }
}

// Get user
const getUser = async (req, res) => {
    try {
        const user = await User // Gets an specific user
        .findOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!user) { // Checks if the user exists
            return res.status(400).json({'Error': 'User doesn\'t exist'})
        }

        return res.status(200).json({ data: user}) // Returns the user data

    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'Getting the user'}) // Coudn't get the user
    }
}

// Update User
const updateUser = async (req, res) => {
    try {
        const updateUser = await User // Updates an specific user
        .findByIdAndUpdate(
            req.params.id,
            req.body
        ,
        { new: true})
        .lean()
        .exec()

        if (!updateUser) { // Checks if the user exists
            return res.status(400).json({'Error': 'Couldn\'t update user'})
        }

        return res.status(200).json({ data: updateUser}) // Returns the updated user data
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'The user id doesn\'t exist'}) // Couldn't update the user
    }
}

// Deletes a user
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User // Deletes an specific user
        .deleteOne({ _id: req.params.id})
        .lean()
        .exec()

        if (!deletedUser) { // Checks if the user existed
            return res.status(400).json({'Error': 'Couldn\'t delete the user'})
        }

        return res.status(200).json({ dataDeleted: deletedUser}) // Returns the deleted user's data
    } catch (err) {
        console.error(err)
        return res.status(400).json({'Error': 'While deleting the user'}) // Couldn't delete the user
    }
}

module.exports = { createUser, getAllUsers, getUser, updateUser, deleteUser }
