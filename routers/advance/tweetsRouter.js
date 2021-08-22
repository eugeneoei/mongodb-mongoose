const express = require('express')
const validateReactions = require('../../middlewares/validateReactions')
const Tweet = require('../../models/advance/tweet')
const User = require('../../models/advance//user')

const router = express.Router()

router.get('', async (req, res) => {
	try {

		// Requirement 1
		const page = 1
		const resultsPerPage = 5
		const tweets = await Tweet.find(
			{}
		)
		.populate([
			{
				path: 'user',
				select: ['_id', 'email', 'firstName', 'lastName']
			},
			{
				path: 'comments',
				select: ['_id', 'body'], // or '_id body'
				populate: {
					path: 'user',
					select: ['_id', 'email', 'firstName', 'lastName']
				},
				options: {
					// "skip" and "limit" in options to paginate ref documents
					skip: resultsPerPage * (page - 1),
					limit: resultsPerPage
				}
			}
		])
		res.send(tweets)

		// // Requirement 2
		// const tweets = await Tweet.find(
		// 	{}
		// )
		// .populate([
		// 	{
		// 		path: 'user',
		// 		select: ['_id', 'email', 'firstName', 'lastName']
		// 	},
		// 	{
		// 		path: 'comments',
		// 		select: ['_id', 'body'], // or '_id body'
		// 		populate: {
		// 			path: 'user',
		// 			// if match fails, populated "user" field returns null.
		// 			// likely not a good way to filter ref documents?
		// 			match: {
		// 				'email': {
		// 					$eq: 'thanos.titan@email.com'
		// 				}
		// 			},
		// 			select: ['_id', 'email', 'firstName', 'lastName'],
		// 		}
		// 	}
		// ])
		// res.send(tweets)

		// // Requirement 3
		// const tweets = await Tweet.find(
		// 	{}
		// )
		// .populate([
		// 	{
		// 		path: 'user',
		// 		select: ['_id', 'email', 'firstName', 'lastName']
		// 	},
		// 	{
		// 		path: 'comments',
		// 		select: ['_id', 'body'], // or '_id body'
		// 		populate: {
		// 			path: 'user',
		// 			// similarly, if match fails, field will return null
		// 			match: {
		// 				email: {
		// 					$in: [
		// 						'steve.rogers@email.com',
		// 						'black.panther@email.com'
		// 					]
		// 				}
		// 			},
		// 			select: '_id email firstName lastName'
		// 		}
		// 	}
		// ])
		// res.send(tweets)

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/:id', async (req, res) => {
	try {

		// Requirement 1
		const tweet = await Tweet.findById(
			req.params.id
		)
		.populate({
			path: 'user',
			select: 'firstName lastName email'
		})
		res.send(tweet)

		// // Requirement 2
		// const tweet = await Tweet.findById(
		// 	req.params.id
		// )
		// .populate([
		// 	{
		// 		path: 'user',
		// 		select: 'firstName lastName email'
		// 	},
		// 	{
		// 		path: 'comments',
		// 		select: ['body', '_id'],
		// 		populate: {
		// 			path: 'user',
		// 			select: ['_id', 'email', 'firstName', 'lastName']
		// 		}
		// 	}
		// ])
		// res.send(tweet)

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.post('', async (req, res) => {
	try {
		const { title, body, userId } = req.body
		const tweet = await Tweet.create({
			title,
			body,
			user: userId
		})
		res.redirect(`/tweets/${tweet['_id']}`)
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.delete('/:id', async (req, res) => {
	try {
		// there is a "post" hook middleware declared for "findOneAndDelete" method in "Tweet" (refer to tweet schema)
		// ie whenever, "Tweet" model uses the method "findOneAndDelete", this middleware will be executed
		// middlewares are applicable only for some methods
		// note that "findByIdAndDelete" triggers the middleware for "findOneAndDelete". so if you decide to use "findByIdAndDelete" here, it will still work.
		const deletedTweet = await Tweet.findOneAndDelete({
			_id: req.params.id
		})
		if (deletedTweet) {
			res.send('Successfully deleted tweet.')
		} else {
			throw new Error('The tweet you are trying to delete does not exist.')
		}
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router