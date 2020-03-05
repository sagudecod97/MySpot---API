const User = require('./user.model')

export const createUser = async (req, res) => {
    try {
        const user = await User
        .create(req.body)

        res.status(201).json(user)
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Creating user'})
    }
}

export const getAllUsers = async (req, res) => {
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

export const getUser = async (req, res) => {
    try {
        const user = await User
        .findOne({ _id: req.params.id})
        .lean()
        .exec()

        res.status(200).json(user)

    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Getting the user'})
    }
}

export const updateUser = (req, res) => {
    try {
        const updateUser = await User
        .updateOne({
            _id: req.body.id
        },
        { new: true})
        .lean()
        .exec()

        if (!updateUser) {
            res.status(400).json({'Error': 'Couldn\'t update user'})
        }

        res.status(200).json({ data: updateUser})
    } catch (err) {
        console.error(err)
        res.status(400).json({'Error': 'Updating user'})
    }
}

export const deleteUser = (req, res) => {
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