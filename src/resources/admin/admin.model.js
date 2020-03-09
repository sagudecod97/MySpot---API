const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, { timestamps: true})

adminSchema.pre('save', function(next) {
    if (!this.isModified('password')) {
        return next()
    }

    bcrypt.hash(this.password, 8, (err, encrypted) => {
        if (err) {
            return next(err)
        } else {
            this.password = encrypted
            next()
        }
    })
})

adminSchema.methods.checkPassword = function(password) {
    const passwordHashed = this.password
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, passwordHashed, (err, same) => {
            if (err) {
                return reject(err)
            } else {
                resolve(same)
            }
        })
    })
}

module.exports = mongoose.model('admin', adminSchema)