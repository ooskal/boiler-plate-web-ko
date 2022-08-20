const { User } = require('../models/User');

//인증처리
let auth = (req, res, next) => {

    let token = req.cookies.x_auth;

    User.findByToken(token, (err,user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth:false, error: true })
    })

}

module.exports = { auth };