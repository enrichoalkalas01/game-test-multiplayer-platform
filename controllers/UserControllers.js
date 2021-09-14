const Express = require('express')
const App = Express()
const Cryptr = require('cryptr');
const CryptrF = new Cryptr('SecretKey');

// Controllers
const JWTCheck = require('./JWTCheck')

// Models
const UserModels = require('../Mongo/Models/Users')
const LoginActivityModels = require('../Mongo/Models/LoginActivity')

const Register = (req, res) => {
    // Find First Data, If Not Match, Create The Data
    UserModels.find({ 'username' : req.body.username }).then(ResFind => {
        console.log(ResFind)
        if ( ResFind.length != 0 ) {
            res.send({ message: `Failed to register data, data was match here..`, status: 400 })
        } else {
            const User = new UserModels({
                username: req.body.username,
                password: CryptrF.encrypt(req.body.password),
                fullname: req.body.fullname,
                age: req.body.age,
                address: req.body.address,
                email: req.body.email
            })
    
            User.save(User).then(response => {
                res.send({
                    message: `Successfull to create user data`,
                    data: response,
                    status: 200,
                })
            }).catch(err => {
                console.log(err)
                res.send({
                    message: `Failed to create user data`,
                    status: 500
                })
            })
        }

    }).catch(err => {
        res.send({
            message: `Failed to find data`,
            status: 500
        })
    })
}

const Login = (req, res) => {
    UserModels.findOne({ 'username': req.body.username }).then(ResFind => {
        if ( ResFind == null ) {
            res.send({ message: `user is not found`, status: 401 })
        } else {
            if ( req.body.password != CryptrF.decrypt(ResFind.password) ) {
                res.send({ message: `username or password is not match`, status: 403 })
            } else {
                // Checking Login Activity
                LoginActivityModels.findOne({ 'username': ResFind.username }).then(ResLogAct => {
                    if ( ResLogAct != null ) {
                        console.log('login activity is not null')
                        res.send({ message: `Successfull to login`, status: 200, data: ResLogAct.userdata })
                    } else {
                        console.log('login activity is null')
                        // Create Token
                        let Token = JWTCheck.Create({ uid: ResFind._id, username: ResFind.username, fullname: ResFind.fullname, email: ResFind.email })
                        let DataPassing = {
                            uid: ResFind._id,
                            username: ResFind.username,
                            fullname: ResFind.fullname,
                            email: ResFind.email,
                            age: ResFind.age,
                            address: ResFind.address,
                            token_type: 'Bearer',
                            token: Token,
                        }

                        const LoginActivityData = new LoginActivityModels({
                            uid: ResFind._id,
                            username: ResFind.username,
                            userdata: DataPassing,
                        })

                        LoginActivityData.save(LoginActivityData).then(ResLogActCreate => {
                            res.send({ message: `Successfull to login`, status: 200, data: DataPassing })
                        }).catch(err => {
                            res.send({ message: `Failed to create login activities`, status: 500 })
                        })
                    }
                }).catch(err => {
                    res.send({ message: `Failed to find login activities`, status: 500 })
                })
            }
        }
    }).catch(err => {
        res.send({ message: `Failed to find data`, status: 500 })
    })
}

const Logout = (req, res) => {
    console.log(req.body)

    let TokenAuth = req.headers.authorization.split(' ')
    if ( TokenAuth[0].toLowerCase() !== 'bearer' ) {
        res.send({ message: `failed, dont have authorization`, status: 403 })
    } else {
        let TokenCheck = JWTCheck.Check(TokenAuth[1])
        if ( TokenCheck.data.uid !== req.body.uid ) {
            res.send({ message: `failed to logout user, wrong id`, status: 401 })
        } else {
            LoginActivityModels.deleteOne({ 'uid': req.body.uid }).then(response => {
                res.send({ message: `Successfull to logout user`, status: 200 })
            }).catch(err => {
                res.send({ message: `failed to logout user, wrong id`, status: 401 })
            })
        }
    }
}

const OnlineStatus = (req, res) => {
    LoginActivityModels.find().select([
        'userdata.username',
        'userdata.fullname',
        'userdata.age',
        'userdata.address'
    ]).then(response => {
        res.send(response)
    }).catch(err => {
        console.log(err)
    })
}

exports.Register = Register
exports.Login = Login
exports.Logout = Logout
exports.OnlineStatus = OnlineStatus