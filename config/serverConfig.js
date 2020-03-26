const { merge } = require('lodash')

const optionsDev = require('./optionsDev')
const optionsTest = require('./optionsTest')
const optionsProd = require('./optionsProd')

const ENV = process.env.NODE_ENV || 'dev'

// Object to define the base configuration
const baseConfig = {
    ENV,
    isDevelopment: ENV === 'dev' || ENV === 'development',
    isProduction: ENV === 'prod' || ENV === 'production',
    PORT: ENV === 'prod' || ENV === 'production' ? 5000 : 3000,
    secrets: {
        jwtExp: '100d'
    }
}

// Object to define the enviroment config
let envConfig = {}

switch(ENV) {
    case 'dev':
    case 'development':
        envConfig = optionsDev
        break
    case 'test':
    case 'testing':
        envConfig = optionsTest
        break
    case 'production':
        envConfig = optionsProd
    default:
        envConfig = optionsDev
}

// Exports the merge config
module.exports = merge(baseConfig, envConfig)
