const Mongoose = require('mongoose')
const LinkMongo = "mongodb+srv://learnbinar:admin123@learnmongo0.sggui.mongodb.net/LearnMongo0?retryWrites=true&w=majority"
const Link = "mongodb+srv://learnbinar:admin123@learnmongo0.sggui.mongodb.net/GameTest?retryWrites=true&w=majority"
const ConnectDB = async () => {
    try {
        const Conn = await Mongoose.connect(
            Link,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useFindAndModify: false,
                // useCreateIndex: true,
            }
        )

        console.log(`Success To Connect Mongo DB ${ Conn.connection.host }`)
    } catch {
        console.log(error)
        process.exit(1)
    }
}

module.exports = ConnectDB