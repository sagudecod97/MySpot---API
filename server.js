const express = require('express')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config/serverConfig')
const connectDB = require('./utils/db')

const userRouter = require('./src/resources/user/user.router')

const app = express()

/** Middleware **/
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true}))
app.use(morgan('dev'))

/** Routes **/
app.use('/api/v1/users/', userRouter)

/** Connection **/
const start = async () => {
    try {
        await connectDB()
        app.listen(config.PORT, () => {
            console.log(`MySpot API, listening on PORT:${config.PORT}`)
        })
    } catch (err) {
        console.error('Error Connecting Server:', err)
    }
}
module.exports = {start, app}