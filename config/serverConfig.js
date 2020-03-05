const { merge } = require('lodash')

const optionsDev = require('./optionsDev')
const optionsTest = require('./optionsTest')
const optionsProd = require('./optionsProd')

const ENV = process.env.NODE_ENV || 'dev'

const baseConfig = {
    ENV,
    isDevelopment: ENV === 'dev' || ENV === 'development',
    isProduction: ENV === 'prod' || ENV === 'production',
    PORT: ENV === 'prod' || ENV === 'production' ? 5000 : 3000,
    secrets: {
        jwt: process.env.JWT_SECRET,
        jwtExp: '100d'
    }
}

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
console.log(merge(baseConfig, envConfig))

module.exports = merge(baseConfig, envConfig)