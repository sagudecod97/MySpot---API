const Router = require('express').Router
const { getAllUsers, getUser, createUser, updateUser, deleteUser} = require('./user.controller')

const router = Router()

router
    .get('/', getAllUsers )
    .post('/', createUser)

router
    .get('/:id', getUser)
    .put('/:id', updateUser)
    .delete('/:id', deleteUser)

module.exports = router
