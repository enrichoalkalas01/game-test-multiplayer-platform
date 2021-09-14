const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    uid: { type: String },
    username: { type: String },
    userdata: { type: Object},
})

const LoginActivity = Mongoose.model('login_activities', Schema)
module.exports = LoginActivity