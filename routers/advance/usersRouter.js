const express = require('express')
const User = require('../../models/advance/user')
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
		// after deleting user,
		// delete all comments written by this user?
		// delete all tweets written by this user?
		await User.findByIdAndDelete(req.params.id)
		if (deleteResponse) {
			// if user has been successfully deleted,
			// delete all tweets and comments by this user
			// remove userid from tweet's comments array
			await Tweet.deleteMany({
				'user._id': {
					$eq: req.params.id
				}
			})
			// await Tweet.updateMany(
			// 	{
			// 		'user._id': {
			// 			$eq: req.params.id
			// 		}
			// 	}
			// )
			await Comment.deleteMany({
				'user._id': {
					$eq: req.params.id
				}
			})

			// {
			// 	$pull: {
			// 		'comments._id': {
			// 			$eq: req.body.tweetId
			// 		}
			// 	}
			// }
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