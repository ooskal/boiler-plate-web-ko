const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

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


userSchma.pre('save', function ( next ) {
    var user = this;
    if(user.isModified('password')) {

    //비밀번호 암호화
    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, function (err, hash) {
            if(err) return next(err)
            user.password = hash
            next()
            // Store ha sh in your password DB.
        })
    })
    } else {
        next()
    }
})


userSchma.methods.comparePassword = function (plainPassword, cb) {

    //plainPassword 암호화된 비밀번호가 맞는지 비교해야 함
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err)
            cb(null,isMatch)
    })
}

userSchma.methods.generateToken = function(cb) {

    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){

        if(err) return cb(err)
        cb(null, user)
    })

}

userSchma.statics.findByToken = function (token, cb) {
    var user = this;

    user._id + '' = token

    jwt.verify(token, 'secretToken', function(err, decoded) {

        user.findOne({"_id": decoded, "token": token }, function(err,user){

            if (err) return cb(err);
            cb(null, user)

        })
    })



}

const User = mongoose.model('User', userSchma)

module.exports = { User }