const express = require('express')
const Comment = require('../../models/advance/comment')
const Tweet = require('../../models/advance/tweet')
const User = require('../../models/advance/user')
const router = express.Router()

router.get('', async (req, res) => {
	try {
		res.send(
			await Comment.find(
				{}
			)
			.populate({
				path: 'user'
			})
		)
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/:id', async (req, res) => {
	try {
		// res.send(await Comment.find({}))
		const comment = await Comment.findById(req.params.id)
		if (comment) {
			res.send(comment)
		} else {
			res.status(404).send('Comment not found')
		}
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.post('', async (req, res) => {
	// attach user and tweet to comment
	// attach comment to tweet


	console.log('hi')
	// create comment in db and update tweet's comments with new comment

	try {

		const { userId, tweetId, body } = req.body

		const user = await User.findById(userId)
		const tweet = await Tweet.findById(tweetId)

		const newComment = await Comment.create({
			body,
			user,
			tweet
		})
		
		const updatedTweet = await Tweet.findByIdAndUpdate(
			tweetId,
			{
				$push : {
					comments: newComment
				}
			},
			{
				new: true
			}
		)

		res.redirect(`/tweets/${tweetId}`)

		// if (updatedTweet) {
		// 	res.send(updatedTweet)
		// } else {
		// 	throw new Error('Something went wrong when creating a new comment')
		// }
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.delete('/:id', async (req, res) => {
	try {
		// there is a "post" hook middleware declared for "findOneAndDelete" in "Comment" (refer to comment schema)
		// ie whenever, "Comment" model uses the method "findOneAndDelete", this middleware will be executed
		// note that middlewares can only be used for some methods
		const deleteResponse = await Comment.findOneAndDelete({
			_id: req.params.id
		})
		if (!deleteResponse) {
			throw new Error('The comment you are trying to delete does not exist.')
		}
		res.send('ok')

	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router