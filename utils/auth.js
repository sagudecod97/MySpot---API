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
    return JWT.sign({ id: user._id }, USR_JWT_SCRT, {
        expiresIn: USER_EXPRS
    })
}

const verifyUserToken = (token) => {
    new Promise((resolve, reject) => {
        JWT.verify(token, USR_JWT_SCRT, (err, payload) => {
            if (err) {
                return reject(err)
            } else {
                resolve(payload)
            }
        })
    })
}

const newAdminToken = (admin) => {
    return JWT.sign({ id: admin._id }, ADM_JWT_SCRT, {
        expiresIn: ADMIN_EXPRS
    })
}

const verifyAdminToken = (token) => {
    new Promise((res, rej) => {
        JWT.verify(token, ADM_JWT_SCRT, (err, payload) => {
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
        res.status(201).send({ newUserToken, id: user._id })
    } catch(err) {
        console.error(err)
        if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.userName) {
            res.status(400).json({'Error': 'Username already in use'})
        } else if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.email) {
            res.status(400).json({'Error': 'Email already in use'})
        } else {
            res.status(400).json({'Error': 'All fields are required'})
        }
        
    } 
}

const LoginUser = async (req, res) => {
    const userLog = req.body
    if (!userLog.userName || !userLog.password) {
        res.status(400).json({'Error': 'Need user-name and password'})
    }

    try {
        const user = await User
        .findOne({ userName: userLog.userName})
        .lean()
        .exec()

        if (!user) {
            res.status(400).json({'Error': 'User id doesn\'t not exist'})
        }

        await bcrypt.compare(userLog.password, user.password, (err, same) => {
            if (err) {
                throw err
            } else if (!same) {
                res.status(401).json({'Error': 'Invalid password or user-name'})
            } else {
                const newUserToken = newTokenUser(user)
                res.status(200).send({ newUserToken, id: user._id })
            }
        })
       
    } catch(err) {
        console.error(err)
        res.status(500).json({'Error': 'Login the user'})
    }
}

const protectUserRoute = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        res.status(401).json({'Error': 'Not authenticated'})
    }
    const bearerArray = bearer.split(' ')
    const tokenUser = bearerArray[1].trim()

    if (bearerArray[0] !== 'Bearer') {
        res.status(401).json({'Error': 'Not authenticated'})
    }

    let payload
    try {
        await JWT.verify(tokenUser, USR_JWT_SCRT, (err, decoded) => {
            if (err) {
                throw err
            }
            payload = decoded
        }) 
    } catch(err) {
        console.error(err)
        res.status(401).json({'Error': 'Not authenticated'})
    }
    
    const user = await User
    .findById(payload.id)
    .lean()
    .exec()

    if (!user) {
        res.status(401).json({'Error': 'Not authenticated'})
    }

    return next()
}

// SignUp && Login -- Admin ParkingLot
const signUpAdmin = async (req, res) => {
    try {
        const admin = await Admin
        .create({...req.body})

        const newAdmnToken = newAdminToken(admin)
        res.status(201).send({ newAdmnToken, id: admin._id })
    } catch (err) {
        console.error(err)
        if (typeof(err.keyPattern) !== 'undefined' && err.keyPattern.email) {
            res.status(400).json({'Error': 'Email already in use'})
        } else {
            res.status(400).json({'Error': 'All fields are required'})
        }
    }
}

const LoginAdmin = async (req, res) => {
    const adminLog = req.body
    if (!adminLog.email || !adminLog.password) {
        res.status(400).json({'Error': 'Need email and password'})
    }

    try {
        const admin = await Admin
        .findOne({ email: adminLog.email })
        .lean()
        .exec()

        if (!admin) {
            res.status(400).json({'Error': 'Admin doesn\'t exist'})
        }

        await bcrypt.compare(adminLog.password, admin.password, (err, same) => {
            if (err) {
                throw err
            } else if (!same) {
                res.status(401).json({'Error': 'Incorrect password' })
            } else {
                const newAdmnToken = newAdminToken(admin)
                res.status(200).send({ newAdmnToken, id: admin._id })
            }
        })
    } catch(err) {
        console.error(err)
        res.status(500).json({'Error': 'Loggin the Admin'})
    }
}

const protectAdminRoute = async (req, res, next) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        res.status(401).json({'Error': 'Not authenticated'})
    }
    const bearerArray = bearer.split(' ')
    const tokenAdmin = bearerArray[1].trim()

    if (bearerArray[0] !== 'Bearer') {
        res.status(401).json({'Error': 'Not authenticated'})
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
        res.status(401).json({'Error': 'Not authenticated'})
    }

    const admin = await Admin
    .findById(payload.id)
    .lean()
    .exec()

    if (!admin) {
        res.status(401).json({'Error': 'Not authenticated'})
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