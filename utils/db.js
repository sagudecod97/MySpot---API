const mongoose = require('mongoose')
const options = require('../config/serverConfig')

// Defines the connection to the DB, if production or not
const urlDB = typeof options.optionsDev !== 'undefined' ? options.optionsDev.dbURL : options.optionsProd.dbURL

// Makes the connection with the DB
const connectDB = (url = urlDB) => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports = connectDB
