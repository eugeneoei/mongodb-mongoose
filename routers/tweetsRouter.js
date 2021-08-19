const express = require('express')
const Tweet = require('../schemas/tweet')
const tweetsGenerator = require('../seed/tweetsGenerator')
const User = require('../schemas/user')
const validateReactions = require('../middlewares/validateReactions')
const utils = require('../utils/tweetUtils')

const router = express.Router()

router.get('/clear', async (req, res) => {
	try {
		await utils.clearTweetCollection(Tweet)
		res.send('ok')
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/generate', async (req, res) => {
	try {
		await tweetsGenerator.generateRandomTweets()
		res.send('ok')
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/clear-and-seed', async (req, res) => {
	try {
		await utils.clearAndSeedTweetCollection(Tweet)
		res.send('ok')
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

// // https://docs.mongodb.com/manual/core/aggregation-pipeline/
// // https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
// // https://docs.mongodb.com/manual/reference/operator/aggregation/
// // https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/
// router.get('/aggregate', async (req, res) => {
// 	try {

// 		// const aggregatedResults = await Tweet.aggregate([
// 		// 	{
// 		// 		$addFields: {
// 		// 			netReactions: {
// 		// 				$subtract: ['$reactions.likes', '$reactions.dislikes']
// 		// 			},
// 		// 			secondsSinceCreation: {
// 		// 				$subtract: [new Date().getTime(), '$createdAt']
// 		// 			}
// 		// 		}
// 		// 	},
// 		// 	{
// 		// 		$addFields: {
// 		// 			daysSinceCreation: {
// 		// 				// use $function to defined custom aggregation expressions???
// 		// 				'$divide': ['$secondsSinceCreation', 86400000]
// 		// 			}
// 		// 		}
// 		// 	},
// 		// 	{
// 		// 		$addFields: {
// 		// 			daysSinceCreation: {
// 		// 				$floor: '$daysSinceCreation'
// 		// 			}
// 		// 		}
// 		// 	}
// 		// ])
// 		// res.send(aggregatedResults)


// 		const aggregatedResults = await Tweet.aggregate([
// 			{
// 				$match: {
// 					author: 'Steve Rogers'
// 				}
// 			},
// 			{
// 				$limit: 10
// 			}
// 		])
// 		res.send(aggregatedResults)


// 		// const tweets = await Tweet.aggregate([
// 		// 	{
// 		// 		$match: {
// 		// 			'reactions.likes': {
// 		// 				$gte: 50
// 		// 			}
// 		// 		}	
// 		// 	}
// 		// ])
// 		// console.log(tweets.length)
// 		// res.send(tweets)
// 	} catch(e) {
// 		res.status(400).send({
// 			name: e.name,
// 			message: e.message
// 		})
// 	}
// })

router.get('', async (req, res) => {
	try {

		// // https://mongoosejs.com/docs/api/model.html#model_Model.populate
		// const page = 1
		// const resultsPerPage = 2
		// const tweets = await Tweet.find(
		// 	{},
		// 	'title'
		// )
		// .populate({
		// 	path: 'comments',
		// 	// perDocumentLimit: 3, // <-- limits number of ref results
		// 	// limit: 2,
		// 	// match: {
		// 	// 	author: {
		// 	// 		$eq: 'This is a comment author 2'
		// 	// 	}
		// 	// },
		// 	select: ['author', 'body'],
		// 	// // transform is like map
		// 	// transform: comment => {
		// 	// 	console.log(comment)
		// 	// 	return comment
		// 	// 	// return {
		// 	// 	// 	...comment,
		// 	// 	// 	body: `${comment.body} transformed`
		// 	// 	// }
		// 	// }
		// 	// options: {
		// 	// 	skip: resultsPerPage * (page - 1),
		// 	// 	limit: resultsPerPage
		// 	// }
		// })
		// .limit(2) // <-- limits number of tweets 
		// // .select('title').populate('author')
		// res.send(tweets)


		const tweets = await Tweet.find(
			{}
		)
		.populate([
			{
				path: 'user'
			},
			{
				path: 'user.tweets'
			}
		])
		res.send(tweets)

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/:id', async (req, res) => {
	try {

		// const tweet = await Tweet.findById(req.params.id)
		// if (tweet) {
		// 	res.send(tweet)
		// } else {
		// 	res.status(404).send('Tweet not found')
		// }

		const tweet = await Tweet.findById(
			req.params.id
		)
		// .populate(
		// 	{
		// 		path: 'user',
		// 		select: ['firstName', 'lastName', '_id']
		// 	}
		// )
		// .populate(
		// 	{
		// 		path: 'comments',
		// 		select: ['body', '_id']
		// 	}
		// )
		.populate([
			{
				path: 'user',
				select: ['firstName', 'lastName', '_id']
			},
			{
				path: 'comments',
				select: ['body', '_id'],
				populate: {
					path: 'user',
					select: ['firstName', 'lastName', '_id']
				}
			}
		])
		res.send(tweet)


		// // https://mongoosejs.com/docs/api/model.html#model_Model.populate
		// const page = 2
		// const resultsPerPage = 2
		// const tweet = await Tweet.findById(
		// 	req.params.id,
		// 	'title'
		// )
		// .populate({
		// 	path: 'comments',
		// 	// // "perDocumentLimit" limits number of ref documents. doesnt allow for pagination
		// 	// perDocumentLimit: resultsPerPage,

		// 	// "match" to filter ref documents
		// 	match: {
		// 		author: {
		// 			$eq: 'This is a comment author 2'
		// 		}
		// 	},

		// 	select: ['author', 'body'],
		// 	options: {
		// 		// "skip" and "limit" in options to paginate ref documents
		// 		skip: resultsPerPage * (page - 1),
		// 		limit: resultsPerPage
		// 	}
		// })
		// if (tweet) {
		// 	res.send(tweet)
		// } else {
		// 	res.status(404).send('Tweet not found')
		// }
		// // .populate({
		// // 	path: 'comments',
		// // 	// perDocumentLimit: 3,
		// // 	// limit: 2,
		// // 	// match: {
		// // 	// 	author: {
		// // 	// 		$eq: 'This is a comment author 2'
		// // 	// 	}
		// // 	// },
		// // 	select: ['author', 'body'],
		// // 	// // transform is like map
		// // 	// transform: comment => {
		// // 	// 	console.log(comment)
		// // 	// 	return comment
		// // 	// 	// return {
		// // 	// 	// 	...comment,
		// // 	// 	// 	body: `${comment.body} transformed`
		// // 	// 	// }
		// // 	// }
		// // 	options: {
		// // 		skip: resultsPerPage * (page - 1),
		// // 		limit: resultsPerPage
		// // 	}
		// // })
		// // .limit(2)
		// // // .select('title').populate('author')
		// // res.send(tweets)


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

		const user = await User.findById(userId)

		// attach user to tweet
		const tweet = await Tweet.create({
			title,
			body,
			user
		})

		// attach tweet to user
		await User.findByIdAndUpdate(
			userId,
			{
				$push: {
					tweets: tweet
				}
			}
		)
		res.redirect(`/tweets/${tweet['_id']}`)
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.patch('/:id/reactions', validateReactions, async (req, res) => {
	try {
		const type = req.body.type
		const action = req.body.action
		const tweet = await Tweet.findById(req.params.id)
		const typeCurrentCount = tweet.reactions[type]
		if (action === 'decrement' && typeCurrentCount < 1) {
			res.send(tweet)
		} else {
			const path = `reactions.${type}`
			const incrementValue = action === 'increment' ? 1 : -1
			const updatedTweet = await Tweet.findByIdAndUpdate(
				req.params.id,
				{
					// $inc means increment
					$inc: {
						// updating a nested document
						[path]: incrementValue
					}
				},
				{
					new: true
				}
			)
			if (updatedTweet) {
				res.send(updatedTweet)
			} else {
				throw new ReferenceError('Tweet you are trying to update does not exist')
			}
		}
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.patch('/:id', async (req, res) => {
	try {
		// METHOD 1
		const updatedTweet = await Tweet.findOneAndUpdate(
			{ _id: req.params.id },
			{
				title: `${req.body.title} using "findOneAndUpdate" method using HTTP PATCH`
			},
			{
				new: true
			}
		)
		if (updatedTweet) {
			res.send(updatedTweet)
		} else {
			throw new Error('Tweet you are trying to update does not exist.')
		}

		// // METHOD 2
		// const updatedTweet = await Tweet.findByIdAndUpdate(
		// 	req.params.id,
		// 	{
		// 		title: `${req.body.title} using "findByIdAndUpdate" method using HTTP PATCH`
		// 	},
		// 	{
		// 		new: true
		// 	}
		// )
		// if (updatedTweet) {
		// 	res.send(updatedTweet)
		// } else {
		// 	throw new Error('Tweet you are trying to update does not exist.')
		// }

		// // METHOD 3
		// const updatedTweet = await Tweet.updateOne(
		// 	{ _id: req.params.id },
		// 	{
		// 		title: `${req.body.title} using "updateOne" method using HTTP PATCH`
		// 	}
		// )
		// if (updatedTweet.nModified === 1) {
		// 	res.send('Tweet updated using "updateOne" method using HTTP PATCH')
		// } else {
		// 	throw new Error('Tweet you are trying to update does not exist.')
		// }

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})


router.put('/:id', async (req, res) => {
	try {
		// METHOD 1
		const updatedTweet = await Tweet.findOneAndReplace(
			{ _id: req.params.id },
			req.body,
			{
				new: true
			}
		)
		if (updatedTweet) {
			res.send(updatedTweet)
		} else {
			throw new Error('Tweet you are trying to update does not exist.')
		}

		// // METHOD 2
		// const updatedTweet = await Tweet.replaceOne(
		// 	{ _id: req.params.id },
		// 	req.body
		// )
		// if (updatedTweet.nModified === 1) {
		// 	res.send('Tweet updated using "replaceOne" method using HTTP PUT')
		// } else {
		// 	throw new Error('Tweet you are trying to update does not exist.')
		// }

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.delete('/:id', async (req, res) => {
	try {
		
		// // METHOD 1
		// const deleteResponse = await Tweet.deleteOne({
		// 	_id: req.params.id
		// })
		// console.log(deleteResponse)
		// if (deleteResponse.deletedCount === 1) {
		// 	res.send('Successfully deleted tweet using "deleteOne" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "deleteOne" method does not exist.')
		// }

		// // METHOD 2
		// const deleteResponse = await Tweet.findOneAndDelete({
		// 	_id: req.params.id
		// })
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findOneAndDelete" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "findOneAndDelete" method does not exist.')
		// }

		// METHOD 3
		const deleteResponse = await Tweet.findByIdAndDelete(req.params.id)
		console.log(deleteResponse)
		if (deleteResponse) {
			res.send('Successfully deleted tweet using "findByIdAndDelete" method.')
		} else {
			throw new Error('The tweet you are trying to delete using "findByIdAndDelete" method does not exist.')
		}

		// // METHOD 4
		// const deleteResponse = await Tweet.findOneAndRemove({
		// 	_id: req.params.id
		// })
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findOneAndRemove" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "findOneAndRemove" method does not exist.'
		// }

		// // METHOD 5
		// const deleteResponse = await Tweet.findByIdAndRemove(req.params.id)
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findByIdAndRemove" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "findByIdAndRemove" method does not exist.'
		// }

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

module.exports = router