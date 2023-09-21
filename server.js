require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const cors = require('cors')

const userController = require('./controllers/user')
const noteController = require('./controllers/note')

port = 3001

//Connection to database
mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(
    console.log('mongoDB is connected successfully')
).catch((err) => {
    console.log(err)
    console.log('could not connect to database')
})

//midllewares
app.use(express.json())
app.use(cors())

//controllers
app.use('/users', userController)
app.use('/notes', noteController)

app.listen(process.env.PORT || port,
    console.log(`server is listening on port ${port}`)
)