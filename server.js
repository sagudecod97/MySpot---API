const express = require('express')
const { json, urlencoded } = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./config/serverConfig')
const connectDB = require('./utils/db')

const userRouter = require('./src/resources/user/user.router')
const parkingLotRouter = require('./src/resources/parkingLot/parkingLot.router')
const userVehicleRouter = require('./src/resources/userVehicle/userVehicle.router')
const bookingRouter = require('./src/resources/booking/booking.router')

const { singUpUser, LoginUser, protectUserRoute } = require('./utils/auth')

const app = express()

/** Middlewares **/
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true}))
app.use(morgan('dev'))

app.use('/api/v1/user-signup', singUpUser)
app.use('/api/v1/login/', LoginUser)
app.use('/api/v1/users/', protectUserRoute)

/** Routes **/

// Main map route
app.get('/api/v1/main/', require('./src/resources/parkingLot/parkingLot.controller').getAllParkingLots)

// User routes
app.use('/api/v1/users/', userRouter)
app.use('/api/v1/users/user-vehicles/', userVehicleRouter)
app.use('/api/v1/users/bookings/', bookingRouter) 

// Admn Parking lot routes
app.use('/api/v1/admin/parking-lots/', parkingLotRouter)

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