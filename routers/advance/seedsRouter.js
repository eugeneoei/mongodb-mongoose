const express = require('express')
const User = require('../../models/advance/user')
const Tweet = require('../../models/advance/tweet')
const Comment = require('../../models/advance/comment')

const usersSeed = require('../../seed/advance/usersSeed')
const tweetsSeed = require('../../seed/advance/tweetsSeed')
const commentsSeed = require('../../seed/advance/commentsSeed')

const router = express.Router()

const seedUsers = async () => {
	try {
		await User.insertMany(usersSeed)
		console.log('Seed users success')
	} catch(e) {
		console.log('Error while seeding Users')
		console.log(e)
	}
}

const seedTweets = async () => {
	try {
		// attach a random user and random number of comments to each tweet before inserting tweets
		const users = await User.find()
		const numberOfUsers = users.length
		const tweetsWithUser = tweetsSeed.map(tweet => {
			const randomUserIndex = Math.floor(Math.random() * numberOfUsers)
			const randomUser = users[randomUserIndex]
				return {
					...tweet,
					user: randomUser._id
				}
		})
		await Tweet.insertMany(tweetsWithUser)
		console.log('Seed tweets success')
	} catch(e) {
		console.log('Error while seeding Tweets')
		console.log(e)
	}
}

const seedComments = async () => {
	try {
		// 1. get all tweets and cycle through
		// 2. for each tweet, 
		// 		a. get random number (between 0 - 15) of comments from pool
		// 		b. for each of these comments, attach a random user
		// 		c. await promises of comments creation
		// 		d. update tweet with comments

		const users = await User.find()
		const numberOfUsers = users.length
		const tweets = await Tweet.find()
		const numberComments = commentsSeed.length
		for (let i = 0; i < tweets.length; i++) {
			const tweet = tweets[i]
			const numberOfCommentsToTakeFromPool = Math.floor(Math.random() * 25)
			const array = [...Array(numberOfCommentsToTakeFromPool).keys()]

			const commentsPromises = array.map(async () => {
				const randomUserIndex = Math.floor(Math.random() * numberOfUsers)
				const randomUser = users[randomUserIndex]
				const randomCommentIndex = Math.floor(Math.random() * numberComments)
				const randomComment = commentsSeed[randomCommentIndex]
				return await Comment.create({
					...randomComment,
					user: randomUser._id,
					tweet: tweet._id
				})
			})

			const commentsArray = await Promise.all(commentsPromises)
			await Tweet.findByIdAndUpdate(
				tweet['_id'],
				{
					comments: commentsArray.map(com => com._id)
				}
			)
		}
		console.log('Seed comments success')

	} catch(e) {
		console.log('Error while seeding Comments')
		console.log(e)
	}
}

router.get('/clear', async (req, res) => {
	try {
		await User.collection.drop()
		await Tweet.collection.drop()
		await Comment.collection.drop()
		res.send('ok')
	} catch(e) {
		throw e
	}
})

router.get('/seed', async (req, res) => {
	try {
		await seedUsers()
		await seedTweets()
		await seedComments()
		res.send('ok')
	} catch(e) {
		throw e
	}
})

router.get('/clear-and-seed', async (req, res) => {
	try {
		await User.collection.drop()
		await Tweet.collection.drop()
		await Comment.collection.drop()
		await seedUsers()
		await seedTweets()
		await seedComments()
		res.send('ok')
	} catch(e) {
		throw e
	}
})

module.exports = router
