const User = require('../src/resources/user/user.model')
const Admin = require('../src/resources/admin/admin.model')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Secrets
const USR_JWT_SCRT = process.env.USR_JWT_SCRT
const ADM_JWT_SCRT = process.env.ADM_JWT_SCRT

// Expires
const USER_EXPRS = process.env.USER_EXPRS
const ADMIN_EXPRS = process.env.ADMIN_EXPRS

// Create token && Verify token -- Admin and User
const newTokenUser = (user) => {
    return JWT.sign({ id: user._id }, USR_JWT_SCRT, { // Creates a new token
        expiresIn: USER_EXPRS
    })
}

const verifyUserToken = (token) => {
    new Promise((resolve, reject) => {
        JWT.verify(token, USR_JWT_SCRT, (err, payload) => { // Verifies the Token received
            if (err) {
                return reject(err)
            } else {
                resolve(payload)
            }
        })
    })
}

const newAdminToken = (admin) => {
    return JWT.sign({ id: admin._id }, ADM_JWT_SCRT, { // Creates a new Token
        expiresIn: ADMIN_EXPRS
    })
}

const verifyAdminToken = (token) => {
    new Promise((res, rej) => {
        JWT.verify(token, ADM_JWT_SCRT, (err, payload) => { // Verifies the new Token
            if (err) {
                return reject(err)
            } else {
                resolve(payload)
            }
        })
    })
}

// SignUp and Login -- User
const singUpUser = async (req, res) => {
    try {
        const user = await User
        .create({...req.body})
        console.log(user)

        const newUserToken = newTokenUser(user)
        return res.status(201).send({ newUserToken, id: user._id }) // If nothing fails
    } catch(err) {
        console.error(err)
        if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.userName) {
            return res.status(400).json({'Error': 'Username already in use'}) // Username already exists
        } else if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.email) {
            return res.status(400).json({'Error': 'Email already in use'}) // Email already registered
        } else {
            return res.status(400).json({'Error': 'All fields are required'}) // Not the correct info received
        }
        
    } 
}

const LoginUser = async (req, res) => {
    const userLog = req.body
    if (!userLog.userName || !userLog.password) {
        return res.status(400).json({'Error': 'Need user-name and password'}) // Not username or password
    }

    try {
        const user = await User
        .findOne({ userName: userLog.userName})
        .lean()
        .exec()

        if (!user) {
            return res.status(404).json({'Error': 'User id doesn\'t not exist'}) // User doesn't exist
        }

        await bcrypt.compare(userLog.password, user.password, (err, same) => { // Compares the password received
            if (err) {
                throw err
            } else if (!same) {
                return res.status(401).json({'Error': 'Invalid password or user-name'})
            } else {
                const newUserToken = newTokenUser(user)
                return res.status(200).send({ newUserToken, id: user._id }) // Send a new token on success
            }
        })
       
    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Login the user'}) // Failed login the user
    }
}

const protectUserRoute = async (req, res, next) => {
    const bearer = req.headers.authorization // Get token from the headers

    if (!bearer) {
        return res.status(401).json({'Error': 'Not authenticated'}) // If not header, return error
    }
    let bearerArray
    let tokenUser

    try {
        bearerArray = bearer.split(' ')
        tokenUser = bearerArray[1].trim()
    } catch(err) {
        return res.status(401).json({'Error': 'Not authenticated'}) // if the split or trim fail, send error
    }

    if (bearerArray[0] !== 'Bearer') {
        return res.status(401).json({'Error': 'Not authenticated'}) // If not Bearer, send error
    }

    let payload
    try {
        await JWT.verify(tokenUser, USR_JWT_SCRT, (err, decoded) => { // Checks the received token
            if (err) {
                throw err
            }
            payload = decoded
        }) 
    } catch(err) {
        console.error(err)
        return res.status(401).json({'Error': 'Not authenticated'}) // If authentication fails, return error
    }
    
    const user = await User
    .findById(payload.id)
    .lean()
    .exec()

    if (!user) {
        return res.status(401).json({'Error': 'Not authenticated'}) // Checks if user related to token exists
    }

    return next()
}

// SignUp && Login -- Admin ParkingLot
const signUpAdmin = async (req, res) => {
    try {
        const admin = await Admin
        .create({...req.body})

        const newAdmnToken = newAdminToken(admin)
        return res.status(201).send({ newAdmnToken, id: admin._id })
    } catch (err) {
        console.error(err)
        if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.email) {
            return res.status(400).json({'Error': 'Email already in use'})
        } else {
            return res.status(400).json({'Error': 'All fields are required'})
        }
    }
}

const LoginAdmin = async (req, res) => {
    const adminLog = req.body
    if (!adminLog.email || !adminLog.password) {
        return res.status(400).json({'Error': 'Need email and password'})
    }

    try {
        const admin = await Admin
        .findOne({ email: adminLog.email })
        .lean()
        .exec()

        if (!admin) {
            return res.status(404).json({'Error': 'Admin doesn\'t exist'})
        }

        await bcrypt.compare(adminLog.password, admin.password, (err, same) => {
            if (err) {
                throw err
            } else if (!same) {
                return res.status(401).json({'Error': 'Incorrect password' })
            } else {
                const newAdmnToken = newAdminToken(admin)
                return res.status(200).send({ newAdmnToken, id: admin._id })
            }
        })
    } catch(err) {
        console.error(err)
        return res.status(500).json({'Error': 'Loggin the Admin'})
    }
}

const protectAdminRoute = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        return res.status(401).json({'Error': 'Not authenticated'})
    }
    const bearerArray = bearer.split(' ')
    const tokenAdmin = bearerArray[1].trim()

    if (bearerArray[0] !== 'Bearer') {
        return res.status(401).json({'Error': 'Not authenticated'})
    }

    let payload
    try {
        await JWT.verify(tokenAdmin, ADM_JWT_SCRT, (err, decoded)=> {
            if (err) {
                throw err
            } else {
                payload = decoded
            }
        })
    } catch(err) {
        console.error(err)
        return res.status(401).json({'Error': 'Not authenticated'})
    }

    const admin = await Admin
    .findById(payload.id)
    .lean()
    .exec()

    if (!admin) {
        return res.status(401).json({'Error': 'Not authenticated'})
    }
    return next()
}

module.exports = {
    newTokenUser,
    verifyUserToken,
    singUpUser,
    LoginUser,
    protectUserRoute,
    newAdminToken,
    verifyAdminToken,
    signUpAdmin,
    LoginAdmin,
    protectAdminRoute
}
