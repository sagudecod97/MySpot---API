const User = require('../src/resources/user/user.model')
const JWT = require('jsonwebtoken')

// Secrets
const USR_JWT_SCRT = process.env.USR_JWT_SCRT
const ADM_JWT_SCRT = process.env.ADM_JWT_SCRT

// Expires
const USER_EXPRS = process.env.USER_EXPRS
const ADMIN_EXPRS = process.env.USER_ADM

// Create token && Verify token -- Admin and User
const newTokenUser = (user) => {
    return JWT.sign({ id: user._id }, USR_JWT_SCRT, {
        expiresIn: USER_EXPRS
    })
}

const verifyUserToken = (token) => {
    new Promise((res, rej) => {
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

        const newUserToken = newTokenUser(user)
        res.status(201).send({ newUserToken }).json({data: user})
    } catch(err) {
        console.error(err)
        res.status(400).json({'Error': 'Signin up the user'})
    }
}

const LoginUser = async (req, res) => {
    const userLog = req.body
    if (!userLog.userName || !userLog.password) {
        res.status(400).json({'Error': 'Need user-name and password'})
    }

    try {
        const user = await User
        .findById(req.params.id)
        .lean()
        .exec()

        if (!user) {
            res.status(400).json({'Error': 'User id doesn\'t not exist'})
        }

        const passwordMatch = await user.checkPassword(userLog.password)

        if (!passwordMatch) {
            res.status(401).json({'Error': 'Invalid password or user-name'})
        }

        const newUserToken = newTokenUser(user)
        res.status(200).send({ newUserToken }).json({data: user})
    } catch(err) {
        console.error(err)
        res.status(500).json({'Error': 'Login the user'})
    }
}

const protectUserRoute = async (req, res, next) => {
    const bearer = req.headers.authorization
    const bearerArray = bearer.split(' ')
    const tokenUser = bearerArray[1].trim()

    if (!bearer || bearerArray[0] !== 'Bearer') {
        res.status(401).json({'Error': 'Not authenticated'})
    }

    let payload
    try {
        payload = await verifyUserToken(tokenUser)
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

    next()
}

module.exports = {
    newTokenUser,
    verifyUserToken,
    singUpUser,
    LoginUser,
    protectUserRoute,
    newAdminToken,
    verifyAdminToken,
}