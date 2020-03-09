const mongoose = require('mongoose')
const  bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    userName: {
        required: true,
        type: String,
        maxLength: 40,
        unique: true
    },
    phone: {
        required: true,
        type: String,
        maxLength: 10,
        minLength: 10
    },
    email: {
        required: true,
        type: String,
        unique: true
    },
    password: {
        required: true,
        type: String,
    }
}, { timestamps: true})

userSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    bcrypt.hash(this.password, 8, (err, hash) => {
        if (err) {
            return next(err)
        } else {
            this.password = hash
            next()
        }
    })
})

userSchema.methods.checkPassword = function(password) {
    const passwordHashed = this.password
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHashed, (err, equal) => {
            if (err) {
                return reject(err)
            } else {
                resolve(equal)
            }
        })
    })
}

module.exports = mongoose.model('users', userSchema)