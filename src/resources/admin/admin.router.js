const Router = require('express').Router
const {
    getAdmin,
    updateAdmin
} = require('./admin.controller')

const router = Router()

router
    .get('/:id', getAdmin)
    .put('/:id', updateAdmin)

module.exports = router