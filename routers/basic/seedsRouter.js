const express = require('express')
const Tweet = require('../../models/basic/tweet')
const tweetsSeed = require('../../seed/basic/tweetsSeed')

const router = express.Router()

router.get('', async (req, res) => {
	try {
		await Tweet.insertMany(tweetsSeed)
		res.send('ok')
	} catch(e) {
		console.log('Error while seeding Tweets')
		throw e
	}
})

router.get('/clear', async (req, res) => {
	try {
		await Tweet.collection.drop()
		res.send('ok')
	} catch (e) {
		console.log('Error while dropping Tweets collection')
		throw e
	}
})

router.get('/clear-and-seed', async (req, res) => {
	try {
		await Tweet.collection.drop()
		await Tweet.insertMany(tweetsSeed)
		res.send('ok')
	} catch (e) {
		console.log('Error while dropping and seeding Tweets collection')
		throw e
	}
})

module.exports = router
