const express = require('express')
const User = require('../../models/advance/user')
const Tweet = require('../../models/advance/tweet')
const Comment = require('../../models/advance/comment')
const router = express.Router()

router.get('', async (req, res) => {
	try {
		const tweets = await User.find({})
		res.send(tweets)
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.post('', async (req, res) => {
	try {
		const newUser = await User.create(req.body)
		res.send(newUser)
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/:id', async (req, res) => {
	try {
		// populate tweets by user
		const user = await User.findById(req.params.id)
		if (user) {
			res.send(user)
		} else {
			res.status(404).send('User not found')
		}
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.delete('/:id', async (req, res) => {
	try {
		// there is a "post" hook middleware declared for "findOneAndDelete" method in "User" (refer to user schema)
		// ie whenever, "User" model uses the method "findOneAndDelete", this middleware will be executed
		// middlewares are applicable only for some methods
		// note that "findByIdAndDelete" triggers the middleware for "findOneAndDelete". so if you decide to use "findByIdAndDelete" here, it will still work.
		const deletedUser = await User.findOneAndDelete({
			_id: req.params.id
		})
		if (deletedUser) {
			res.send('Successfully deleted User.')
		} else {
			throw new Error('The User you are trying to delete does not exist.')
		}
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router