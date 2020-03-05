const mongoose = require('mongoose')
const options = require('../config/serverConfig')

const urlDB = typeof options.optionsDev !== 'undefined' ? options.optionsDev.dbURL : options.optionsProd.dbURL

const connectDB = (url = urlDB) => {
    return mongoose.connect(url, {useNewUrlParser: true})
}

module.exports = connectDB