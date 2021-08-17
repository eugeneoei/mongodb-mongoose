const express = require('express')
const Tweet = require('../schemas/tweet')
const validateReactions = require('../middlewares/validateReactions')
const utils = require('../utils/utils')
const tweetsGenerator = require('../seed/tweetsGenerator')

const router = express.Router()

router.get('/clear', async (req, res) => {
	try {
		await utils.clearDataBase(Tweet)
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
		await utils.clearAndSeedDatabase(Tweet)
		res.send('ok')
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/aggregate', async (req, res) => {
	try {

		// const aggregatedResults = await Tweet.aggregate([
		// 	{
		// 		$addFields: {
		// 			netReactions: {
		// 				$subtract: ['$reactions.likes', '$reactions.dislikes']
		// 			},
		// 			secondsSinceCreation: {
		// 				$subtract: [new Date().getTime(), '$createdAt']
		// 			}
		// 		}
		// 	},
		// 	{
		// 		$addFields: {
		// 			daysSinceCreation: {
		// 				// use $function to defined custom aggregation expressions???
		// 				'$divide': ['$secondsSinceCreation', 86400000]
		// 			}
		// 		}
		// 	},
		// 	{
		// 		$addFields: {
		// 			daysSinceCreation: {
		// 				$floor: '$daysSinceCreation'
		// 			}
		// 		}
		// 	}
		// ])
		// res.send(aggregatedResults)


		const aggregatedResults = await Tweet.aggregate([
			{
				$match: {
					author: 'Steve Rogers'
				}
			},
			{
				$limit: 10
			}
		])
		res.send(aggregatedResults)


		// const tweets = await Tweet.aggregate([
		// 	{
		// 		$match: {
		// 			'reactions.likes': {
		// 				$gte: 50
		// 			}
		// 		}	
		// 	}
		// ])
		// console.log(tweets.length)
		// res.send(tweets)
	} catch(e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('', async (req, res) => {
	try {
		// Requirement 1
		const tweets = await Tweet.find({})
		res.send(tweets)

		// // Requirement 2 method 1
		// const tweets = await Tweet.find(
		// 	{
		// 		'reactions.likes': {
		// 			$gte: 50
		// 		}
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 2 method 2
		// await Tweet
		// 	.where('reactions.likes')
		// 	.gte(50)
		// 	.then(tweets => {
		// 		console.log(tweets.length)
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})
		
		// // Requirement 3 method 1
		// const tweets = await Tweet.find(
		// 	{
		// 		'reactions.likes': {
		// 			$gte: 40,
		// 			$lte: 60
		// 		}
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 3 method 2
		// const tweets = await Tweet.find(
		// 	{
		// 		$and: [
		// 			{
		// 				'reactions.likes': {
		// 					$gte: 40
		// 				}
		// 			},
		// 			{ 
		// 				'reactions.likes': {
		// 					$lte: 60
		// 				}
		// 			}
		// 		]
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 3 method 3
		// await Tweet
		// 	.where('reactions.likes')
		// 	.gte(40)
		// 	.lte(60)
		// 	.then(tweets => {
		// 		console.log(tweets.length)
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})

		// // Requirement 4 - method 1
		// const tweets = await Tweet.find(
		// 	{
		// 		'reactions.likes': {
		// 			$gt: 20
		// 		},
		// 		'reactions.dislikes': {
		// 			$lte: 60
		// 		},
		// 		'author': {
		// 			$ne: 'Peter Parker'
		// 		}
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 4 - method 2
		// const tweets = await Tweet.find(
		// 	{
		// 		$and: [
		// 			{
		// 				'reactions.likes': {
		// 					$gt: 20
		// 				}
		// 			},
		// 			{ 
		// 				'reactions.dislikes': {
		// 					$lte: 60
		// 				}
		// 			},
		// 			{
		// 				'author': {
		// 					$ne: 'Peter Parker'
		// 				}
		// 			}
		// 		]
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 4 - method 3
		// await Tweet
		// 	.where('reactions.likes')
		// 	.gt(20)
		// 	.where('reactions.dislikes')
		// 	.lte(60)
		// 	.where('author')
		// 	.ne('Peter Parker')
		// 	.then(tweets => {
		// 		console.log(tweets.length)
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})

		// // Requirement 5 - method 1
		// const tweets = await Tweet.find(
		// 	{
		// 		author: {
		// 			$in: [
		// 				'Thor',
		// 				'Steve Rogers'
		// 			]
		// 		}
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 5 - method 2
		// const tweets = await Tweet.find(
		// 	{
		// 		$or: [
		// 			{
		// 				author: 'Thor'
		// 			},
		// 			{
		// 				author: 'Steve Rogers'
		// 			}
		// 		]	
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 5 - method 3
		// await Tweet
		// 	.where('author')
		// 	.in(['Thor', 'Steve Rogers'])
		// 	.then(tweets => {
		// 		console.log(tweets.length)
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})

		// // Requirement 6 - method 1
		// const tweets = await Tweet.find(
		// 	{
		// 		author: {
		// 			$nin: [
		// 				'Hawkeye',
		// 				'Dr. Banner',
		// 				'Thanos',
		// 				'Black Panther'
		// 			]
		// 		}
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 6 - method 2
		// const tweets = await Tweet.find(
		// 	{
		// 		$nor: [
		// 			{
		// 				author: 'Hawkeye'
		// 			},
		// 			{
		// 				author: 'Dr. Banner'
		// 			},
		// 			{
		// 				author: 'Thanos'
		// 			},
		// 			{
		// 				author: 'Black Panther'
		// 			}
		// 		]	
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 6 - method 3
		// await Tweet
		// 	.where('author')
		// 	.nin([
		// 		'Hawkeye',
		// 		'Dr. Banner',
		// 		'Thanos',
		// 		'Black Panther'
		// 	])
		// 	.then(tweets => {
		// 		console.log(tweets.length)
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})

		// // Requirement 7a - method 1
		// const page = 1
		// const resultsPerPage = 10
		// const tweets = await Tweet.find(
		// 	{},
		// 	'-_id title author',
		// 	{
		// 		skip: resultsPerPage * (page - 1),
		// 		limit: resultsPerPage
		// 	}
		// )
		// console.log(tweets.length)
		// res.send(tweets)

		// // Requirement 7a - method 2
		// const page = 1
		// const resultsPerPage = 10
		// await Tweet
		// 	.find()
		// 	.skip(resultsPerPage * (page - 1))
		// 	.limit(resultsPerPage)
		// 	.select('-_id title author')
		// 	.then(tweets => {
		// 		res.send(tweets)
		// 	})
		// 	.catch(err => {
		// 		throw err
		// 	})

	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.get('/:id', async (req, res) => {
	try {
		// METHOD 1
		const tweet = await Tweet.findOne({
			_id: req.params.id
		})
		const now = new Date()
		const createdAt = new Date(tweet.createdAt)
		let elapsed = now.getTime() - createdAt.getTime()
		// console.log('now >>', now.getTime())
		// console.log('createdAt >>', createdAt.getTime())
		console.log(elapsed)
		console.log(elapsed/86400000)
		if (tweet) {
			res.send(tweet)
		} else {
			res.status(404).send('Tweet not found')
		}

		// // METHOD 2
		// const tweet = await Tweet.findById(req.params.id)
		// if (tweet) {
		// 	res.send(tweet)
		// } else {
		// 	res.status(404).send('Tweet not found')
		// }
	} catch (e) {
		res.status(400).send({
			name: e.name,
			message: e.message
		})
	}
})

router.post('', async (req, res) => {
	try {
		res.send(await Tweet.create(req.body))
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
		
		// METHOD 1
		const deleteResponse = await Tweet.deleteOne({
			_id: req.params.id
		})
		console.log(deleteResponse)
		if (deleteResponse.deletedCount === 1) {
			res.send('Successfully deleted tweet using "deleteOne" method.')
		} else {
			throw new Error('The tweet you are trying to delete using "deleteOne" method does not exist.')
		}

		// // METHOD 2
		// const deleteResponse = await Tweet.findOneAndDelete({
		// 	_id: req.params.id
		// })
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findOneAndDelete" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "findOneAndDelete" method does not exist.')
		// }

		// // METHOD 3
		// const deleteResponse = await Tweet.findByIdAndDelete(req.params.id)
		// if (deleteResponse) {
		// 	res.send('Successfully deleted tweet using "findByIdAndDelete" method.')
		// } else {
		// 	throw new Error('The tweet you are trying to delete using "findByIdAndDelete" method does not exist.'
		// }

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