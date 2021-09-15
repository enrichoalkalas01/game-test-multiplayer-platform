const Express = require('express')
const Routes = Express.Router()

// Controllers
const UserControllers = require('../controllers/UserControllers')

// API Services
Routes.post('/users/login', UserControllers.Login)
Routes.post('/users/register', UserControllers.Register)
Routes.post('/users/logout', UserControllers.Logout)
Routes.get('/users/online', UserControllers.OnlineStatus)


// Normal Routes
Routes.get('/', (req, res) => { res.render('index') })
Routes.get('/login', (req, res) => { res.render('login') })
Routes.get('/logout', (req, res) => { res.render('logout') })
Routes.get('/online-users', (req, res) => { res.render('online_users') })

module.exports = Routes

// Tester List User
// Username : enrichoalkalas
// Password : admin123