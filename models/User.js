const mongoose = require('mongoose');

const userSchma = mongoose.Schema({
    name: {
        type: String,
        minlength:5
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default:0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }

})

const User = mongoose.model('user', userSchma)

module.exports = { User }