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
// app.use('/tweets', tweetsRouter)

// advanced
const usersRouter = require('./routers/advance/usersRouter')
const tweetsRouter = require('./routers/advance/tweetsRouter')
const commentsRouter = require('./routers/advance/commentsRouter')
const seedsRouter = require('./routers/advance/seedsRouter')
app.use('/users', usersRouter)
app.use('/tweets', tweetsRouter)
app.use('/comments', commentsRouter)
app.use('/seeds', seedsRouter)

// const users = [
// 	{
// 		firstName: 'Tony',
// 		lastName: 'Stark'
// 	},
// 	{
// 		firstName: 'Peter',
// 		lastName: 'Parker'
// 	},
// 	{
// 		firstName: 'Natasha',
// 		lastName: 'Romanoff'
// 	},
// 	{
// 		firstName: 'Steve',
// 		lastName: 'Rogers'
// 	},
// 	{
// 		firstName: 'Clint',
// 		lastName: 'Barton'
// 	},
// 	{
// 		firstName: 'Bruce',
// 		lastName: 'Banner'
// 	},
// 	{
// 		firstName: 'Thor',
// 		lastName: 'Odinson'
// 	},
// 	{
// 		firstName: 'Loki',
// 		lastName: 'Odinson'
// 	},
// 	{
// 		firstName: 'Thanos',
// 		lastName: 'Titan'
// 	},
// 	{
// 		firstName: 'Vision',
// 		lastName: 'V'
// 	},
// 	{
// 		firstName: 'Wanda',
// 		lastName: 'Maximoff'
// 	},
// 	{
// 		firstName: 'Nick',
// 		lastName: 'Fury'
// 	},
// 	{
// 		firstName: 'Pepper',
// 		lastName: 'Potts'
// 	},
// 	{
// 		firstName: 'Black',
// 		lastName: 'Panther'
// 	},
// 	{
// 		firstName: 'Sam',
// 		lastName: 'Wilson'
// 	},
// 	{
// 		firstName: 'James',
// 		lastName: 'Rhodes'
// 	},
// 	{
// 		firstName: 'Mary',
// 		lastName: 'Jane'
// 	},
// 	{
// 		firstName: 'Scott',
// 		lastName: 'Lang'
// 	},
// 	{
// 		firstName: 'Bucky',
// 		lastName: 'Barnes'
// 	},
// 	{
// 		firstName: 'Hope',
// 		lastName: 'Pym'
// 	}
// ]

// app.get('', async (req, res) => {
// 	// const array = [...Array(200).keys()]
// 	// const promises = array.map(async () => ({
// 	// 	body: await getRandomComment()
// 	// }))
// 	// const comments = await Promise.all(promises)
// 	// res.send(comments)
// 	res.send(
// 		users.map(user => ({
// 			...user,
// 			email: `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@email.com`
// 		}))
// 	)
// })

app.listen(3000)
