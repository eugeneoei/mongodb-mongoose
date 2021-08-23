const express = require('express')
const app = express()
const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/mongodb-mongoose'
const dbConnection = mongoose.connection
mongoose.connect(
	mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
)
dbConnection.on('error', err => console.log(err.message))
dbConnection.on('connected', err => console.log('Connection to mongoDB successfully!'))
dbConnection.on('disconnected', err => console.log('Broken connection to mongoDB'))
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

app.use(express.json())
// mongoose.set('returnOriginal', false) // global settings such that all updated documents returned are AFTER the update

// // basic
// const tweetsRouter = require('./routers/basic/tweetsRouter')
// const seedsRouter = require('./routers/basic/seedsRouter')
// app.use('/tweets', tweetsRouter)
// app.use('/seeds', seedsRouter)

// advanced
const usersRouter = require('./routers/advance/usersRouter')
const tweetsRouter = require('./routers/advance/tweetsRouter')
const commentsRouter = require('./routers/advance/commentsRouter')
const seedsRouter = require('./routers/advance/seedsRouter')
app.use('/users', usersRouter)
app.use('/tweets', tweetsRouter)
app.use('/comments', commentsRouter)
app.use('/seeds', seedsRouter)

app.listen(3000)
