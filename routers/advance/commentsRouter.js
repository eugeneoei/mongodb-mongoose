const express = require('express')
const Comment = require('../../models/advance/comment')
const Tweet = require('../../models/advance/tweet')
const User = require('../../models/advance/user')
// const utils = require('../utils/commentUtils')
// const commentsGenerator = require('../seed/commentsGenerator')
// const commentsSeed = require('../seed/commentsSeed')

const router = express.Router()

// router.get('/clear', async (req, res) => {
// 	try {
// 		await utils.clearCommentCollection(Comment)
// 		res.send('ok')
// 	} catch (e) {
// 		res.status(400).send({
// 			name: e.name,
// 			message: e.message
// 		})
// 	}
// })

// router.get('/generate', async (req, res) => {
// 	try {
// 		await commentsGenerator.generateRandomTweets()
// 		res.send('ok')
// 	} catch (e) {
// 		res.status(400).send({
// 			name: e.name,
// 			message: e.message
// 		})
// 	}
// })

// router.get('/clear-and-seed', async (req, res) => {
// 	try {
// 		await utils.clearAndSeedCollection(Comment, commentsSeed)
// 		res.send('ok')
// 	} catch (e) {
// 		res.status(400).send({
// 			name: e.name,
// 			message: e.message
// 		})
// 	}
// })

router.get('', async (req, res) => {
	try {
		res.send(await Comment.find({}))
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

		// delete comment from collection and but to delete from tweet's comments array??

		// find comment to delete, populate tweet field to get tweet id
		// delete comment from Comment collection
		// delete comment from Tweet collection

		// const commentToDelete = await Comment.findById(req.params.id)

		const deleteResponse = await Comment.findByIdAndDelete(req.params.id)
		if (!deleteResponse) {
			throw new Error('The comment you are trying to delete does not exist.')
		}

		const updatedTweet = await Tweet.findByIdAndUpdate(
			req.body.tweetId,
			{
				$pull: {
					'comments._id': {
						$eq: req.body.tweetId
					}
				}
			},
			{
				new: true
			}
		)

		res.redirect(`/tweets/${tweetId}`)


		// // find all the burgers with pickles (or a topping you used more than once) and remove the pickles
		// db.burger.updateMany(
		// 	{
		// 		toppings: {
		// 			$all:
		// 				['pickles']
		// 		}
		// 	},
		// 	{
		// 		$pull: {
		// 			toppings: {
		// 				$in: ['pickles']
		// 			}
		// 		}
		// 	}
		// )

	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router