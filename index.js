const express = require('express')
const app = express()
const mongoose = require('mongoose')
const tweetsRouter = require('./routers/tweetsRouter')

const mongoURI = 'mongodb://localhost:27017/tweets'
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

app.use(express.json())
// mongoose.set('returnOriginal', false) // global settings such that all updated documents returned are AFTER the update

app.use('/tweets', tweetsRouter)

app.listen(3000)
