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
			// .populate({
			// 	path: 'user'
			// })
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

// NOTE:
// should be able to use a "post" hook middleware for "save" method in "Comment" to update tweet document's comments field.
// but somehow, hook is not working. for now, using conventional approach
// to revisit.
router.post('', async (req, res) => {
	try {
		const { userId, tweetId, body } = req.body
		// when a comment is created, we need to
		// 	1. push comment to tweet's comments array
		const newComment = await Comment.create({
			body,
			user: userId,
			tweet: tweetId
		})
		await Tweet.findByIdAndUpdate(
			tweetId,
			{
				$push : {
					comments: newComment._id
				}
			}
		)
		res.redirect(`/tweets/${tweetId}`)
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
		// middlewares are applicable only for some methods
		// note that "findByIdAndDelete" triggers the middleware for "findOneAndDelete". so if you decide to use "findByIdAndDelete" here, it will still work.
		const deletedComment = await Comment.findOneAndDelete({
			_id: req.params.id
		})
		if (deletedComment) {
			res.send('ok')
		} else {
			throw new Error('The Comment you are trying to delete does not exist.')
		}

	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router