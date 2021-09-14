const Express = require('express')
const App = Express()
const Dotenv = require('dotenv')
const Morgan = require('morgan')
const BodyParser = require('body-parser')

const PORT = 7777

// Routes
const Routes = require('./routes/routes')

// Logs
App.use(Morgan('dev'))
App.use(BodyParser.urlencoded({extended: true}))
App.use(BodyParser.json())

// Database
const ConnectDB = require('./Mongo/Config/Connection')
ConnectDB()

// Assets
App.use(Express.static('public'))
App.set('view engine', 'ejs')

App.listen(PORT, () => { console.log(`Server is running in port ${ PORT }`) })
App.use(Routes)