const express = require('express')
const validateReactions = require('../../middlewares/validateReactions')
const Tweet = require('../../models/advance/tweet')
const User = require('../../models/advance//user')

const router = express.Router()

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
		// 	// perDocumentLimit: 3, // <-- limits number of ref results. not safe because of subsequent documents' ref results are inaccurate (refer to https://mongoosejs.com/docs/populate.html#limit-vs-perDocumentLimit)
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

		// // Requirement 1
		// show all tweets with populated user information for each tweet
		const tweets = await Tweet.find(
			{
			// 	comments: '6121f46362153826bb31dca9'
			}
		)
		// .populate({
		// 	path: 'user',
		// 	select: 'firstName lastName email'
		// })
		// .populate([
		// 	// {
		// 	// 	path: 'user',
		// 	// 	select: ['_id', 'email', 'firstName', 'lastName']
		// 	// },
		// 	{
		// 		path: 'comments',
		// 		select: ['body', '_id'],
		// 		populate: {
		// 			path: 'user',
		// 			select: ['_id', 'email', 'firstName', 'lastName']
		// 		}
		// 		// sort flag?
		// 	}
		// ])
		res.send(tweets)

		// const tweets = await Tweet.find(
		// 	{
		// 		comments: '6121f46362153826bb31dca9'
		// 	}
		// )
		// .populate([
		// 	// {
		// 	// 	path: 'user',
		// 	// 	select: ['_id', 'email', 'firstName', 'lastName']
		// 	// },
		// 	{
		// 		path: 'comments',
		// 		select: ['body', '_id'],
		// 		populate: {
		// 			path: 'user',
		// 			select: ['_id', 'email', 'firstName', 'lastName']
		// 		}
		// 		// sort flag?
		// 	}
		// ])
		// console.log(tweets.length)
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
		// const tweet = await Tweet.findById(req.params.id)
		// if (tweet) {
		// 	res.send(tweet)
		// } else {
		// 	res.status(404).send('Tweet not found')
		// }

		// Requirement 1 - populate 1 ref field
		// populate user ref who created tweet
		const tweet = await Tweet.findById(
			req.params.id
		)
		.populate({
			path: 'user',
			select: ['_id', 'email', 'firstName', 'lastName']
		})
		res.send(tweet)

		// // Requirement 2 - populate multiple ref fields
		// // populate user ref who created tweet
		// // populate comment ref and user who create each individual comment
		// const tweet = await Tweet.findById(
		// 	req.params.id
		// )
		// .populate([
		// 	{
		// 		path: 'user',
		// 		select: ['_id', 'email', 'firstName', 'lastName']
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


		// // Requirement 3 - populate multiple ref fields and pagination
		// // populate user ref who created tweet
		// // populate comment ref and user who create each individual comment
		// // paginate tweet's comments : Show page 1 comments and 5 tweets per page
		// const page = 1
		// const resultsPerPage = 5
		// const tweet = await Tweet.findById(
		// 	req.params.id
		// )
		// .populate([
		// 	{
		// 		path: 'user',
		// 		select: ['_id', 'email', 'firstName', 'lastName']
		// 	},
		// 	{
		// 		path: 'comments',
		// 		select: ['body', '_id'],
		// 		populate: {
		// 			path: 'user',
		// 			select: ['_id', 'email', 'firstName', 'lastName']
		// 		},
		// 		options: {
		// 			// "skip" and "limit" in options to paginate ref documents
		// 			skip: resultsPerPage * (page - 1),
		// 			limit: resultsPerPage
		// 		}
		// 	}
		// ])
		// res.send(tweet)


		// // Requirement 4
		// // populate user who created tweet
		// // view only comments by user whose email is "tony.stark@avengers.com"
		// const tweet = await Tweet.findById(
		// 	req.params.id
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
		// 					$eq: 'tony.stark@avengers.com'
		// 				}
		// 			},
		// 			select: ['_id', 'email', 'firstName', 'lastName'],
		// 		}
		// 	}
		// ])
		// res.send(tweet)


		// // Requirement 5
		// // populate user who created tweet
		// // view only comments by users whose emails are "steve.rogers@avengers.com" or "black.panther@avengers.com"
		// const tweet = await Tweet.findById(
		// 	req.params.id
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
		// 						'steve.rogers@avengers.com',
		// 						'black.panther@avengers.com'
		// 					]
		// 				}
		// 			},
		// 			select: '_id email firstName lastName'
		// 		}
		// 	}
		// ])
		// res.send(tweet)

		// const tweet = Tweet.findOne(
		// 	{
		// 		comments: '6121cc181851fa25add43391'
		// 	}
		// )
		// res.send(tweet)


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