const mongoose = require('mongoose')
const  bcrypt = require('bcrypt')

// Creates the User schemas with its required properties
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

// Makes use of the save event, to encrypt the password before saving
userSchema.pre('save', function(next) {
    if (!this.isModified('password')) { // Checks if the password field has been modified
        return next()
    }

    bcrypt.hash(this.password, 8, (err, hash) => { // Encrypts the password
        if (err) {
            return next(err)
        } else {
            this.password = hash
            next()
        }
    })
})

// Checks the user password
userSchema.methods.checkPassword = function(password) {
    const passwordHashed = this.password
    return new Promise((resolve, reject) => { // Returns a promise, that it's gonna resolve if both are the same
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
